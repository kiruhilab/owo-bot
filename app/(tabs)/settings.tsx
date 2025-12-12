import React, { useState } from 'react';
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { DelaySlider, GlassCard, ToggleSwitch } from '../../components/ui';
import { BorderRadius, Colors, Spacing, Typography } from '../../constants/theme';
import { useBotContext } from '../../context/BotContext';
import { CommandConfig } from '../../types/bot';

export default function SettingsScreen() {
  const {
    activeProfile,
    toggleCommand,
    updateCommandDelay,
    updateLoopDelay,
  } = useBotContext();

  const [selectedCommand, setSelectedCommand] = useState<CommandConfig | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  if (!activeProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>⚙️</Text>
          <Text style={styles.emptyText}>Profil seçilmedi</Text>
        </View>
      </SafeAreaView>
    );
  }

  const openCommandSettings = (command: CommandConfig) => {
    setSelectedCommand(command);
    setModalVisible(true);
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
          <Text style={styles.title}>Ayarlar</Text>
          <Text style={styles.subtitle}>
            {activeProfile.icon} {activeProfile.name} Profili
          </Text>
        </View>

        {/* Loop Delay Settings */}
        <GlassCard style={styles.card} title="🔄 Döngü Ayarları">
          <DelaySlider
            label="Ana Döngü Gecikmesi"
            baseValue={activeProfile.loopDelay}
            spreadValue={activeProfile.loopSpread}
            onBaseValueChange={(value) =>
              updateLoopDelay(activeProfile.id, value, activeProfile.loopSpread)
            }
            onSpreadValueChange={(value) =>
              updateLoopDelay(activeProfile.id, activeProfile.loopDelay, value)
            }
            minBase={5}
            maxBase={120}
            minSpread={0}
            maxSpread={60}
          />
        </GlassCard>

        {/* Command Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Komut Ayarları</Text>
          <Text style={styles.sectionSubtitle}>
            Her komut için gecikme ayarlarını düzenleyebilirsiniz
          </Text>

          {activeProfile.commands.map((command: CommandConfig) => (
            <GlassCard
              key={command.id}
              style={styles.commandCard}
              onPress={() => openCommandSettings(command)}
            >
              <View style={styles.commandHeader}>
                <View style={styles.commandInfo}>
                  <Text style={styles.commandIcon}>{command.icon}</Text>
                  <View>
                    <Text style={styles.commandName}>{command.name}</Text>
                    <Text style={styles.commandText}>{command.command}</Text>
                  </View>
                </View>
                <ToggleSwitch
                  value={command.enabled}
                  onValueChange={() => toggleCommand(activeProfile.id, command.id)}
                  size="small"
                />
              </View>

              <View style={styles.commandDelay}>
                <View style={styles.delayItem}>
                  <Text style={styles.delayLabel}>Temel</Text>
                  <Text style={styles.delayValue}>{command.delayBase.toFixed(1)}s</Text>
                </View>
                <View style={styles.delayItem}>
                  <Text style={styles.delayLabel}>Yayılım</Text>
                  <Text style={styles.delayValue}>±{command.delaySpread.toFixed(1)}s</Text>
                </View>
                <View style={styles.delayItem}>
                  <Text style={styles.delayLabel}>Aralık</Text>
                  <Text style={styles.delayValueRange}>
                    {Math.max(0, command.delayBase - command.delaySpread).toFixed(1)} -{' '}
                    {(command.delayBase + command.delaySpread).toFixed(1)}s
                  </Text>
                </View>
              </View>

              <Text style={styles.tapHint}>Ayarları düzenlemek için dokunun</Text>
            </GlassCard>
          ))}
        </View>

        {/* Tips */}
        <GlassCard style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 İpuçları</Text>
          <Text style={styles.tipsText}>
            • Daha yüksek yayılım değerleri daha rastgele davranış sağlar{'\n'}
            • Düşük gecikme değerleri tespit riskini artırır{'\n'}
            • &quot;Gizli&quot; profili güvenli kullanım için önerilir
          </Text>
        </GlassCard>
      </ScrollView>

      {/* Command Settings Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedCommand && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalIcon}>{selectedCommand.icon}</Text>
                  <Text style={styles.modalTitle}>{selectedCommand.name}</Text>
                </View>

                <DelaySlider
                  label="Komut Gecikmesi"
                  baseValue={selectedCommand.delayBase}
                  spreadValue={selectedCommand.delaySpread}
                  onBaseValueChange={(value) => {
                    updateCommandDelay(
                      activeProfile.id,
                      selectedCommand.id,
                      value,
                      selectedCommand.delaySpread
                    );
                    setSelectedCommand({ ...selectedCommand, delayBase: value });
                  }}
                  onSpreadValueChange={(value) => {
                    updateCommandDelay(
                      activeProfile.id,
                      selectedCommand.id,
                      selectedCommand.delayBase,
                      value
                    );
                    setSelectedCommand({ ...selectedCommand, delaySpread: value });
                  }}
                  minBase={0.5}
                  maxBase={30}
                  minSpread={0}
                  maxSpread={15}
                />

                <View style={styles.modalActions}>
                  <GlassCard
                    style={styles.modalButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Tamam</Text>
                  </GlassCard>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  card: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
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
  commandCard: {
    marginBottom: Spacing.md,
  },
  commandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  commandInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commandIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  commandName: {
    color: Colors.text,
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.semibold,
  },
  commandText: {
    color: Colors.primary,
    fontSize: Typography.fontSizes.sm,
    fontFamily: 'monospace',
  },
  commandDelay: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  delayItem: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  delayLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSizes.xs,
    marginBottom: 2,
  },
  delayValue: {
    color: Colors.primary,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.bold,
  },
  delayValueRange: {
    color: Colors.secondary,
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.semibold,
  },
  tapHint: {
    color: Colors.textMuted,
    fontSize: Typography.fontSizes.xs,
    textAlign: 'center',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.backgroundSecondary,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  modalIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  modalTitle: {
    color: Colors.text,
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
  },
  modalActions: {
    marginTop: Spacing.xl,
  },
  modalButton: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  modalButtonText: {
    color: Colors.primary,
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.semibold,
  },
});
