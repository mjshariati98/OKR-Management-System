import React from 'react';
import { useQuery } from 'react-query';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { endPoints } from 'src/api/enpoints';
import Layout from './Layout';

interface Props extends RouteProps {
    mode?: 'all' | 'authorized' | 'unauthorized'; // authorized
}

export default function AdvanceRoute(props: Props) {
    const { mode = 'authorized', ...rest } = props;
    const { data } = useQuery(endPoints.profile);

    if (!data && mode === 'authorized') return <Redirect to="/authentication" />;
    if (data && mode === 'unauthorized') return <Redirect to="/company/" />;

    return (
        <>
            <Layout />
            <Route {...rest} />
        </>
    );
}
