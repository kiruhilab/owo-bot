import React from 'react';
import {
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  title?: string;
  subtitle?: string;
  icon?: string;
  glowColor?: string;
  isActive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  onPress,
  title,
  subtitle,
  icon,
  glowColor,
  isActive = false,
}) => {
  const Container = onPress ? TouchableOpacity : View;
  const activeGlow = isActive && glowColor ? { shadowColor: glowColor } : {};

  return (
    <Container
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.card,
        isActive && styles.cardActive,
        activeGlow,
        style,
      ]}
    >
      {(title || icon) && (
        <View style={styles.header}>
          {icon && <Text style={styles.icon}>{icon}</Text>}
          <View style={styles.headerText}>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
      )}
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.glass,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  cardActive: {
    borderColor: Colors.primary,
    ...Shadows.glow,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  icon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: Colors.text,
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.semibold,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSizes.sm,
    marginTop: 2,
  },
});

export default GlassCard;
