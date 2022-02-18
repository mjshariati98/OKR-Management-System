/** @jsxImportSource @emotion/react */
import { Button, Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import * as React from 'react';
import { useState } from 'react';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';
import { FaList } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
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
                {/* <Grid item xs="auto" className="pl-2 md:pl-3 lg:pl-4">
                    <Button
                        className="btn signout-btn"
                        variant="outlined"
                        size="small"
                        disableElevation
                        endIcon={<MdOutlineLogout size={18} />}
                    >
                        <span className="mt-[3px]">Sign Out</span>
                    </Button>
                </Grid> */}
            </Grid>
            {filterBy.forEach((f) => (
                <div className="w-full h-96 mt-8" style={{ height: 400, width: '100%' }}>
                    <DataGrid rows={f === 'team' ? teams! : rounds!} columns={okrColumns} />
                </div>
            ))}
        </div>
    );
}
