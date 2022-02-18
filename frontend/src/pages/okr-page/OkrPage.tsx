/** @jsxImportSource @emotion/react */
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { ObjectiveFull, OkrFull } from 'src/api/entities';
import { deleteObjective, getObjectives } from 'src/api/tasks';
import 'twin.macro';
import { ObjectiveEdit } from './ObjectiveEdit';
import { ObjectiveView } from './ObjectiveView';

interface Props {
    okr: OKR;
}

const okr: OkrFull = {
    id: '1',
    description: 'null',
    createdAt: '2022-02-18T15:06:05.156Z',
    team: 'AsqarDooni',
    roundId: '2',
    objectives: [],
};

export default function OkrPage(props: Props) {
    // const { okr } = props;
    const [addingObjective, setAddingObjective] = useState(false);
    const [objectives, setObjectives] = useState<ObjectiveFull[]>([]);
    const [objectiveModes, setObjectiveModes] = useState<{ [o: string]: boolean }>({});

    useEffect(() => {
        const modes: { [o: string]: boolean } = {};
        objectives.forEach((o) => (modes[o.id] = false));
        setObjectiveModes(modes);
    }, []);

    useEffect(() => {
        refetch();
    }, []);

    const refetch = async () => {
        const result = await getObjectives(okr.id);
        setObjectives(result);
    };

    const sumWeights = objectives.reduce((acc, curr) => acc + curr.weight, 0);

    const onClose = () => {
        setAddingObjective(false);
        refetch();
    };

    const onObjectiveModeChange = (objective: ObjectiveFull, mode: boolean) => {
        objectiveModes[objective.title] = mode;
        setObjectiveModes(objectiveModes);
        refetch();
    };

    const onDeleteClick = async (objective: ObjectiveFull) => {
        await deleteObjective(objective, okr.id);
        refetch();
    }

    if (!okr) return null;

    return (
        <div tw="h-screen w-full flex justify-center items-center">
            <Box tw="flex" sx={{ height: '80%', width: '80%' }}>
                <Box tw="shadow-xl w-96"></Box>
                <div className="px-5 w-full">
                    <div className="flex w-full">
                        <h1 className="font-bold text-sky-600 text-3xl">Objectives</h1>
                        <Button
                            className="ml-auto normal-case"
                            variant="contained"
                            onClick={() => setAddingObjective(true)}
                        >
                            Add Objective
                        </Button>
                    </div>
                    {addingObjective && (
                        <ObjectiveEdit
                            initObjective={{}}
                            okrId={okr.id}
                            type="add"
                            onClose={onClose}
                        />
                    )}
                    {objectives
                        .sort((a, b) => {
                            const aDate = new Date(a.createdAt!);
                            const bDate = new Date(b.createdAt!);
                            return aDate.getTime() - bDate.getTime();
                        })
                        .map((o) =>
                            objectiveModes[o.title] ? (
                                <ObjectiveEdit
                                    initObjective={o}
                                    type="update"
                                    onClose={() => onObjectiveModeChange(o, false)}
                                    okrId={okr.id}
                                />
                            ) : (
                                <ObjectiveView
                                    onDelete={() => onDeleteClick(o)}
                                    onEdit={() => onObjectiveModeChange(o, true)}
                                    sumWeights={sumWeights}
                                    objective={o}
                                />
                            )
                        )}
                </div>
            </Box>
        </div>
    );
}
