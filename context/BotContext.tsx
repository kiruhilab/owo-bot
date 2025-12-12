import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Alert, Platform, Vibration } from 'react-native';
import {
  BotContextType,
  BotState,
  DEFAULT_PROFILES,
  Profile
} from '../types/bot';

const STORAGE_KEY = '@owo_bot_profiles';
const ACTIVE_PROFILE_KEY = '@owo_bot_active_profile';
const SERVER_URL_KEY = '@owo_server_url';

const BotContext = createContext<BotContextType | undefined>(undefined);

export const useBotContext = (): BotContextType => {
  const context = useContext(BotContext);
  if (!context) {
    throw new Error('useBotContext must be used within a BotProvider');
  }
  return context;
};

// Extended context type for server connection
interface ExtendedBotContextType extends BotContextType {
  serverUrl: string;
  setServerUrl: (url: string) => void;
  isConnected: boolean;
  isAuthorized: boolean;
  connectToServer: () => Promise<boolean>;
  requestAuthorization: () => Promise<boolean>;
}

interface BotProviderProps {
  children: React.ReactNode;
}

export const BotProvider: React.FC<BotProviderProps> = ({ children }) => {
  const [profiles, setProfiles] = useState<Profile[]>(DEFAULT_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState<string>('normal');
  const [botState, setBotState] = useState<BotState>({
    isRunning: false,
    activeProfileId: 'normal',
    lastCommand: null,
    commandCount: 0,
  });
  const [serverUrl, setServerUrlState] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    loadSavedData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profiles)).catch(console.error);
  }, [profiles]);

  // Poll server status when connected
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (serverUrl && isConnected) {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`${serverUrl}/api/status`);
          if (response.ok) {
            const data = await response.json();
            setBotState((prev) => ({
              ...prev,
              isRunning: data.state.is_running,
              commandCount: data.state.command_count,
              lastCommand: data.state.last_command,
            }));
            setIsAuthorized(data.state.authorized);
          } else {
            setIsConnected(false);
          }
        } catch {
          // Connection lost
        }
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [serverUrl, isConnected]);

  const loadSavedData = async (): Promise<void> => {
    try {
      const savedProfiles = await AsyncStorage.getItem(STORAGE_KEY);
      const savedActiveProfile = await AsyncStorage.getItem(ACTIVE_PROFILE_KEY);
      const savedServerUrl = await AsyncStorage.getItem(SERVER_URL_KEY);
      
      if (savedProfiles) setProfiles(JSON.parse(savedProfiles));
      if (savedActiveProfile) setActiveProfileId(savedActiveProfile);
      if (savedServerUrl) setServerUrlState(savedServerUrl);
    } catch (error) {
      console.error('Load error:', error);
    }
  };

  const showMessage = (title: string, message: string): void => {
    if (Platform.OS === 'web') {
      alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const setServerUrl = async (url: string): Promise<void> => {
    // Normalize URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http')) {
      normalizedUrl = `http://${normalizedUrl}`;
    }
    if (normalizedUrl.endsWith('/')) {
      normalizedUrl = normalizedUrl.slice(0, -1);
    }
    
    setServerUrlState(normalizedUrl);
    await AsyncStorage.setItem(SERVER_URL_KEY, normalizedUrl);
    setIsConnected(false);
    setIsAuthorized(false);
  };

  const connectToServer = async (): Promise<boolean> => {
    if (!serverUrl) {
      showMessage('Hata', 'Sunucu adresi girilmedi');
      return false;
    }

    try {
      console.log('🔌 Sunucuya bağlanılıyor:', serverUrl);
      const response = await fetch(`${serverUrl}/api/status`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setIsConnected(true);
        setIsAuthorized(data.state.authorized);
        
        if (Platform.OS !== 'web') {
          Vibration.vibrate(100);
        }
        
        showMessage('✅ Bağlandı', `Sunucuya bağlanıldı!\n\nYetkilendirme: ${data.state.authorized ? 'Onaylandı' : 'Gerekli'}`);
        return true;
      } else {
        showMessage('Hata', 'Sunucu yanıt vermedi');
        return false;
      }
    } catch (error) {
      console.error('Connection error:', error);
      showMessage('Bağlantı Hatası', `Sunucuya bağlanılamadı.\n\nSunucunun çalıştığından ve aynı ağda olduğunuzdan emin olun.\n\nAdres: ${serverUrl}`);
      setIsConnected(false);
      return false;
    }
  };

  const requestAuthorization = async (): Promise<boolean> => {
    if (!isConnected) {
      showMessage('Hata', 'Önce sunucuya bağlanın');
      return false;
    }

    try {
      const deviceName = Platform.OS === 'web' ? 'Web Tarayıcı' : `${Platform.OS} Cihaz`;
      
      const response = await fetch(`${serverUrl}/api/auth/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_name: deviceName }),
      });

      if (response.ok) {
        showMessage(
          '🔐 Yetkilendirme İsteği',
          'Bilgisayarınıza bir yetkilendirme isteği gönderildi.\n\n' +
          'Bilgisayar konsolunda "evet" yazarak onaylayın.'
        );
        
        // Poll for auth status
        const checkAuth = async (): Promise<void> => {
          for (let i = 0; i < 30; i++) {
            await new Promise((r) => setTimeout(r, 1000));
            
            try {
              const authResponse = await fetch(`${serverUrl}/api/auth/check`);
              if (authResponse.ok) {
                const authData = await authResponse.json();
                if (authData.authorized) {
                  setIsAuthorized(true);
                  showMessage('✅ Yetkilendirildi', 'Bağlantı onaylandı! Artık botu kontrol edebilirsiniz.');
                  return;
                }
                if (!authData.pending) {
                  showMessage('❌ Reddedildi', 'Yetkilendirme isteği reddedildi.');
                  return;
                }
              }
            } catch {
              // Continue polling
            }
          }
          showMessage('⏰ Zaman Aşımı', 'Yetkilendirme isteği zaman aşımına uğradı.');
        };
        
        checkAuth();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Auth request error:', error);
      return false;
    }
  };

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || null;

  const setActiveProfile = useCallback(async (profileId: string): Promise<void> => {
    setActiveProfileId(profileId);
    setBotState((prev) => ({ ...prev, activeProfileId: profileId }));
    await AsyncStorage.setItem(ACTIVE_PROFILE_KEY, profileId).catch(console.error);
  }, []);

  const updateProfile = useCallback((updatedProfile: Profile): void => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
    );
  }, []);

  const toggleCommand = useCallback(async (profileId: string, commandId: string): Promise<void> => {
    setProfiles((prev) =>
      prev.map((profile) => {
        if (profile.id !== profileId) return profile;
        return {
          ...profile,
          commands: profile.commands.map((cmd) =>
            cmd.id === commandId ? { ...cmd, enabled: !cmd.enabled } : cmd
          ),
        };
      })
    );

    // Sync with server if connected
    if (isConnected && isAuthorized) {
      try {
        await fetch(`${serverUrl}/api/commands/toggle`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: commandId }),
        });
      } catch {
        // Ignore sync errors
      }
    }
  }, [isConnected, isAuthorized, serverUrl]);

  const updateCommandDelay = useCallback(
    (profileId: string, commandId: string, delayBase: number, delaySpread: number): void => {
      setProfiles((prev) =>
        prev.map((profile) => {
          if (profile.id !== profileId) return profile;
          return {
            ...profile,
            commands: profile.commands.map((cmd) =>
              cmd.id === commandId ? { ...cmd, delayBase, delaySpread } : cmd
            ),
          };
        })
      );
    },
    []
  );

  const updateLoopDelay = useCallback(
    (profileId: string, loopDelay: number, loopSpread: number): void => {
      setProfiles((prev) =>
        prev.map((profile) =>
          profile.id === profileId ? { ...profile, loopDelay, loopSpread } : profile
        )
      );
    },
    []
  );

  const startBot = useCallback(async (): Promise<void> => {
    if (!isConnected) {
      showMessage('Hata', 'Sunucuya bağlı değilsiniz. Önce bağlanın.');
      return;
    }

    if (!isAuthorized) {
      showMessage('Hata', 'Yetkilendirme gerekli. Önce yetki isteyin.');
      return;
    }

    try {
      const response = await fetch(`${serverUrl}/api/bot/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setBotState((prev) => ({ ...prev, isRunning: true, commandCount: 0 }));
        
        if (Platform.OS !== 'web') {
          Vibration.vibrate([0, 100, 50, 100]);
        }
        
        showMessage('🤖 Bot Başladı', 'Bot bilgisayarda Discord\'a mesaj göndermeye başladı!');
      } else {
        const error = await response.json();
        showMessage('Hata', error.error || 'Bot başlatılamadı');
      }
    } catch (error) {
      console.error('Start bot error:', error);
      showMessage('Hata', 'Bot başlatılırken hata oluştu');
    }
  }, [isConnected, isAuthorized, serverUrl]);

  const stopBot = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch(`${serverUrl}/api/bot/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setBotState((prev) => ({ ...prev, isRunning: false }));
        showMessage('⏹️ Bot Durduruldu', data.message);
      }
    } catch (error) {
      console.error('Stop bot error:', error);
      // Force local state update
      setBotState((prev) => ({ ...prev, isRunning: false }));
    }
  }, [serverUrl]);

  const sendCommand = useCallback(async (command: string): Promise<void> => {
    if (!isConnected || !isAuthorized) {
      showMessage('Hata', 'Sunucuya bağlı ve yetkili olmalısınız');
      return;
    }

    try {
      const response = await fetch(`${serverUrl}/api/bot/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      });

      if (response.ok) {
        const data = await response.json();
        setBotState((prev) => ({
          ...prev,
          lastCommand: command,
          commandCount: data.state.command_count,
        }));
        
        if (Platform.OS !== 'web') {
          Vibration.vibrate(100);
        }
        
        showMessage('✅ Gönderildi', `"${command}" Discord'a yazıldı!`);
      } else {
        const error = await response.json();
        showMessage('Hata', error.error || 'Komut gönderilemedi');
      }
    } catch (error) {
      console.error('Send command error:', error);
      showMessage('Hata', 'Komut gönderilirken hata oluştu');
    }
  }, [isConnected, isAuthorized, serverUrl]);

  const value: ExtendedBotContextType = {
    profiles,
    activeProfile,
    botState,
    setActiveProfile,
    updateProfile,
    toggleCommand,
    updateCommandDelay,
    updateLoopDelay,
    startBot,
    stopBot,
    sendCommand,
    serverUrl,
    setServerUrl,
    isConnected,
    isAuthorized,
    connectToServer,
    requestAuthorization,
  };

  return <BotContext.Provider value={value as BotContextType}>{children}</BotContext.Provider>;
};

export default BotContext;
