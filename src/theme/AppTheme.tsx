import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import { inputsCustomizations } from '../customizations/inputs';
import { dataDisplayCustomizations } from '../customizations/dataDisplay';
import { feedbackCustomizations } from '../customizations/feedback';
import { navigationCustomizations } from '../customizations/navigation';
import { surfacesCustomizations } from '../customizations/surfaces';
import { typography, shadows, shape } from './themePrimitives';

interface AppThemeProps {
  children: React.ReactNode;
  /**
   * This is for the docs site. You can ignore it or remove it.
   */
  disableCustomTheme?: boolean;
  themeComponents?: ThemeOptions['components'];
}

export default function AppTheme(props: AppThemeProps) {
  const { children, disableCustomTheme, themeComponents } = props;
  const brownCreamPalette = {
  light: {
    palette: {
      primary: { main: '#5a4030', contrastText: '#f5eee6' }, // dark brown button with cream text
      secondary: { main: '#f5eee6', contrastText: '#5a4030' }, // cream button with brown text
      background: { default: '#4d3214ff', paper: 'rgba(90,64,48,0.9)' }, // cream bg, semi-transparent brown card
      text: { primary: '#f5eee6', secondary: '#5a4030' }, // cream + brown text
    },
  },
  dark: {
    palette: {
      primary: { main: '#5a4030', contrastText: '#f5eee6' },
      secondary: { main: '#f5eee6', contrastText: '#5a4030' },
      background: { default: '#2d1e16', paper: 'rgba(45,30,22,0.9)' }, // darker brown bg
      text: { primary: '#f5eee6', secondary: '#d7c7b3' },
    },
  },
};
const sageCreamPalette = {
  light: {
    palette: {
      primary: { main: '#98a98e', contrastText: '#f8f8f4' }, // sage + cream
      secondary: { main: '#f5eee6', contrastText: '#374236' }, // cream with dark sage text
      background: { default: '#f5eee6', paper: 'rgba(152, 169, 142, 0.9)' },
      text: { primary: '#f8f8f4', secondary: '#374236' }, // light + muted dark
    },
  },
  dark: {
    palette: {
      primary: { main: '#7d8d72', contrastText: '#f8f8f4' }, // darker sage
      secondary: { main: '#f5eee6', contrastText: '#374236' },
      background: { default: '#2e3b2c', paper: 'rgba(125, 141, 114, 0.9)' },
      text: { primary: '#f8f8f4', secondary: '#d7dcd2' },
    },
  },
};

  const theme = React.useMemo(() => {
  return disableCustomTheme
    ? {}
    : createTheme({
        cssVariables: {
          colorSchemeSelector: 'data-mui-color-scheme',
          cssVarPrefix: 'template',
        },
        colorSchemes: {
          ...sageCreamPalette,
        },
        typography,
        shadows,
        shape,
        // Remove customizations for now so they don’t override
        components: {
          ...themeComponents,
        },
      });
}, [disableCustomTheme, themeComponents]);
  if (disableCustomTheme) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}