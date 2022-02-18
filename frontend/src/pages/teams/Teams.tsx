/** @jsxImportSource @emotion/react */
import { Button, Modal, Paper } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { TeamFull, UserFull } from 'src/api/entities';
import { deleteTeam, getTeams, getUsers } from 'src/api/tasks';
import 'twin.macro';
import TeamEdit from './TeamEdit';
import TeamView from './TeamView';

export default function Teams() {
    const [modalType, setModalType] = useState<'update' | 'add' | null>(null);
    const [editTeam, setEditTeam] = useState<TeamFull | null>(null);
    const [teams, setTeams] = useState<TeamFull[]>([]);
    const [users, setUsers] = useState<UserFull[]>([]);

    useEffect(() => {
        refetchUsers();
    }, []);

    const refetchUsers = async () => {
        setUsers(await getUsers());
    }

    useEffect(() => {
        refetch();
    }, []);

    const refetch = async () => {
        const result = await getTeams();
        setTeams(result);
        refetchUsers();
    };

    const onEditClick = (type: 'update' | 'add', team?: TeamFull) => {
        setModalType(type);
        team && setEditTeam(team);
    };

    const onDeleteClick = async (team: TeamFull) => {
        await deleteTeam(team);
        refetch();
    };

    const onCloseModal = () => {
        setModalType(null);
        setEditTeam(null);
        refetch();
    };

    return (
        <Box tw="mx-auto h-screen" sx={{ maxWidth: "70%" }}>
            <div tw="p-4 flex flex-col items-center h-screen w-full">
                <Button
                    variant="contained"
                    tw="normal-case mb-3 w-36 mr-auto ml-10"
                    onClick={() => onEditClick('add')}
                >
                    Add
                </Button>
                <div tw="flex flex-wrap justify-center px-4 overflow-y-auto w-full">
                    {teams.sort((a, b) => {
                        const aDate = new Date(a.createdAt!);
                        const bDate = new Date(b.createdAt!);
                        return aDate.getTime() - bDate.getTime();
                    }).map((t) => {
                        return (
                            <TeamView
                                members={t.members ?? []}
                                team={t}
                                users={users}
                                onChangeMembers={refetch}
                                onEdit={() => onEditClick('update', t)}
                                onDelete={() => onDeleteClick(t)}
                            />
                        );
                    })}
                </div>
            </div>
            <Modal
                tw="flex justify-center items-center"
                open={modalType !== null}
                onClose={onCloseModal}
            >
                <Paper tw="p-5">
                    <TeamEdit initTeam={editTeam ?? {}} type={modalType!} onClose={onCloseModal} />
                </Paper>
            </Modal>
        </Box>
    );
}
