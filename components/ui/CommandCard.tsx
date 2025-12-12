import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/theme';
import { CommandConfig } from '../../types/bot';
import { ToggleSwitch } from './ToggleSwitch';

interface CommandCardProps {
  command: CommandConfig;
  onToggle: () => void;
  onPress: () => void;
  onSendCommand: () => void;
}

export const CommandCard: React.FC<CommandCardProps> = ({
  command,
  onToggle,
  onPress,
  onSendCommand,
}) => {
  return (
    <View style={[styles.container, command.enabled && styles.containerEnabled]}>
      <TouchableOpacity
        style={styles.mainContent}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{command.icon}</Text>
        </View>

        <View style={styles.info}>
          <Text style={[styles.name, !command.enabled && styles.nameDisabled]}>
            {command.name}
          </Text>
          <Text style={styles.command}>{command.command}</Text>
          <View style={styles.delayInfo}>
            <View style={styles.delayBadge}>
              <Text style={styles.delayText}>
                {command.delayBase.toFixed(1)}s ± {command.delaySpread.toFixed(1)}s
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.sendButton}
          onPress={onSendCommand}
          activeOpacity={0.7}
        >
          <Text style={styles.sendButtonText}>📋</Text>
        </TouchableOpacity>
        
        <ToggleSwitch
          value={command.enabled}
          onValueChange={onToggle}
          size="small"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: Spacing.md,
    ...Shadows.sm,
  },
  containerEnabled: {
    borderColor: Colors.glassBorder,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  name: {
    color: Colors.text,
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.semibold,
  },
  nameDisabled: {
    color: Colors.textMuted,
  },
  command: {
    color: Colors.primary,
    fontSize: Typography.fontSizes.sm,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  delayInfo: {
    flexDirection: 'row',
    marginTop: Spacing.xs,
  },
  delayBadge: {
    backgroundColor: Colors.backgroundTertiary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  delayText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSizes.xs,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendButtonText: {
    fontSize: 18,
  },
});

export default CommandCard;
