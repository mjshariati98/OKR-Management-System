import { Global } from '@emotion/react';
import { createTheme, Slide, SlideProps, ThemeProvider } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import 'src/assets/font.css';
import { NoRowsOverlay } from 'src/components/NoRowsOverlay';
import App from 'src/pages/App';
import { GlobalStyles } from 'twin.macro';
import type {} from '@mui/x-data-grid/themeAugmentation';

const Index = () => (
    <BrowserRouter>
        <ThemeProvider
            theme={createTheme({
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
                    fontFamily: '"Shabnam FD", "Roboto", "Helvetica", "Arial", sans-serif',
                    h1: { fontSize: '36px', fontWeight: 'bold' },
                    h2: { fontSize: '30px', fontWeight: 'bold' },
                    h3: { fontSize: '24px', fontWeight: 'bold' },
                    h4: { fontSize: '20px', fontWeight: 'bold' },
                    h5: { fontSize: '18px', fontWeight: 'bold' },
                    h6: { fontSize: '16px', fontWeight: 'bold' },
                    subtitle1: { fontSize: '12px' },
                    subtitle2: { fontSize: '11px', fontWeight: 'bold' },
                    body1: { fontSize: '14px' },
                    body2: { fontSize: '12px' },
                    button: { fontSize: '14px' },
                    caption: { fontSize: '12px', fontWeight: 'lighter' },
                    overline: { fontSize: '13px', fontWeight: 'lighter' },
                },
            })}
        >
            <Global
                styles={{
                    body: {
                        fontFamily:
                            '"Shabnam FD", "Roboto", "Helvetica", "Arial", sans-serif !important',
                    },
                }}
            />
            <GlobalStyles />
            <Suspense fallback="loading ...">
                <App />
            </Suspense>
        </ThemeProvider>
    </BrowserRouter>
);

ReactDOM.createRoot(document.querySelector('#root')!).render(<Index />);
