// Bot configuration and profile types
export interface CommandConfig {
  id: string;
  name: string;
  command: string;
  enabled: boolean;
  delayBase: number;
  delaySpread: number;
  icon: string;
}

export interface Profile {
  id: string;
  name: string;
  description: string;
  icon: string;
  commands: CommandConfig[];
  loopDelay: number;
  loopSpread: number;
}

export interface BotState {
  isRunning: boolean;
  activeProfileId: string;
  lastCommand: string | null;
  commandCount: number;
}

export interface BotContextType {
  profiles: Profile[];
  activeProfile: Profile | null;
  botState: BotState;
  setActiveProfile: (profileId: string) => void;
  updateProfile: (profile: Profile) => void;
  toggleCommand: (profileId: string, commandId: string) => void;
  updateCommandDelay: (
    profileId: string,
    commandId: string,
    delayBase: number,
    delaySpread: number
  ) => void;
  updateLoopDelay: (profileId: string, loopDelay: number, loopSpread: number) => void;
  startBot: () => void;
  stopBot: () => void;
  sendCommand: (command: string) => void;
  // Server connection
  serverUrl?: string;
  setServerUrl?: (url: string) => void;
  isConnected?: boolean;
  isAuthorized?: boolean;
  connectToServer?: () => Promise<boolean>;
  requestAuthorization?: () => Promise<boolean>;
}

// Default command configurations
export const DEFAULT_COMMANDS: CommandConfig[] = [
  {
    id: 'hunt',
    name: 'Hunt',
    command: 'owo h',
    enabled: true,
    delayBase: 1.5,
    delaySpread: 2.0,
    icon: '🎯',
  },
  {
    id: 'battle',
    name: 'Battle',
    command: 'owo b',
    enabled: true,
    delayBase: 1.5,
    delaySpread: 2.0,
    icon: '⚔️',
  },
  {
    id: 'pray',
    name: 'Pray',
    command: 'owo pray',
    enabled: true,
    delayBase: 3.0,
    delaySpread: 2.0,
    icon: '🙏',
  },
  {
    id: 'daily',
    name: 'Daily',
    command: 'owo daily',
    enabled: true,
    delayBase: 3.0,
    delaySpread: 2.0,
    icon: '📅',
  },
];

// Default profiles
export const DEFAULT_PROFILES: Profile[] = [
  {
    id: 'aggressive',
    name: 'Agresif',
    description: 'Hızlı komut gönderimi, minimum bekleme',
    icon: '🔥',
    loopDelay: 15,
    loopSpread: 5,
    commands: DEFAULT_COMMANDS.map((cmd) => ({ ...cmd })),
  },
  {
    id: 'normal',
    name: 'Normal',
    description: 'Dengeli hız ve güvenlik',
    icon: '⚡',
    loopDelay: 25,
    loopSpread: 10,
    commands: DEFAULT_COMMANDS.map((cmd) => ({ ...cmd })),
  },
  {
    id: 'stealth',
    name: 'Gizli',
    description: 'Yavaş ve güvenli, tespit riski düşük',
    icon: '🥷',
    loopDelay: 45,
    loopSpread: 20,
    commands: DEFAULT_COMMANDS.map((cmd) => ({
      ...cmd,
      delayBase: cmd.delayBase * 2,
      delaySpread: cmd.delaySpread * 2,
    })),
  },
  {
    id: 'custom',
    name: 'Özel',
    description: 'Kendi ayarlarını oluştur',
    icon: '⚙️',
    loopDelay: 25,
    loopSpread: 10,
    commands: DEFAULT_COMMANDS.map((cmd) => ({ ...cmd })),
  },
];
