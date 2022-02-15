import { createTheme, Slide, SlideProps } from '@mui/material';
import { grey } from '@mui/material/colors';
import type {} from '@mui/x-data-grid/themeAugmentation';
import { NoRowsOverlay } from 'src/components';

export const theme = createTheme({
    components: {
        MuiDataGrid: {
            defaultProps: {
                hideFooter: true,
                disableColumnMenu: true,
                components: {
                    NoRowsOverlay,
                },
            },
            styleOverrides: {
                columnHeaders: {
                    background: grey[100],
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                fullWidth: true,
                margin: 'normal',
            },
        },
        MuiDialog: {
            defaultProps: {
                fullWidth: true,
                TransitionComponent: Slide,
                TransitionProps: { timeout: 500, direction: 'up' } as SlideProps,
            },
        },
        MuiFormHelperText: {
            defaultProps: { variant: 'filled' },
        },
    },
    typography: {
        fontFamily: 'inherit',
    },
});
