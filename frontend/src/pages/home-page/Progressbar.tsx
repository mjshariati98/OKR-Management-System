import { css } from '@emotion/css';
import { Box, LinearProgress } from '@mui/material';
import { common, grey } from '@mui/material/colors';
import { SxProps } from '@mui/system';
import React from 'react';

const progressbarRoot = css`
    height: 10px !important;
    background-color: ${common.white} !important;
    border: 1px solid ${grey[200]} !important;
    border-radius: 5px !important;
`;
type Props = {
    value: number;
};
export const Progressbar = (props: Props) => {
    const { value } = props;
    const red = Math.floor((100-value) * 2.55);
    const green = Math.floor(value * 2.55);
    const progressbarBar = css`
        background-color: rgb(${red}, ${green}, 0) !important;
    `;

    return (
        <Box width="100%">
            <LinearProgress
                classes={{ root: progressbarRoot, bar: progressbarBar }}
                variant="determinate"
                value={props.value}
            />
        </Box>
    );
};
