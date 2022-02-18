import { Global } from '@emotion/react';
import { ThemeProvider } from '@mui/material';
import { ElementType, ReactElement, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import 'src/assets/font.css';
import 'src/assets/output.css';
import { GlobalStyles } from 'twin.macro';
import App from './App';
import { queryClient } from './global/query-client';
import { theme } from './global/theme';

interface WrapperComponent {
    component: ElementType;
    props?: any;
}

const wrappers = [
    { component: BrowserRouter, props: {} },
    { component: ThemeProvider, props: { theme } },
    { component: QueryClientProvider, props: { client: queryClient } },
];

const wrapperComponentsReducer = (elem: ReactElement, wrapper: WrapperComponent) => (
    <wrapper.component {...wrapper.props}>{elem}</wrapper.component>
);

const Index = () =>
    wrappers.reduceRight(
        wrapperComponentsReducer,
        <>
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
        </>
    );

ReactDOM.createRoot(document.querySelector('#root')!).render(<Index />);
