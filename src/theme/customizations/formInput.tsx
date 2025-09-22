import { alpha, Theme, Components } from '@mui/material/styles';
import { inputBaseClasses } from '@mui/material/InputBase';
import { inputLabelClasses } from '@mui/material/InputLabel';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { formHelperTextClasses } from '@mui/material/FormHelperText';
import { iconButtonClasses } from '@mui/material/IconButton';
import { brand } from '../themePrimitives';

export const formInputCustomizations: Components<Theme> = {
  MuiFormControl: {
    styleOverrides: {
      root: ({ theme }) => ({
        [`& .${inputBaseClasses.root}`]: {
          marginTop: 6,
          color: '#5a4030', // dark brown text
          backgroundColor: '#f5eee6', // cream background
        },
        [`& .${inputLabelClasses.root}`]: {
          transform: 'translate(4px, -11px) scale(0.75)',
          color: '#f5eee6', // cream label
          [`&.${outlinedInputClasses.focused}`]: {
            transform: 'translate(4px, -12px) scale(0.75)',
            color: '#f5eee6', // keep label cream on focus
          },
        },
        [`& .${formHelperTextClasses.root}`]: {
          marginLeft: 2,
          color: '#f5eee6', // helper/error text
        },
        [`& .${outlinedInputClasses.notchedOutline}`]: {
          borderColor: '#5a4030', // dark brown border
        },
        [`& .${outlinedInputClasses.root}:hover .${outlinedInputClasses.notchedOutline}`]: {
          borderColor: '#8b5e3c', // slightly lighter brown on hover
        },
        [`& .${outlinedInputClasses.root}.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
          borderColor: '#5a4030', // dark brown on focus
        },
      }),
    },
  },
};
