/** @jsxImportSource @emotion/react */
import { Button, MenuItem, TextField } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import { createOrUpdateOkr } from 'src/api/tasks';
import { formRegisterTransform } from 'src/utils/form';
import 'twin.macro';

interface Props {
    teams: Team[];
    rounds: Round[];
    onClose(): void;
}

export default function OkrEdit(props: Props) {
    const { register, handleSubmit } = useForm({});

    const onSubmit = handleSubmit(async (okr) => {
        const r = await createOrUpdateOkr(okr as OKR, 'add');
        props.onClose();
    });

    return (
        <form tw="p-8" onSubmit={onSubmit}>
            <TextField
                multiline
                rows={3}
                label="Description"
                {...formRegisterTransform(register('description'))}
            />
            <TextField
                select
                // disabled={props.type === 'update'}
                label="team"
                required
                {...formRegisterTransform(register('teamName', { required: true }))}
            >
                {props.teams.map((team) => (
                    <MenuItem value={team.name}>{team.name}</MenuItem>
                ))}
            </TextField>
            <TextField
                select
                required
                // disabled={props.type === 'update'}
                label="round"
                {...formRegisterTransform(
                    register('roundId', { valueAsNumber: true, required: true })
                )}
            >
                {props.rounds.map((round) => (
                    <MenuItem value={round.id}>{round.name}</MenuItem>
                ))}
            </TextField>
            <div tw="">
                <Button
                    tw="w-7 m-1 normal-case"
                    variant="contained"
                    color="success"
                    onClick={onSubmit}
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
        </form>
    );
}
