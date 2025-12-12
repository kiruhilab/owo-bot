import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CommandCard, GlassCard, ProfileSelector } from '../../components/ui';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/theme';
import { useBotContext } from '../../context/BotContext';
import { CommandConfig } from '../../types/bot';

export default function HomeScreen() {
  const {
    profiles,
    activeProfile,
    botState,
    setActiveProfile,
    toggleCommand,
    sendCommand,
    startBot,
    stopBot,
    serverUrl,
    setServerUrl,
    isConnected,
    isAuthorized,
    connectToServer,
    requestAuthorization,
  } = useBotContext();

  const [inputUrl, setInputUrl] = useState(serverUrl || '');

  const handleConnect = async () => {
    if (setServerUrl) {
      await setServerUrl(inputUrl);
    }
    if (connectToServer) {
      await connectToServer();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>OWO Bot</Text>
          <Text style={styles.subtitle}>Discord Komut Yöneticisi</Text>
        </View>

        {/* Server Connection Card */}
        <GlassCard style={styles.serverCard}>
          <Text style={styles.serverTitle}>🖥️ Bilgisayar Bağlantısı</Text>
          
          <View style={styles.serverInputRow}>
            <TextInput
              style={styles.serverInput}
              placeholder="örn: 192.168.1.100:5000"
              placeholderTextColor={Colors.textMuted}
              value={inputUrl}
              onChangeText={setInputUrl}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={[styles.connectButton, isConnected && styles.connectButtonConnected]}
              onPress={handleConnect}
            >
              <Text style={styles.connectButtonText}>
                {isConnected ? '✓' : 'Bağlan'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statusRow}>
            <View style={[styles.statusDot, isConnected ? styles.statusDotGreen : styles.statusDotRed]} />
            <Text style={styles.statusText}>
              {isConnected 
                ? (isAuthorized ? '✅ Bağlı ve Yetkili' : '🔐 Bağlı - Yetki Gerekli')
                : '❌ Bağlı Değil'}
            </Text>
          </View>

          {isConnected && !isAuthorized && (
            <TouchableOpacity
              style={styles.authButton}
              onPress={requestAuthorization}
            >
              <Text style={styles.authButtonText}>🔐 Yetki İste</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.serverHint}>
            💡 Bilgisayarda server.py çalıştırın ve IP adresini girin
          </Text>
        </GlassCard>

        {/* Bot Control Button */}
        <TouchableOpacity
          style={[
            styles.botButton,
            botState.isRunning ? styles.botButtonStop : styles.botButtonStart,
            (!isConnected || !isAuthorized) && styles.botButtonDisabled,
          ]}
          onPress={botState.isRunning ? stopBot : startBot}
          activeOpacity={0.8}
          disabled={!isConnected || !isAuthorized}
        >
          <Text style={styles.botButtonIcon}>
            {botState.isRunning ? '⏹️' : '▶️'}
          </Text>
          <View>
            <Text style={styles.botButtonText}>
              {botState.isRunning ? 'Botu Durdur' : 'Botu Başlat'}
            </Text>
            <Text style={styles.botButtonSubtext}>
              {!isConnected 
                ? 'Önce bilgisayara bağlanın'
                : !isAuthorized
                ? 'Önce yetki alın'
                : botState.isRunning 
                ? 'Discord\'a otomatik yazılıyor' 
                : 'Bilgisayarda Discord\'a yazar'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Stats Card */}
        <GlassCard style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{botState.commandCount}</Text>
              <Text style={styles.statLabel}>Komut</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, botState.isRunning && styles.statValueActive]}>
                {botState.isRunning ? '🟢 Aktif' : '⚫ Kapalı'}
              </Text>
              <Text style={styles.statLabel}>Durum</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, styles.statusValue]}>
                {botState.lastCommand || '-'}
              </Text>
              <Text style={styles.statLabel}>Son Komut</Text>
            </View>
          </View>
        </GlassCard>

        {/* Profile Selector */}
        <ProfileSelector
          profiles={profiles}
          activeProfileId={activeProfile?.id || 'normal'}
          onSelectProfile={setActiveProfile}
        />

        {/* Commands Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Komutlar</Text>
          <Text style={styles.sectionSubtitle}>
            Tek komut göndermek için 📋 butonuna tıklayın
          </Text>

          {activeProfile?.commands.map((command: CommandConfig) => (
            <CommandCard
              key={command.id}
              command={command}
              onToggle={() => toggleCommand(activeProfile.id, command.id)}
              onPress={() => {}}
              onSendCommand={() => sendCommand(command.command)}
            />
          ))}
        </View>

        {/* Info Card */}
        <GlassCard style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 Nasıl Kullanılır</Text>
          <Text style={styles.infoText}>
            1. Bilgisayarda server.py çalıştırın{'\n'}
            2. Sunucu adresini girin ve bağlanın{'\n'}
            3. Bilgisayarda &quot;evet&quot; yazarak yetki verin{'\n'}
            4. Discord penceresini açık tutun{'\n'}
            5. &quot;Botu Başlat&quot; butonuna basın
          </Text>
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxxl,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  title: {
    color: Colors.text,
    fontSize: Typography.fontSizes.xxxl,
    fontWeight: Typography.fontWeights.bold,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSizes.md,
    marginTop: 4,
  },
  serverCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  serverTitle: {
    color: Colors.text,
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.semibold,
    marginBottom: Spacing.md,
  },
  serverInputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  serverInput: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.text,
    fontSize: Typography.fontSizes.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  connectButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectButtonConnected: {
    backgroundColor: Colors.secondary,
  },
  connectButtonText: {
    color: Colors.text,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.semibold,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: Spacing.sm,
  },
  statusDotGreen: {
    backgroundColor: Colors.secondary,
  },
  statusDotRed: {
    backgroundColor: Colors.error,
  },
  statusText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSizes.sm,
  },
  authButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  authButtonText: {
    color: Colors.text,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.semibold,
  },
  serverHint: {
    color: Colors.textMuted,
    fontSize: Typography.fontSizes.xs,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  botButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.lg,
  },
  botButtonStart: {
    backgroundColor: Colors.secondary,
  },
  botButtonStop: {
    backgroundColor: Colors.error,
  },
  botButtonDisabled: {
    backgroundColor: Colors.backgroundTertiary,
    opacity: 0.6,
  },
  botButtonIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  botButtonText: {
    color: Colors.text,
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
  },
  botButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: Typography.fontSizes.sm,
    marginTop: 2,
  },
  statsCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: Colors.primary,
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    marginBottom: 4,
  },
  statValueActive: {
    color: Colors.secondary,
  },
  statusValue: {
    fontSize: Typography.fontSizes.sm,
    fontFamily: 'monospace',
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSizes.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.semibold,
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSizes.sm,
    marginBottom: Spacing.lg,
  },
  infoCard: {
    marginHorizontal: Spacing.lg,
  },
  infoTitle: {
    color: Colors.text,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.semibold,
    marginBottom: Spacing.sm,
  },
  infoText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSizes.sm,
    lineHeight: 22,
  },
});
