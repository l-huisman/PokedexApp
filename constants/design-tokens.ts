import { Platform } from 'react-native';

const lightColors = {
  background: '#EDF6FF',
  primary: '#5631E8',
  midnight: '#0E0940',
  cardBackground: '#FFFFFF',
  imageBackground: '#F6F6FF',
  shadowColor: '#303773',
  textSecondary: '#6B6B6B',
  barBackground: '#DBDAE6',
};

const darkColors = {
  background: '#121212',
  primary: '#7B5EF0',
  midnight: '#E0E0E0',
  cardBackground: '#1E1E1E',
  imageBackground: '#2A2A2A',
  shadowColor: '#000000',
  textSecondary: '#A0A0A0',
  barBackground: '#3A3A3A',
};

export const ThemeColors = {
  light: lightColors,
  dark: darkColors,
} as const;

export const DesignTokens = {
  colors: lightColors,
  shadows: {
    card: Platform.select({
      ios: {
        shadowColor: '#303773',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
      },
      android: {
        elevation: 4,
      },
      default: {
        shadowColor: '#303773',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
      },
    }),
  },
  spacing: {
    screenPadding: 24,
    searchMargin: 16,
    cardGap: 16,
    cardPadding: 12,
  },
  borderRadius: {
    card: 8,
    badge: 4,
    searchBar: 8,
  },
  sizes: {
    cardImageHeight: 163,
    searchBarHeight: 48,
    iconSize: 24,
    badgeFontSize: 10,
    nameFontSize: 16,
    headerFontSize: 24,
    detailImageSize: 200,
    detailNameFontSize: 32,
    detailIdFontSize: 24,
  },
  detail: {
    headerHeight: 372,
    tabBarHeight: 32,
    tabUnderlineActive: '#5631E8',
    tabUnderlineInactive: '#DBDAE6',
    favoriteActive: '#FF6B6B',
  },
} as const;

export type ThemeColorKey = keyof typeof lightColors;
