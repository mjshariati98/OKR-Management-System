import { Delete, Edit, ExpandMore } from '@mui/icons-material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Card,
    IconButton,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { KRFull, ObjectiveFull } from 'src/api/entities';
import { createOrUpdateKR, deleteKR, deleteObjective, getKRs } from 'src/api/tasks';
import { Progressbar } from '../home-page/Progressbar';
import { KREdit } from './KREdit';
import { KRView } from './KRView';

interface Props {
    objective: ObjectiveFull;
    sumWeights: number;
    onEdit(): void;
    onDelete(): void;
    onProgressChange(): void;
}

export function ObjectiveView(props: Props) {
    const { objective } = props;
    const progress = Math.floor(objective.objectiveProgress ?? 0);

    const [addingKR, setAddingKR] = useState(false);
    const [krs, setKRs] = useState<KRFull[]>([]);
    const [krModes, setKRModes] = useState<{ [o: string]: boolean }>({});

    useEffect(() => {
        const modes: { [o: string]: boolean } = {};
        krs.forEach((o) => (modes[o.id] = false));
        setKRModes(modes);
    }, []);

    useEffect(() => {
        refetch();
    }, []);

    const refetch = async () => {
        const result = await getKRs(objective.id, objective.okrId);
        setKRs(result);
    };

    const krSumWeights = krs.reduce((acc, curr) => acc + curr.weight, 0);

    const onClose = () => {
        setAddingKR(false);
        props.onProgressChange();
        refetch();
    };

    const onKRModeChange = (kr: KRFull, mode: boolean) => {
        krModes[kr.title] = mode;
        setKRModes(krModes);
        refetch();
    };

    const onDeleteClick = async (kr: KRFull) => {
        await deleteKR(kr, objective.id, objective.okrId);
        refetch();
    };

    const onChangeProgress = async (newDone: number, kr: KRFull) => {
        kr.done = newDone;
        await createOrUpdateKR(kr, objective.id, objective.okrId, "update");
        props.onProgressChange();
        refetch();
    }

    return (
        <Card className="flex my-4 w-full text-gray-500">
            <Accordion className="w-full">
                <AccordionSummary
                    className="shadow-md w-full flex items-center"
                    sx={{bgcolor: "#ededed"}}
                    expandIcon={<ExpandMore />}
                >
                    <div className="flex items-center w-40 text-lg font-semibold">
                        {objective.title}
                    </div>
                    <div className="flex items-center w-32">{`weight: ${Math.floor(
                        (100 * objective.weight) / props.sumWeights
                    )}%`}</div>
                    <Box
                        sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                        className="flex items-center grow"
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
                </AccordionSummary>
                <AccordionDetails className="p-6">
                    <Button
                        className="h-8 ml-auto normal-case"
                        variant="contained"
                        onClick={() => setAddingKR(true)}
                    >
                        Add KR
                    </Button>
                    {addingKR && (
                        <KREdit
                            initKR={{}}
                            type="add"
                            objectiveId={objective.id}
                            okrId={objective.okrId}
                            onClose={onClose}
                        />
                    )}
                    {krs
                        .sort((a, b) => {
                            const aDate = new Date(a.createdAt!);
                            const bDate = new Date(b.createdAt!);
                            return aDate.getTime() - bDate.getTime();
                        })
                        .map((k) =>
                            krModes[k.title] ? (
                                <KREdit
                                    initKR={k}
                                    type="update"
                                    onClose={() => onKRModeChange(k, false)}
                                    okrId={objective.okrId}
                                    objectiveId={objective.id}
                                />
                            ) : (
                                <KRView
                                    kr={k}
                                    sumWeights={krSumWeights}
                                    onDelete={() => onDeleteClick(k)}
                                    onEdit={() => onKRModeChange(k, true)}
                                    onChangeProgress={(d) => onChangeProgress(d, k)}
                                />
                            )
                        )}
                </AccordionDetails>
            </Accordion>
        </Card>
    );
}
