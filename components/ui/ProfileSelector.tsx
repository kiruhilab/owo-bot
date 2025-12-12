import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/theme';
import { Profile } from '../../types/bot';

interface ProfileSelectorProps {
  profiles: Profile[];
  activeProfileId: string;
  onSelectProfile: (profileId: string) => void;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  profiles,
  activeProfileId,
  onSelectProfile,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil Seç</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {profiles.map((profile) => {
          const isActive = profile.id === activeProfileId;
          return (
            <TouchableOpacity
              key={profile.id}
              style={[styles.profileCard, isActive && styles.profileCardActive]}
              onPress={() => onSelectProfile(profile.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
                <Text style={styles.icon}>{profile.icon}</Text>
              </View>
              <Text style={[styles.name, isActive && styles.nameActive]}>
                {profile.name}
              </Text>
              <Text style={styles.description} numberOfLines={2}>
                {profile.description}
              </Text>
              <View style={styles.delayBadge}>
                <Text style={styles.delayText}>
                  ~{profile.loopDelay}s
                </Text>
              </View>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  title: {
    color: Colors.text,
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.semibold,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  profileCard: {
    width: 140,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  profileCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.glass,
    ...Shadows.glow,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconContainerActive: {
    backgroundColor: Colors.primaryDark,
  },
  icon: {
    fontSize: 24,
  },
  name: {
    color: Colors.text,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.semibold,
    marginBottom: 4,
  },
  nameActive: {
    color: Colors.primaryLight,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSizes.xs,
    lineHeight: 16,
    marginBottom: Spacing.sm,
  },
  delayBadge: {
    backgroundColor: Colors.backgroundTertiary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  delayText: {
    color: Colors.secondary,
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.medium,
  },
  activeIndicator: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.secondary,
  },
});

export default ProfileSelector;
