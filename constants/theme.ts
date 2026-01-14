/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#5631E8';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#0E0940',
    background: '#EDF6FF',
    tint: tintColorLight,
    icon: '#0E0940',
    tabIconDefault: '#0E0940',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
    rubik: 'Rubik_500Medium',
    rubikBold: 'Rubik_700Bold',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
    rubik: 'Rubik_500Medium',
    rubikBold: 'Rubik_700Bold',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    rubik: "'Rubik', sans-serif",
    rubikBold: "'Rubik', sans-serif",
  },
});
