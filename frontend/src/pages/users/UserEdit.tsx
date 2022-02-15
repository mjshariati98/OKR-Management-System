/** @jsxImportSource @emotion/react */
import { Email, Person, Phone } from '@mui/icons-material';
import { Button, FormControl, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BaseUser } from 'src/api/entities';
import { createOrUpdateUser } from 'src/api/tasks';
import 'twin.macro';

interface Props {
    initUser: Partial<BaseUser>;
    type: 'update' | 'add';
    onClose(): void;
}

export default function UserEdit(props: Props) {
    const [user, setUser] = useState<Partial<BaseUser>>(props.initUser);
    const [usernameError, setUsernameError] = useState(false);

    useEffect(() => {
        if (user.username && user.username.length > 0) {
            setUsernameError(false);
        }
    }, [user.username]);

    const onSubmitClick = async () => {
        if (!user.username || user.username === '') {
            setUsernameError(true);
            return;
        }
        await createOrUpdateUser(user as BaseUser, props.type);
        props.onClose();
    };

    const onChange = (field: keyof BaseUser) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setUser((prevUser) => {
            const newUser = { ...prevUser };
            newUser[field] = value;
            return newUser;
        });
    };

    return (
        <div tw="w-80">
            <FormControl required error={usernameError} tw="my-1.5 w-full" variant="outlined">
                <InputLabel>username</InputLabel>
                <OutlinedInput
                    disabled={props.type === 'update'}
                    value={user.username ?? ''}
                    onChange={onChange('username')}
                    endAdornment={
                        <InputAdornment position="end">
                            <Person />
                        </InputAdornment>
                    }
                    label="username"
                />
            </FormControl>
            <FormControl tw="my-1.5 w-full" variant="outlined">
                <InputLabel>firstname</InputLabel>
                <OutlinedInput
                    value={user.firstname ?? ''}
                    onChange={onChange('firstname')}
                    label="firstname"
                />
            </FormControl>
            <FormControl tw="my-1.5 w-full" variant="outlined">
                <InputLabel>lastname</InputLabel>
                <OutlinedInput
                    value={user.lastname ?? ''}
                    onChange={onChange('lastname')}
                    label="lastname"
                />
            </FormControl>
            <FormControl tw="my-1.5 w-full" variant="outlined">
                <InputLabel>email</InputLabel>
                <OutlinedInput
                    value={user.email ?? ''}
                    onChange={onChange('email')}
                    endAdornment={
                        <InputAdornment position="end">
                            <Email />
                        </InputAdornment>
                    }
                    label="email"
                />
            </FormControl>
            <FormControl tw="my-1.5 w-full" variant="outlined">
                <InputLabel>phone</InputLabel>
                <OutlinedInput
                    value={user.phone ?? ''}
                    onChange={onChange('phone')}
                    endAdornment={
                        <InputAdornment position="end">
                            <Phone />
                        </InputAdornment>
                    }
                    label="phone"
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
