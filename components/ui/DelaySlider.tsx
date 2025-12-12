import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    PanResponder,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../constants/theme';

interface DelaySliderProps {
  label: string;
  baseValue: number;
  spreadValue: number;
  onBaseValueChange: (value: number) => void;
  onSpreadValueChange: (value: number) => void;
  minBase?: number;
  maxBase?: number;
  minSpread?: number;
  maxSpread?: number;
  unit?: string;
}

export const DelaySlider: React.FC<DelaySliderProps> = ({
  label,
  baseValue,
  spreadValue,
  onBaseValueChange,
  onSpreadValueChange,
  minBase = 0.5,
  maxBase = 60,
  minSpread = 0,
  maxSpread = 30,
  unit = 's',
}) => {
  const [trackWidth, setTrackWidth] = useState(0);
  const basePosition = useRef(new Animated.Value(0)).current;
  const spreadPosition = useRef(new Animated.Value(0)).current;

  // Calculate positions from values
  useEffect(() => {
    if (trackWidth > 0) {
      const basePos = ((baseValue - minBase) / (maxBase - minBase)) * (trackWidth - 24);
      const spreadPos = ((spreadValue - minSpread) / (maxSpread - minSpread)) * (trackWidth - 24);
      basePosition.setValue(basePos);
      spreadPosition.setValue(spreadPos);
    }
  }, [trackWidth, baseValue, spreadValue, minBase, maxBase, minSpread, maxSpread, basePosition, spreadPosition]);

  const createPanResponder = (
    position: Animated.Value,
    setValue: (value: number) => void,
    min: number,
    max: number
  ) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        position.extractOffset();
      },
      onPanResponderMove: (_, gestureState) => {
        const newPos = Math.max(0, Math.min(trackWidth - 24, gestureState.dx + (position as any)._offset));
        position.setValue(newPos - (position as any)._offset);
      },
      onPanResponderRelease: (_, gestureState) => {
        position.flattenOffset();
        const currentPos = Math.max(0, Math.min(trackWidth - 24, (position as any)._value));
        const newValue = min + (currentPos / (trackWidth - 24)) * (max - min);
        setValue(Math.round(newValue * 10) / 10);
      },
    });
  };

  const basePanResponder = createPanResponder(basePosition, onBaseValueChange, minBase, maxBase);
  const spreadPanResponder = createPanResponder(spreadPosition, onSpreadValueChange, minSpread, maxSpread);

  const minDelay = Math.max(0, baseValue - spreadValue);
  const maxDelay = baseValue + spreadValue;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <View style={styles.valuesContainer}>
        <View style={styles.valueBox}>
          <Text style={styles.valueLabel}>Temel</Text>
          <Text style={styles.valueText}>{baseValue.toFixed(1)}{unit}</Text>
        </View>
        <View style={styles.valueBox}>
          <Text style={styles.valueLabel}>Yayılım</Text>
          <Text style={styles.valueText}>±{spreadValue.toFixed(1)}{unit}</Text>
        </View>
        <View style={[styles.valueBox, styles.rangeBox]}>
          <Text style={styles.valueLabel}>Aralık</Text>
          <Text style={styles.rangeText}>
            {minDelay.toFixed(1)} - {maxDelay.toFixed(1)}{unit}
          </Text>
        </View>
      </View>

      <View style={styles.sliderSection}>
        <Text style={styles.sliderLabel}>Temel Gecikme</Text>
        <View
          style={styles.trackContainer}
          onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
        >
          <View style={styles.track}>
            <Animated.View
              style={[
                styles.trackFill,
                {
                  width: basePosition.interpolate({
                    inputRange: [0, Math.max(1, trackWidth - 24)],
                    outputRange: [0, Math.max(1, trackWidth - 24)],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            />
          </View>
          <Animated.View
            style={[
              styles.thumb,
              {
                transform: [{ translateX: basePosition }],
              },
            ]}
            {...basePanResponder.panHandlers}
          >
            <View style={styles.thumbInner} />
          </Animated.View>
        </View>
      </View>

      <View style={styles.sliderSection}>
        <Text style={styles.sliderLabel}>Yayılım</Text>
        <View style={styles.trackContainer}>
          <View style={styles.track}>
            <Animated.View
              style={[
                styles.trackFillSecondary,
                {
                  width: spreadPosition.interpolate({
                    inputRange: [0, Math.max(1, trackWidth - 24)],
                    outputRange: [0, Math.max(1, trackWidth - 24)],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            />
          </View>
          <Animated.View
            style={[
              styles.thumbSecondary,
              {
                transform: [{ translateX: spreadPosition }],
              },
            ]}
            {...spreadPanResponder.panHandlers}
          >
            <View style={styles.thumbInnerSecondary} />
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
  },
  label: {
    color: Colors.text,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.semibold,
    marginBottom: Spacing.md,
  },
  valuesContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  valueBox: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rangeBox: {
    flex: 1.5,
    borderColor: Colors.primaryDark,
  },
  valueLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSizes.xs,
    marginBottom: 2,
  },
  valueText: {
    color: Colors.primary,
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
  },
  rangeText: {
    color: Colors.secondary,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.semibold,
  },
  sliderSection: {
    marginBottom: Spacing.md,
  },
  sliderLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSizes.sm,
    marginBottom: Spacing.sm,
  },
  trackContainer: {
    height: 24,
    justifyContent: 'center',
  },
  track: {
    height: 6,
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  trackFillSecondary: {
    height: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.full,
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  thumbSecondary: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  thumbInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.text,
  },
  thumbInnerSecondary: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.text,
  },
});

export default DelaySlider;
