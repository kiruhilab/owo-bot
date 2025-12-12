import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GlassCard, KeyboardButton } from '../../components/ui';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { useBotContext } from '../../context/BotContext';
import { CommandConfig } from '../../types/bot';
export default function KeyboardScreen() {
  const { activeProfile, sendCommand, botState } = useBotContext();

  if (!activeProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>⌨️</Text>
          <Text style={styles.emptyText}>Profil seçilmedi</Text>
        </View>
      </SafeAreaView>
    );
  }

  const enabledCommands = activeProfile.commands.filter((cmd: CommandConfig) => cmd.enabled);

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
          <Text style={styles.title}>Klavye</Text>
          <Text style={styles.subtitle}>Hızlı komut kopyalama</Text>
        </View>

        {/* Status Card */}
        <GlassCard style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Aktif Profil</Text>
              <Text style={styles.statusValue}>
                {activeProfile.icon} {activeProfile.name}
              </Text>
            </View>
            <View style={styles.statusDivider} />
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Gönderilen</Text>
              <Text style={styles.statusValue}>{botState.commandCount}</Text>
            </View>
          </View>
          {botState.lastCommand && (
            <View style={styles.lastCommandRow}>
              <Text style={styles.lastCommandLabel}>Son komut:</Text>
              <Text style={styles.lastCommandValue}>{botState.lastCommand}</Text>
            </View>
          )}
        </GlassCard>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            Butona tıklayın → Komut panoya kopyalanır → Discord&apos;a yapıştırın
          </Text>
        </View>

        {/* Keyboard Buttons */}
        <View style={styles.keyboardContainer}>
          <View style={styles.keyboardGrid}>
            {enabledCommands.map((command: CommandConfig, index: number) => (
              <View key={command.id} style={styles.buttonWrapper}>
                <KeyboardButton
                  command={command.command}
                  label={command.name}
                  icon={command.icon}
                  onPress={() => sendCommand(command.command)}
                  variant={
                    index === 0
                      ? 'primary'
                      : index === 1
                      ? 'secondary'
                      : 'accent'
                  }
                />
              </View>
            ))}
          </View>

          {enabledCommands.length === 0 && (
            <View style={styles.noCommandsContainer}>
              <Text style={styles.noCommandsIcon}>🔇</Text>
              <Text style={styles.noCommandsText}>
                Aktif komut yok
              </Text>
              <Text style={styles.noCommandsSubtext}>
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Tüm Komutlar</Text>
          <View style={styles.allCommandsGrid}>
            {activeProfile.commands.map((command: CommandConfig) => (
              <GlassCard
                key={command.id}
                style={[
                  styles.miniCommandCard,
                  !command.enabled && styles.miniCommandCardDisabled,
                ]}
                onPress={() => sendCommand(command.command)}
              >
                <Text style={styles.miniCommandIcon}>{command.icon}</Text>
                <Text
                  style={[
                    styles.miniCommandName,
                    !command.enabled && styles.miniCommandNameDisabled,
                  ]}
                >
                  {command.name}
                </Text>
                <Text style={styles.miniCommandText}>{command.command}</Text>
              </GlassCard>
            ))}
          </View>
        </View>

        {/* Tips */}
        <GlassCard style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>📱 Kullanım İpucu</Text>
          <Text style={styles.tipsText}>
            Discord uygulamasını açık tutun ve bu ekrandan hızlıca komut kopyalayarak
            yapıştırabilirsiniz.
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
  statusCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
  },
  statusLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSizes.xs,
    marginBottom: 4,
  },
  statusValue: {
    color: Colors.text,
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.semibold,
  },
  statusDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  lastCommandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  lastCommandLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSizes.sm,
    marginRight: Spacing.sm,
  },
  lastCommandValue: {
    color: Colors.primary,
    fontSize: Typography.fontSizes.md,
    fontFamily: 'monospace',
    fontWeight: Typography.fontWeights.semibold,
  },
  instructionsContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  instructionsText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSizes.sm,
    textAlign: 'center',
  },
  keyboardContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  keyboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  buttonWrapper: {
    marginBottom: Spacing.md,
  },
  noCommandsContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
  },
  noCommandsIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  noCommandsText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.medium,
  },
  noCommandsSubtext: {
    color: Colors.textMuted,
    fontSize: Typography.fontSizes.sm,
    marginTop: 4,
  },
  quickActionsSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.semibold,
    marginBottom: Spacing.lg,
  },
  allCommandsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  miniCommandCard: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  miniCommandCardDisabled: {
    opacity: 0.5,
  },
  miniCommandIcon: {
    fontSize: 28,
    marginBottom: Spacing.sm,
  },
  miniCommandName: {
    color: Colors.text,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.semibold,
    marginBottom: 4,
  },
  miniCommandNameDisabled: {
    color: Colors.textMuted,
  },
  miniCommandText: {
    color: Colors.primary,
    fontSize: Typography.fontSizes.xs,
    fontFamily: 'monospace',
  },
  tipsCard: {
    marginHorizontal: Spacing.lg,
  },
  tipsTitle: {
    color: Colors.text,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.semibold,
    marginBottom: Spacing.sm,
  },
  tipsText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSizes.sm,
    lineHeight: 22,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSizes.lg,
  },
});
