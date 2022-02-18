/** @jsxImportSource @emotion/react */
import {
    AccountCircle,
    CalendarToday,
    Delete,
    Edit,
    Group,
    Mail,
    Phone,
} from '@mui/icons-material';
import { Card, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { UserFull } from 'src/api/entities';
import { Role } from 'src/api/enums';
import { roleColor } from 'src/api/utils';
import 'twin.macro';

interface Props {
    user: UserFull;
    onEdit(): void;
    onDelete(): void;
}

export default function UserView(props: Props) {
    const user = props.user;

    return (
        <Card tw="shadow-xl p-2 mt-4 flex items-center w-full relative">
            <AccountCircle tw="w-16 h-16" color="secondary" />
            <div tw="ml-4 w-48">
                <div tw="text-lg font-semibold"> {`${user.firstname} ${user.lastname}`} </div>
                <div tw="text-gray-500"> {`@${user.username}`} </div>
            </div>
            <Box
                sx={{ bgcolor: `${roleColor[user.role]}` }}
                tw="m-1 text-white absolute rounded px-2 right-0 top-0"
            >
                {user.role}
            </Box>
            <div tw="flex text-gray-500 flex-wrap flex-grow">
                <div tw="font-bold text-lg flex ml-4">
                    <Group />
                    <Box
                        sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                        tw="w-48 ml-2"
                    >
                        {user.teamName}
                    </Box>
                </div>
                <div tw="flex ml-2">
                    <Mail />
                    <Box
                        sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                        tw="w-60 ml-2"
                    >
                        {user.email}
                    </Box>
                </div>
                <div tw="flex ml-7">
                    <Phone />
                    <Box
                        sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                        tw="w-24 ml-2"
                    >
                        {user.phone}
                    </Box>
                </div>
                <div tw="flex ml-auto mr-16">
                    <CalendarToday />
                    <Box
                        sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                        tw="w-60 ml-2"
                    >
                        {user.createdAt && new Date(user.createdAt).toLocaleString()}
                    </Box>
                </div>
            </div>
            <div tw="flex bottom-0 right-0 absolute">
                <IconButton color="success" onClick={props.onEdit}>
                    <Edit color="primary" />
                </IconButton>
                {user.role !== Role.Admin && (
                    <IconButton onClick={props.onDelete}>
                        <Delete color="error" />
                    </IconButton>
                )}
            </div>
        </Card>
    );
}
