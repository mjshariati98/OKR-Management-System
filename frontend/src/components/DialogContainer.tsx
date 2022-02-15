import { Dialog, DialogProps } from '@mui/material';
import { useEffect, useState } from 'react';
import { createEventListener } from 'src/utils/store';

type EventType = Partial<DialogProps>;

const eventListener = createEventListener<EventType>();

export function openDialog(options: EventType) {
    eventListener.changeValue(options);
    const ref = {
        close: () => {
            eventListener.changeValue({ open: false });
        },
    };
    return ref;
}

function DialogContainer(props: Props) {
    const [actionProps, setActionProps] = useState<EventType>();
    useEffect(() => {
        return eventListener.addListener(setActionProps);
    }, []);

    const allProps = { ...props, ...actionProps };

    const onClose: DialogProps['onClose'] = (...args) => {
        setActionProps({ open: false });
        allProps.onClose?.(...args);
    };

    return (
        <Dialog
            maxWidth="sm"
            open={!!actionProps}
            {...allProps}
            onClose={onClose}
            closeAfterTransition
        >
            {allProps.children}
        </Dialog>
    );
}

interface Props {}

export default DialogContainer;
