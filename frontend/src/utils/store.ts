export function createEventListener<T>() {
    const listeners: ((value: T) => void)[] = [];
    function addListener(fn: (value: T) => void) {
        listeners.push(fn);
        return () => {
            listeners.splice(listeners.indexOf(fn));
        };
    }
    function changeValue(value: T) {
        listeners.forEach((l) => l(value));
    }

    return { addListener, changeValue };
}
