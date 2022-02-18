/** @jsxImportSource @emotion/react */
import { AccountCircle, Cancel, CheckCircle, Delete, Edit, Group, PersonAdd } from "@mui/icons-material";
import { Card, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { UserFull, TeamFull } from "src/api/entities";
import { Role } from "src/api/enums";
import { addMemberToTeam, getUsers, removeMemberFromTeam } from "src/api/tasks";
import { roleColor } from "src/api/utils";
import "twin.macro";

interface Props {
    team: TeamFull;
    members: UserFull[];
    users: UserFull[];
    onEdit(): void;
    onDelete(): void;
    onChangeMembers(): void;
}

export default function TeamView( props: Props ) {
    const [selectedUsername, setSelectedUsername] = useState("");
    const [addingMode, setAddingMode] = useState(false);

    const { team, members, users } = props;
    const teamLeader = members.find((m) => m.role === Role.TL);
    const productManager = members.find((m) => m.role === Role.PM);
    const normalMembers = members.filter((m) => m.role === Role.Normal);

    const sortedMembers = [teamLeader, productManager, ...normalMembers];

    const handleChangeSelectedUsername = (event: SelectChangeEvent) => {
        setSelectedUsername(event.target.value as string);
    };

    const onAddMemberClick = async () => {
        if (selectedUsername !== "") {
            await addMemberToTeam(team.name, selectedUsername);
        }
        setSelectedUsername("");
        setAddingMode(false);
        props.onChangeMembers();
    }

    const onDeleteMemberClick = async (user: UserFull) => {
        await removeMemberFromTeam(team.name, user.username);
        props.onChangeMembers();
    }

    return (
        <Card tw="shadow-xl w-96 m-2">
            <Paper tw="flex p-3">
                <Box tw="w-20 h-20 rounded-full" sx={{bgcolor: "lightblue"}}>
                    <Group tw="w-full h-full p-3 text-white"/>
                </Box>
                <div tw="ml-5 w-72">
                    <div tw="flex">
                        <div tw="text-lg font-semibold">{team.name}</div>
                        <IconButton tw="p-1 ml-auto" onClick={props.onEdit}>
                            <Edit color="primary" />
                        </IconButton>
                        <IconButton tw="p-1" onClick={props.onDelete}>
                            <Delete color="error" />
                        </IconButton>
                    </div>
                    <div>{team.description}</div>
                </div>
            </Paper>
            <div tw="p-2 w-full flex flex-wrap items-center">
                {sortedMembers.map((m) => {
                    if (!m) return null;
                    const color = roleColor[m.role];
                    return (
                        <div tw="flex items-center w-full bg-gray-100 rounded my-1">
                            <AccountCircle tw="w-10 h-10 m-0.5 cursor-pointer" color="warning" />
                            <div tw="ml-2 text-gray-500">{`@${m.username}`}</div>
                            <Box tw="ml-auto mr-2 text-sm text-white p-1 rounded" sx={{bgcolor: color}}>{m.role}</Box>
                            {(m.role === Role.Normal || m.role === Role.PM) && (
                                <IconButton onClick={() => onDeleteMemberClick(m)}>
                                    <Delete color="error" />
                                </IconButton>
                            )}
                        </div>
                    )
                })}
                {addingMode ? (
                    <div tw="flex items-center w-full mt-6">
                        <FormControl size="small" tw="w-48">
                            <InputLabel id="member">Member</InputLabel>
                            <Select
                                labelId="member"
                                value={selectedUsername}
                                label="Member"
                                onChange={handleChangeSelectedUsername}
                            >
                                {users.filter((u) => !u.teamName && u.role === Role.Normal).map((u, i) => (
                                    <MenuItem key={i} value={u.username}>{u.username}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <IconButton tw="p-0 ml-auto" onClick={() => setAddingMode(false)}>
                            <Cancel fontSize="large" color="error" />
                        </IconButton>
                        <IconButton tw="p-0" onClick={onAddMemberClick}>
                            <CheckCircle fontSize="large" color="success"/>
                        </IconButton>
                    </div>
                ) : (
                    <IconButton tw="ml-auto mr-1" onClick={() => setAddingMode(true)}>
                        <PersonAdd tw="w-8 h-8" color="primary"/>
                    </IconButton>
                )}
            </div>
        </Card>
    )
}
