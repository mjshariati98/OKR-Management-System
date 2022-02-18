/** @jsxImportSource @emotion/react */
import { Person, TextSnippet } from '@mui/icons-material';
import {
    Button,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { TeamFull, UserFull } from 'src/api/entities';
import { Role } from 'src/api/enums';
import { createOrUpdateTeam, getUsers } from 'src/api/tasks';
import 'twin.macro';

interface Props {
    initTeam: Partial<TeamFull>;
    type: 'update' | 'add';
    onClose(): void;
}

export default function TeamEdit(props: Props) {
    const [team, setTeam] = useState<Partial<TeamFull>>(props.initTeam);
    const [teamnameError, setTeamnameError] = useState(false);
    const [tlError, setTlError] = useState(false);

    console.log(team);

    const [users, setUsers] = useState<UserFull[]>([]);
    useEffect(() => {
        (async () => {
            setUsers(await getUsers());
        })();
    }, []);

    const freeUsers = users.filter(
        (u) =>
            u.username === team.teamLeader ||
            u.username === team.productManager ||
            (!u.teamName && u.role !== Role.Admin)
    );

    useEffect(() => {
        if (team.name && team.name.length > 0) {
            setTeamnameError(false);
        }
        if (team.teamLeader && team.teamLeader.length > 0) {
            setTlError(false);
        }
    }, [team.name, team.teamLeader]);

    const onSubmitClick = async () => {
        if (!team.name || team.name === '') {
            setTeamnameError(true);
            return;
        }
        if (!team.teamLeader || team.teamLeader === '') {
            setTlError(true);
            return;
        }
        await createOrUpdateTeam(team as TeamFull, props.type);
        props.onClose();
    };

    const onChange = (event: any, field: keyof TeamFull) => {
        const value = event.target.value as string;
        setTeam((prevTeam) => {
            const newTeam = { ...prevTeam };
            newTeam[field] = value as any;
            return newTeam;
        });
    };

    console.log(team.teamLeader )

    return (
        <div tw="w-80">
            <FormControl required error={teamnameError} tw="my-1.5 w-full" variant="outlined">
                <InputLabel>name</InputLabel>
                <OutlinedInput
                    disabled={props.type === 'update'}
                    value={team?.name ?? ''}
                    onChange={(e) => onChange(e, 'name')}
                    endAdornment={
                        <InputAdornment position="end">
                            <Person />
                        </InputAdornment>
                    }
                    label="username"
                />
            </FormControl>
            <FormControl required error={tlError} tw="my-1.5 w-full">
                <InputLabel id="teamLeader">TeamLeader</InputLabel>
                <Select
                    labelId="teamLeader"
                    value={team?.teamLeader ?? ''}
                    label="TeamLeader"
                    onChange={(e) => onChange(e, 'teamLeader')}
                >
                    {freeUsers
                        .filter((u) => team.productManager !== u.username)
                        .map((u, i) => (
                            <MenuItem key={i} value={u.username}>
                                {u.username}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
            <FormControl tw="my-1.5 w-full">
                <InputLabel id="productManager">productManager</InputLabel>
                <Select
                    labelId="productManager"
                    value={team?.productManager ?? ''}
                    label="ProductManager"
                    onChange={(e) => onChange(e, 'productManager')}
                >
                    {freeUsers
                        .filter((u) => team.teamLeader !== u.username)
                        .map((u, i) => (
                            <MenuItem key={i} value={u.username}>
                                {u.username}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
            <FormControl tw="my-1.5 w-full" variant="outlined">
                <InputLabel>description</InputLabel>
                <OutlinedInput
                    value={team?.description ?? ''}
                    onChange={(e) => onChange(e, 'description')}
                    endAdornment={
                        <InputAdornment tw="mb-auto mt-3" position="end">
                            <TextSnippet />
                        </InputAdornment>
                    }
                    label="description"
                    multiline
                    rows={3}
                />
            </FormControl>
            <div tw="p-1">
                <Button
                    tw="w-7 m-1 normal-case"
                    variant="contained"
                    color="success"
                    onClick={onSubmitClick}
                >
                    Save
                </Button>
                <Button
                    tw="w-7 m-1 normal-case"
                    variant="contained"
                    color="error"
                    onClick={props.onClose}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
}
