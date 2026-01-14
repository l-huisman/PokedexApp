/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ThemeMode = 'light' | 'dark';

function getThemeMode(colorScheme: ReturnType<typeof useColorScheme>): ThemeMode {
  if (colorScheme === 'dark') {
    return 'dark';
  }
  return 'light';
}

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const colorScheme = useColorScheme();
  const theme = getThemeMode(colorScheme);
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
