import clsx from 'clsx';

type Transformers<T> = {
    [k in keyof T]: string extends T[k] ? (value: T[k]) => string : Record<T[k] & string, string>;
};

export function complexClassNames<T>(
    defaultValues: T,
    base: string,
    dictionaries: Transformers<T>,
    advance?: (props: T) => string
) {
    return (props: T = defaultValues) =>
        clsx(
            base,
            (Object.keys(props) as (keyof T)[]).map((k) => {
                const transformer = dictionaries[k];
                const value = props[k] ?? defaultValues[k];
                return typeof transformer === 'function'
                    ? transformer(value)
                    : (transformer as any)[value];
            }),
            advance?.(props)
        );
}
