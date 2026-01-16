import { useCallback, useRef, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { DesignTokens } from '@/constants/design-tokens';
import { useTheme } from '@/contexts/theme-context';
import { useThemedTokens } from '@/hooks/use-themed-tokens';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface SearchBarProps extends Omit<TextInputProps, 'onChangeText'> {
  onSearch: (query: string) => void;
  debounceMs?: number;
}

export function SearchBar({
  onSearch,
  debounceMs = 300,
  placeholder = 'Search for Pokémon..',
  ...props
}: SearchBarProps) {
  const { isDark } = useTheme();
  const { colors, shadows } = useThemedTokens();
  const [value, setValue] = useState('');
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChangeText = useCallback(
    (text: string) => {
      setValue(text);

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        onSearch(text);
      }, debounceMs);
    },
    [debounceMs, onSearch]
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.cardBackground },
        shadows.card,
      ]}>
      <MaterialIcons
        name="search"
        size={DesignTokens.sizes.iconSize}
        color={colors.midnight}
      />
      <TextInput
        style={[styles.input, { color: colors.midnight }]}
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor={isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)'}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: DesignTokens.borderRadius.searchBar,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: DesignTokens.spacing.searchMargin,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Rubik_400Regular',
    padding: 0,
  },
});
