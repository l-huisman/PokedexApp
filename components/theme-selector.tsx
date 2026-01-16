import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/contexts/theme-context';
import { useThemedColors } from '@/hooks/use-themed-tokens';

interface ThemeButtonProps {
  label: string;
  icon: 'light-mode' | 'dark-mode' | 'settings-brightness';
  isSelected: boolean;
  onPress: () => void;
  colors: ReturnType<typeof useThemedColors>;
}

function ThemeButton({ label, icon, isSelected, onPress, colors }: ThemeButtonProps) {
  return (
    <Pressable
      style={[
        styles.option,
        { borderColor: isSelected ? colors.primary : colors.barBackground },
      ]}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${label} theme`}
    >
      <MaterialIcons
        name={icon}
        size={24}
        color={isSelected ? colors.primary : colors.midnight}
      />
      <Text style={[styles.optionLabel, { color: colors.midnight }]}>{label}</Text>
    </Pressable>
  );
}

export function ThemeSelector() {
  const { preference, setPreference } = useTheme();
  const colors = useThemedColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
      <Text style={[styles.title, { color: colors.midnight }]}>Appearance</Text>
      <View style={styles.options}>
        <ThemeButton
          label="Light"
          icon="light-mode"
          isSelected={preference === 'light'}
          onPress={() => setPreference('light')}
          colors={colors}
        />
        <ThemeButton
          label="Dark"
          icon="dark-mode"
          isSelected={preference === 'dark'}
          onPress={() => setPreference('dark')}
          colors={colors}
        />
        <ThemeButton
          label="System"
          icon="settings-brightness"
          isSelected={preference === 'system'}
          onPress={() => setPreference('system')}
          colors={colors}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  title: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 18,
    textAlign: 'center',
  },
  options: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  optionLabel: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 14,
  },
});
