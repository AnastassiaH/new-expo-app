import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';

export type AppTheme = MD3Theme & {
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
    surface: string;
    secondary: string;
    error: string;
    [key: string]: string | object;
  };
  dark: boolean;
  mode?: 'adaptive' | 'exact';
};

const CombinedDefaultTheme: AppTheme = {
  ...MD3LightTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...NavigationDefaultTheme.colors,
    primary: '#123458',
    onPrimary: '#FFFFFF',
    primaryContainer: '#D1E4FF',
    onPrimaryContainer: '#001A3F',
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#000000',
    border: '#E5E5EA',
    notification: '#FF3B30',
    surface: '#FFFFFF',
    secondary: '#8E8E93',
    error: '#FF3B30',
  },
  dark: false,
  mode: 'adaptive',
  fonts: MD3LightTheme.fonts
};

const CombinedDarkTheme: AppTheme = {
  ...MD3DarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...NavigationDarkTheme.colors,
    primary: '#E8E8E8',
    onPrimary: '#000000',
    background: '#000000',
    card: '#1C1C1E',
    text: '#FFFFFF',
    border: '#38383A',
    notification: '#FF453A',
    surface: '#1C1C1E',
    secondary: '#8E8E93',
    error: '#FF453A',
  },
  dark: true,
  mode: 'adaptive',
  fonts: MD3DarkTheme.fonts
};

export const lightTheme = CombinedDefaultTheme;
export const darkTheme = CombinedDarkTheme; 