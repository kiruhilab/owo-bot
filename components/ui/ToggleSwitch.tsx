import React, { useEffect, useRef } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors, Spacing, Typography } from '../../constants/theme';

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  value,
  onValueChange,
  label,
  description,
  disabled = false,
  size = 'medium',
}) => {
  const translateX = useRef(new Animated.Value(value ? 1 : 0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const sizes = {
    small: { width: 40, height: 22, circle: 18 },
    medium: { width: 52, height: 28, circle: 24 },
    large: { width: 64, height: 34, circle: 30 },
  };

  const currentSize = sizes[size];
  const translateDistance = currentSize.width - currentSize.circle - 4;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 60,
    }).start();
  }, [value, translateX]);

  const handlePress = () => {
    if (disabled) return;

    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();

    onValueChange(!value);
  };

  const animatedTranslate = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [2, translateDistance],
  });

  const animatedBackgroundColor = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.backgroundTertiary, Colors.primary],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={disabled}
      style={[styles.container, disabled && styles.containerDisabled]}
    >
      {(label || description) && (
        <View style={styles.labelContainer}>
          {label && (
            <Text style={[styles.label, disabled && styles.labelDisabled]}>
              {label}
            </Text>
          )}
          {description && (
            <Text style={[styles.description, disabled && styles.descriptionDisabled]}>
              {description}
            </Text>
          )}
        </View>
      )}
      <Animated.View
        style={[
          styles.track,
          {
            width: currentSize.width,
            height: currentSize.height,
            borderRadius: currentSize.height / 2,
            backgroundColor: animatedBackgroundColor,
          },
          value && styles.trackActive,
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: currentSize.circle,
              height: currentSize.circle,
              borderRadius: currentSize.circle / 2,
              transform: [{ translateX: animatedTranslate }, { scale }],
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  containerDisabled: {
    opacity: 0.5,
  },
  labelContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  label: {
    color: Colors.text,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium,
  },
  labelDisabled: {
    color: Colors.textDisabled,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSizes.sm,
    marginTop: 2,
  },
  descriptionDisabled: {
    color: Colors.textDisabled,
  },
  track: {
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  trackActive: {
    borderColor: Colors.primaryDark,
  },
  thumb: {
    backgroundColor: Colors.text,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default ToggleSwitch;
