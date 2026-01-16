import { useCallback, useRef, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { DesignTokens } from '@/constants/design-tokens';
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
    <View style={styles.container}>
      <MaterialIcons
        name="search"
        size={DesignTokens.sizes.iconSize}
        color={DesignTokens.colors.midnight}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(0, 0, 0, 0.3)"
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
    backgroundColor: DesignTokens.colors.cardBackground,
    borderRadius: DesignTokens.borderRadius.searchBar,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: DesignTokens.spacing.searchMargin,
    gap: 12,
    ...DesignTokens.shadows.card,
  },
  icon: {},
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Rubik_400Regular',
    color: DesignTokens.colors.midnight,
    padding: 0,
  },
});
