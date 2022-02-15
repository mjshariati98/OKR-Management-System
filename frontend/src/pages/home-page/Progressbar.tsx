import { css } from '@emotion/css';
import { Box, LinearProgress } from '@mui/material';
import { common, grey } from '@mui/material/colors';
import React from 'react';

const progressbarRoot = css`
    height: 20px !important;
    background-color: ${common.white} !important;
    border: 2px solid ${grey[200]} !important;
    border-radius: 5px !important;
`;
type Props = {
    value: number;
};
export const Progressbar = (props: Props) => {
    return (
        <Box width="100%">
            <LinearProgress
                classes={{ root: progressbarRoot }}
                variant="determinate"
                value={props.value}
            />
        </Box>
    );
};
