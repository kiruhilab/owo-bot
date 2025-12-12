import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/theme';

interface KeyboardButtonProps {
  command: string;
  label: string;
  icon: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'accent';
}

export const KeyboardButton: React.FC<KeyboardButtonProps> = ({
  command,
  label,
  icon,
  onPress,
  disabled = false,
  variant = 'primary',
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const getGradientColors = (): readonly [string, string] => {
    switch (variant) {
      case 'secondary':
        return [Colors.secondary, Colors.secondaryDark] as const;
      case 'accent':
        return [Colors.accent, Colors.accentDark] as const;
      default:
        return [Colors.primary, Colors.primaryDark] as const;
    }
  };

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
        friction: 8,
        tension: 100,
      }),
      Animated.timing(opacity, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 100,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale }],
          opacity: disabled ? 0.5 : opacity,
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
        style={styles.touchable}
      >
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.icon}>{icon}</Text>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.command}>{command}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Shadows.lg,
  },
  touchable: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  icon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  label: {
    color: Colors.text,
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    marginBottom: 4,
  },
  command: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: Typography.fontSizes.xs,
    fontFamily: 'monospace',
  },
});

export default KeyboardButton;
