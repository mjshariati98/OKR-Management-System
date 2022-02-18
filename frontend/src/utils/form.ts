export function formRegisterTransform(props: any) {
    const { ref, ...rest } = props;
    return { ...rest, inputRef: ref };
}
