import { Button, Grid, IconButton } from '@mui/material';
import React from 'react';
import { MdOutlineLogout, MdSettings } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { logout } from '../api/tasks';

const Layout = (props: {hasPrivateRouteAccess: boolean}) => {
    const hasPrivateRouteAccess = props.hasPrivateRouteAccess;

    return (
        <div className="shadow-lg bg-gray-700 py-2 w-full border-b">
            <Grid
                className="container"
                container
                alignItems="center"
                justifyContent="space-between"
            >
                <Grid item xs>
                    <Link className="mx-2 text-white" to="/">Home</Link>
                    {hasPrivateRouteAccess && <Link className="mx-2 text-white" to="/users">Users</Link>}
                    {hasPrivateRouteAccess && <Link className="mx-2 text-white" to="/teams">Teams</Link>}
                </Grid>
                <Grid item xs="auto">
                    <Button
                        className="btn signout-btn"
                        variant="outlined"
                        size="small"
                        disableElevation
                        endIcon={<MdOutlineLogout size={18} />}
                        onClick={logout}
                    >
                        <span className="mt-[3px]">Sign Out</span>
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default Layout;
