import { Typography } from '@mui/material';
import { GridOverlay } from '@mui/x-data-grid';

export const NoRowsOverlay = () => {
    return (
        <GridOverlay>
            <Typography>داده ای یافت نشد</Typography>
        </GridOverlay>
    );
};
