/** @jsxImportSource @emotion/react */
import { Button, Dialog, Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import * as React from 'react';
import { useState } from 'react';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';
import { FaList } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { useToggle } from 'react-use';
import 'twin.macro';
import OkrEdit from './OkrEdit';

const teamColumns: GridColDef[] = [
    { field: 'name', headerName: 'name', width: 100 },
    {
        field: 'productManager',
        headerName: 'productManager',
        width: 200,
    },
    {
        field: 'teamLeader',
        headerName: 'teamLeader',
        width: 200,
    },
    {
        field: 'description',
        headerName: 'description',
        width: 200,
    },
    {
        field: 'actions',
        headerName: 'actions',
        sortable: false,
        renderCell: (param) => (
            <Button
                component={Link}
                to={`/okrs/team/${param.row.name}`.replace('//', '/')}
            >
                View
            </Button>
        ),
    },
];

const roundColumns: GridColDef[] = [
    { field: 'id', headerName: 'id', width: 100 },
    {
        field: 'name',
        headerName: 'name',
        width: 300,
    },
    {
        field: 'actions',
        headerName: 'actions',
        sortable: false,
        renderCell: (param) => (
            <Button
                component={Link}
                to={`/okrs/round/${param.row.id}/`}
            >
                View
            </Button>
        ),
    },
];

export default function HomePage() {
    const [filterBy, setFilterBy] = useState(['team']);
    const [viewMode, setViewMode] = useState('list');

    const { data: teams } = useQuery<Team[]>('/teams/');
    const { data: rounds } = useQuery<Round[]>('/rounds/');

    const handleViewModeChange = (event: React.MouseEvent<HTMLElement>, newViewMode: string) => {
        setViewMode(newViewMode);
    };

    const handleFilterByChange = (event: React.MouseEvent<HTMLElement>, newFilterBy: string[]) => {
        if (newFilterBy.length) setFilterBy(newFilterBy);
    };

    const [okrModal, toggleOkrModal] = useToggle(false);

    if (!teams || !rounds) return null;

    return (
        <div className="container pt-6">
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item xs>
                    <h1 className="font-bold text-sky-600 text-2xl lg:text-3xl">
                        OKR Management System
                    </h1>
                </Grid>
                <Grid item xs="auto" className="hidden md:block px-2 md:px-3 lg:px-4">
                    <ToggleButtonGroup
                        color="primary"
                        size="small"
                        value={viewMode}
                        exclusive
                        onChange={handleViewModeChange}
                    >
                        <ToggleButton className="!py-1" value="list">
                            <FaList size={15} />
                        </ToggleButton>
                        <ToggleButton className="!py-1" value="grid">
                            <BsFillGrid3X3GapFill size={15} />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs="auto" className="pl-2 md:pl-3 lg:pl-4">
                    <span className="mr-3 text-gray-300 text-sm">Filter By:</span>
                    <ToggleButtonGroup
                        color="primary"
                        size="small"
                        value={filterBy}
                        onChange={handleFilterByChange}
                    >
                        <ToggleButton className="!py-1" value="team">
                            Team
                        </ToggleButton>
                        <ToggleButton className="!py-1" value="round">
                            Round
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item className="pl-2 md:pl-3 lg:pl-4">
                    <Button variant="contained" onClick={toggleOkrModal}>
                        Add OKR
                    </Button>
                    <Dialog open={okrModal} onClose={toggleOkrModal}>
                        <OkrEdit teams={teams} rounds={rounds} onClose={toggleOkrModal} />
                    </Dialog>
                </Grid>
            </Grid>
            {filterBy.map((f) => (
                <div key={f} className="w-full h-96 mt-8" style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        getRowId={(row) => row.id || row.name}
                        rows={f === 'team' ? teams! : rounds!}
                        columns={f === 'team' ? teamColumns! : roundColumns!}
                    />
                </div>
            ))}
        </div>
    );
}
