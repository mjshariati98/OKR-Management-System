/** @jsxImportSource @emotion/react */
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import { ObjectiveFull, OkrFull, TeamFull } from 'src/api/entities';
import { deleteObjective, getObjectives, getTeams } from 'src/api/tasks';
import 'twin.macro';
import { Progressbar } from '../home-page/Progressbar';
import TeamView from '../teams/TeamView';
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
    okrProgress: 20,
    roundId: '2',
    objectives: [],
};

export default function OkrPage(props: Props) {
    const [team, setTeam] = useState<TeamFull | null>(null);
    const { okrId } = useParams<{ okrId: ID }>();
    const { data: okr, refetch: refetchOkr } = useQuery<OKR>('/okrs/' + okrId);

    useEffect(() => {
        (async() => {
            if (!okr) {
                return;
            }
            const res = await getTeams();
            setTeam(res.find((t) => t.name === okr.team) ?? null);
        })()
    }, [okr])

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
        const result = await getObjectives(okrId);
        setObjectives(result);
        refetchOkr();
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
        await deleteObjective(objective, okrId);
        refetch();
    }

    if (!okr) return null;

    const progress = Math.floor(okr.okrProgress ?? 0);

    return (
        <div tw="h-[90vh] w-full flex justify-center items-center">
            <Box tw="flex" sx={{ height: '80%', width: '80%' }}>
                <div>
                    {team && (
                        <TeamView team={team} members={team.members ?? []} noEditable />
                    )}
                </div>
                <div className="px-5 w-full">
                    <div className="flex w-full">
                        <h1 className="font-bold text-sky-600 text-3xl">{`${okr.description} Objectives`}</h1>
                        <div className="flex items-center text-gray-400 ml-10 w-64">
                            <div className="mr-2">progress:</div>
                            <Progressbar value={okr.okrProgress}/>
                            <div className="ml-2 w-16">{`${progress}%`}</div>
                        </div>
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
                            okrId={okrId}
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
                                    okrId={okrId}
                                />
                            ) : (
                                <ObjectiveView
                                    onDelete={() => onDeleteClick(o)}
                                    onEdit={() => onObjectiveModeChange(o, true)}
                                    sumWeights={sumWeights}
                                    objective={o}
                                    onProgressChange={refetch}
                                />
                            )
                        )}
                </div>
            </Box>
        </div>
    );
}
