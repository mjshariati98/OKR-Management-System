import React from 'react';
import { useQuery } from 'react-query';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { endPoints } from 'src/api/enpoints';
import { UserFull } from 'src/api/entities';
import { Role } from 'src/api/enums';
import Layout from './Layout';

interface Props extends RouteProps {
    mode?: 'all' | 'authorized' | 'unauthorized'; // authorized
}

export default function AdvanceRoute(props: Props) {
    const { mode = 'authorized', ...rest } = props;
    const { data, error } = useQuery<UserFull>(endPoints.profile);

    if (error && mode === 'authorized') return <Redirect to="/authentication" />;
    if (data && mode === 'unauthorized') return <Redirect to="/company/" />;

    const hasPrivateRouteAccess = !!data && (data.role === Role.TL || data.role === Role.Admin)

    return (
        <>
            <Layout hasPrivateRouteAccess={hasPrivateRouteAccess} />
            <Route {...rest} />
        </>
    );
}
