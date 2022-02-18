/** @jsxImportSource @emotion/react */
import { Button, Modal, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { BaseUser, UserFull } from 'src/api/entities';
import { Role } from 'src/api/enums';
import { deleteUser, getUsers } from 'src/api/tasks';
import 'twin.macro';
import UserEdit from './UserEdit';
import UserView from './UserView';

export default function Users() {
    const [modalType, setModalType] = useState<'update' | 'add' | null>(null);
    const [editUser, setEditUser] = useState<BaseUser | null>(null);
    const [users, setUsers] = useState<UserFull[]>([]);

    useEffect(() => {
        refetch();
    }, []);

    const refetch = async () => {
        const result = await getUsers();
        setUsers(result);
    }

    const onEditClick = (type: 'update' | 'add', user?: BaseUser) => {
        setModalType(type);
        user && setEditUser(user);
    };

    const onDeleteClick = async (user: UserFull) => {
        await deleteUser(user);
        refetch();
    }

    const onCloseModal = () => {
        setModalType(null);
        setEditUser(null);
        refetch();
    };

    return (
        <div tw="mx-auto h-screen w-4/5">
            <div tw="p-4 flex flex-col items-center h-screen w-full">
                <Button
                    variant="contained"
                    tw="normal-case mb-3 w-36 mr-auto ml-4"
                    onClick={() => onEditClick('add')}
                >
                    Add
                </Button>
                <div tw="px-4 overflow-y-auto w-full">
                    {users.sort((a, b) => {
                        const aDate = new Date(a.createdAt!);
                        const bDate = new Date(b.createdAt!);
                        return aDate.getTime() - bDate.getTime();
                    }).map((u) => (
                        <UserView user={u} onEdit={() => onEditClick('update', u)} onDelete={() => onDeleteClick(u)} />
                    ))}
                </div>
            </div>
            <Modal
                tw="flex justify-center items-center"
                open={modalType !== null}
                onClose={onCloseModal}
            >
                <Paper tw="p-5">
                    <UserEdit initUser={editUser ?? {}} type={modalType!} onClose={onCloseModal} />
                </Paper>
            </Modal>
        </div>
    );
}
