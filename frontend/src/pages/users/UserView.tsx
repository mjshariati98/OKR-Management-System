/** @jsxImportSource @emotion/react */
import { AccountCircle, CalendarToday, Delete, Edit, Group, Mail, Phone } from "@mui/icons-material";
import { Card, IconButton, Paper } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { UserFull } from "src/api/entities";
import "twin.macro";

interface Props {
    user: UserFull;
    onEdit(): void;
    onDelete(): void;
}

export default function UserView( props: Props ) {
    const user = props.user;
    const roleColor = {
        Admin: "red",
        Normal: "green",
        TeamLeader: "purple",
        ProductManager: "orange",
    }

    return (
        <Card tw="shadow-xl p-2 mt-4 flex items-center w-full relative">
            <AccountCircle tw="w-20 h-20" color="secondary"/>
            <div tw="ml-4 w-48">
                <div tw="text-lg font-semibold"> {`${user.firstname} ${user.lastname}`} </div>
                <div tw="text-gray-500"> {`@${user.username}`} </div>
            </div>
            <Box sx={{bgcolor: `${roleColor[user.role]}`}} tw="m-1 text-white absolute rounded px-2 right-0 top-0">
                {user.role}
            </Box>
            <div tw="flex text-gray-500 flex-wrap flex-grow">
                <div tw="font-bold text-lg flex ml-7">
                    <Group />
                    <div tw="ml-2"> {user.teamName} </div>
                </div>
                <div tw="flex ml-36">
                    <Mail />
                    <div tw="ml-2"> {user.email} </div>
                </div>
                <div tw="flex ml-7">
                    <Phone />
                    <div tw="ml-2"> {user.phone} </div>
                </div>
                <div tw="flex ml-auto mr-48">
                    <CalendarToday />
                    <div tw="ml-2"> {user.createdAt.toLocaleString()} </div>
                </div>
            </div>
            <div tw="flex bottom-0 right-0 absolute">
                <IconButton color="success" tw="mr-2" onClick={props.onEdit}>
                    <Edit fontSize="large" color="primary"/>
                </IconButton>
                <IconButton onClick={props.onDelete}>
                    <Delete fontSize="large" color="error"/>
                </IconButton>
            </div>
        </Card>
    )
}
