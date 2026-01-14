import { Platform } from 'react-native';

export const DesignTokens = {
  colors: {
    background: '#EDF6FF',
    primary: '#5631E8',
    midnight: '#0E0940',
    cardBackground: '#FFFFFF',
    imageBackground: '#F6F6FF',
    shadowColor: '#303773',
  },
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
  },
} as const;
