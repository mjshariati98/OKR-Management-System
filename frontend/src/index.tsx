import { Global } from '@emotion/react';
import { ThemeProvider } from '@mui/material';
import { ElementType, ReactElement, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import 'src/assets/input.css';
import { GlobalStyles } from 'twin.macro';
import App from './App';
import ToastContainer from './components/ToastContainer';
import { queryClient } from './global/query-client';
import { theme } from './global/theme';
import axios from 'axios';

axios.defaults.baseURL = '/api';

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
                            '"Roboto", "Helvetica", "Arial", sans-serif !important',
                    },
                }}
            />
            <GlobalStyles />
            <Suspense fallback="loading ...">
                <App />
            </Suspense>
            <ToastContainer/>
        </>
    );

ReactDOM.createRoot(document.querySelector('#root')!).render(<Index />);
