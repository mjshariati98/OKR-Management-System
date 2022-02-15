/// <reference types="react-scripts" />
/// <reference types="react/next" />
/// <reference types="react-dom/next" />
/// <reference types="twin.macro" />
/// <reference types="@emotion/react/types/css-prop" />

import { AriaAttributes, DOMAttributes } from 'react';

declare module 'react' {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        xmlns?: string;
    }
}
