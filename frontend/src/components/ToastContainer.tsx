import { Alert, AlertProps, Snackbar, SnackbarProps } from '@mui/material';
import { useEffect, useState } from 'react';
import { createEventListener } from 'src/utils/store';

type EventType = Partial<SnackbarProps> & Props;

const eventListener = createEventListener<EventType>();

export function toast(options: EventType) {
    eventListener.changeValue(options);
    const ref = {
        close: () => {
            eventListener.changeValue({ open: false });
        },
    };
    return ref;
}

function ToastContainer(props: Props) {
    const [actionProps, setActionProps] = useState<EventType>();
    useEffect(() => {
        return eventListener.addListener(setActionProps);
    }, []);

    const allProps = { ...props, ...actionProps };

    const onClose: SnackbarProps['onClose'] = (...args) => {
        setActionProps({ open: false });
        allProps.onClose?.(...args);
    };

    return (
        <Snackbar open={!!actionProps} autoHideDuration={6000} onClose={onClose} {...allProps}>
            <Alert
                onClose={() => setActionProps({ open: false })}
                severity={allProps.severity}
                sx={{ width: '100%' }}
            >
                {allProps.message}
            </Alert>
        </Snackbar>
    );
}

interface Props {
    severity?: AlertProps['severity'];
}

export default ToastContainer;
