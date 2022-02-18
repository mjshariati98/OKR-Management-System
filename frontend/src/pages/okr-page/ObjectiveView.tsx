import { Delete, Edit } from '@mui/icons-material';
import { Card, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { ObjectiveFull } from 'src/api/entities';
import { Progressbar } from '../home-page/Progressbar';

interface Props {
    objective: ObjectiveFull;
    sumWeights: number;
    onEdit(): void;
    onDelete(): void;
}

export function ObjectiveView(props: Props) {
    const { objective } = props;
    const progress = Math.floor(objective.objectiveProgress ?? 0);
    return (
        <Card className="flex items-center w-full p-2 my-2 text-gray-500">
            <div className="w-40 text-lg font-semibold">{objective.title}</div>
            <div className="w-32">{`weight: ${Math.floor(
                (100 * objective.weight) / props.sumWeights
            )}%`}</div>
            <Box
                sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                className="grow"
            >
                {objective.description ?? ''}
            </Box>
            <div className="flex items-center w-40">
                <Progressbar value={progress} />
                <div className="text-gray-400 mx-2">{`${progress}%`}</div>
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
