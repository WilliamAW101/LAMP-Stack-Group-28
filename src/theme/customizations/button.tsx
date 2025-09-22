import { Theme, Components } from '@mui/material/styles';

export const buttonsCustomizations: Components = {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 'bold',
          textTransform: 'none',
        },
        containedPrimary: {
          backgroundColor: '#f5eee6', // cream
          color: '#5a4030', // dark brown text
          '&:hover': {
            backgroundColor: '#5a4030', // dark brown
            color: '#f5eee6', // cream text on hover
          },
        },
        outlinedPrimary: {
          borderColor: '#5a4030',
          color: '#5a4030',
          '&:hover': {
            backgroundColor: '#f5eee6',
            color: '#5a4030',
          },
        },
      },
    },
  };