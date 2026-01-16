import { useMemo } from 'react';
import { Platform } from 'react-native';
import { useTheme } from '@/contexts/theme-context';
import { ThemeColors } from '@/constants/design-tokens';

export function useThemedTokens() {
  const { theme, isDark } = useTheme();

  return useMemo(() => {
    const colors = ThemeColors[theme];

    return {
      colors,
      shadows: {
        card: Platform.select({
          ios: {
            shadowColor: colors.shadowColor,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.3 : 0.15,
            shadowRadius: 15,
          },
          android: {
            elevation: isDark ? 8 : 4,
          },
          default: {
            shadowColor: colors.shadowColor,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.3 : 0.15,
            shadowRadius: 15,
          },
        }),
      },
      detail: {
        headerHeight: 372,
        tabBarHeight: 32,
        tabUnderlineActive: colors.primary,
        tabUnderlineInactive: colors.barBackground,
        favoriteActive: '#FF6B6B',
      },
    };
  }, [theme, isDark]);
}

export function useThemedColors() {
  const { theme } = useTheme();
  return useMemo(() => ThemeColors[theme], [theme]);
}
