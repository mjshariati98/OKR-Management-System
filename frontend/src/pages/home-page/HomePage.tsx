/** @jsxImportSource @emotion/react */
import { Button, Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import * as React from 'react';
import { useState } from 'react';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';
import { FaList } from 'react-icons/fa';
import { MdOutlineLogout } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { getTarget } from 'src/api/selectors';
import 'twin.macro';
import { Progressbar } from './Progressbar';

const okrColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'round', headerName: 'Round', width: 300, valueGetter: (p) => p.row.round.title },
    {
        field: 'progressPercent',
        headerName: 'Progrss Percent',
        width: 300,
        renderCell: (param) => {
            const value = param.row?.progressPercent;
            return value ? <Progressbar value={value} /> : '---';
        },
    },
    {
        field: 'action',
        headerName: '',
        sortable: false,
        renderCell: (param) => (
            <Button
                component={Link}
                to={`${window.location.pathname}/round/${param.row.round.id}`.replace('//', '/')}
            >
                View
            </Button>
        ),
    },
];

const createTargetColumns = (targetType: Target['type']): GridColDef[] => [
    { field: 'id', headerName: 'ID', width: 100 },
    {
        field: 'name',
        headerName: (
            {
                user: 'Name',
                team: 'Team',
                company: 'Company',
            } as const
        )[targetType],
        width: 300,
    },
    {
        field: 'latestOkrProgressPercent',
        headerName: 'Progress Percent',
        width: 300,
        renderCell: (param) => {
            const okrs = param.row.okrs;
            const percentage = okrs?.[0]?.progressPercent as number | undefined;
            return okrs?.length ? <Progressbar value={percentage ?? 0} /> : '---';
        },
    },
    {
        field: 'action',
        headerName: '',
        sortable: false,
        renderCell: (param) => (
            <Button
                component={Link}
                to={`${window.location.pathname.match(/\/company/)}/${param.row.type}/${
                    param.row.id
                }/`}
            >
                View
            </Button>
        ),
    },
];

export default function HomePage() {
    const params = useParams<{ childTargetId?: ID }>();
    const [filterBy, setFilterBy] = useState(['team']);
    const [viewMode, setViewMode] = useState('list');

    const { company, childTarget, target } = getTarget(params);

    const isCompanyLevel = !childTarget;
    const okrs = target.okrs ?? [];

    const handleViewModeChange = (event: React.MouseEvent<HTMLElement>, newViewMode: string) => {
        setViewMode(newViewMode);
    };

    const handleFilterByChange = (event: React.MouseEvent<HTMLElement>, newFilterBy: string[]) => {
        if (newFilterBy.length) setFilterBy(newFilterBy);
    };

    return (
        <div className="max-w-screen-xl px-8 pt-8 mx-auto items-start">
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item xs>
                    <h1 className="font-bold text-sky-600 text-3xl">OKR Management System</h1>
                </Grid>
                <Grid item xs="auto" className="px-4">
                    <ToggleButtonGroup
                        color="primary"
                        size="small"
                        value={viewMode}
                        exclusive
                        onChange={handleViewModeChange}
                    >
                        <ToggleButton value="list">
                            <FaList size={15} />
                        </ToggleButton>
                        <ToggleButton value="grid">
                            <BsFillGrid3X3GapFill size={15} />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs="auto" className="px-4">
                    <span className="mr-3 text-gray-300 text-sm">Filter By:</span>
                    <ToggleButtonGroup
                        color="primary"
                        size="small"
                        value={filterBy}
                        onChange={handleFilterByChange}
                    >
                        <ToggleButton value="team">Team</ToggleButton>
                        <ToggleButton value="round">Round</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs="auto" className="pl-4">
                    <Button
                        className="btn btn-large signout-btn"
                        variant="outlined"
                        size="small"
                        disableElevation
                        endIcon={<MdOutlineLogout size={18} />}
                    >
                        <span className="mt-[2.5px]">Sign Out</span>
                    </Button>
                </Grid>
            </Grid>
            <div className="w-full h-96 mt-8" style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={okrs}
                    columns={okrColumns}
                />
            </div>
            {/* <Grid item xs={4} mt={3} container>
                {isCompanyLevel && (
                    <DataGrid rows={company.teams} columns={createTargetColumns('team')} />
                )}
            </Grid> */}
        </div>
    );
}
