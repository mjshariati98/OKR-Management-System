import { Add, AddCircle, Delete, Edit, Remove, RemoveCircle } from '@mui/icons-material';
import { Box, Card, IconButton } from '@mui/material';
import React from 'react';
import { KRFull } from 'src/api/entities';
import { createOrUpdateKR } from 'src/api/tasks';
import { Progressbar } from '../home-page/Progressbar';

interface Props {
    kr: KRFull;
    sumWeights: number;
    onEdit(): void;
    onDelete(): void;
    onChangeProgress(newDone: number): void;
}

export function KRView(props: Props) {
    const { kr } = props;
    const progress = Math.floor(kr.done ?? 0);

    const progressChange = async (value: number) => {
        let newDone = kr.done += value;
        newDone = Math.min(100, newDone);
        newDone = Math.max(newDone, 0);
        props.onChangeProgress(newDone);
    }

    return (
        <Card className="flex p-1 pl-3 my-4 w-full text-gray-500">
            <div className="flex items-center w-40 text-lg font-semibold">{kr.title}</div>
            <div className="flex items-center w-32">{`weight: ${Math.floor(
                (100 * kr.weight) / props.sumWeights
            )}%`}</div>
            <Box
                sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                className="flex items-center grow"
            >
                {kr.description ?? ''}
            </Box>
            <div className="flex items-center w-56">
                <IconButton disabled={kr.done === 0} className="p-2" onClick={() => progressChange(-10)}>
                    <RemoveCircle color="error" />
                </IconButton>
                <Progressbar value={progress} />
                <div className="text-gray-400 ml-2">{`${progress}%`}</div>
                <IconButton disabled={kr.done === 100} className="p-2" onClick={() => progressChange(10)}>
                    <AddCircle color="success" />
                </IconButton>
            </div>
            <div className="ml-5">
                <IconButton color="success" onClick={props.onEdit}>
                    <Edit color="primary" />
                </IconButton>
                <IconButton onClick={props.onDelete}>
                    <Delete color="error" />
                </IconButton>
            </div>
        </Card>
    );
}
