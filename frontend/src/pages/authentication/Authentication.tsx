/** @jsxImportSource @emotion/react */
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Container,
    FormHelperText,
    TextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import { FormEvent, useState } from 'react';
import { endPoints } from 'src/api/enpoints';
import { queryClient } from 'src/global/query-client';
import 'twin.macro';

interface Props {
    // onDone: VoidFunction;
}

export type { Props as AuthProps };

enum Tabs {
    SignIn,
    SignUp,
}

export default function Authentication(props: Props) {
    const [tab, setTab] = useState(Tabs.SignIn);
    const [error, setError] = useState<string>();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.currentTarget).entries());
        // data.username = data.email;
        axios
            .post(['/users/sign_in', '/users/sign_up'][tab], data)
            .then(() => {
                queryClient.invalidateQueries(endPoints.profile);
            }, (e) => setError(e.response.data));
    };

    return (
        <Container component="main" maxWidth="xs">
            <div tw="my-8 flex flex-col items-center">
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {['Sign in', 'Sign up'][tab]}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        sx={{ m: '0.3em' }}
                        required
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                    />
                    {tab === Tabs.SignUp && (
                        <TextField
                            sx={{ m: '0.3em' }}
                            required
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                        />
                    )}
                    <TextField
                        sx={{ m: '0.3em' }}
                        required
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    {error && <FormHelperText error>{error}</FormHelperText>}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        {['Sign In', 'Sign Up'][tab]}
                    </Button>
                    <Button
                        {...[
                            {
                                onClick: () => setTab(Tabs.SignUp),
                                children: "Don't have an account? Sign Up",
                            },
                            {
                                onClick: () => setTab(Tabs.SignIn),
                                children: 'Already have an account? Sign in',
                            },
                        ][tab]}
                    />
                </Box>
            </div>
        </Container>
    );
}
