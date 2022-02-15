/** @jsxImportSource @emotion/react */
import { Button, Grid, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Link, useParams } from 'react-router-dom';
import { getTarget } from 'src/api/selectors';
import 'twin.macro';
import { Progressbar } from './Progressbar';

const okrColumns: GridColDef[] = [
    { field: 'id', headerName: 'شناسه', width: 100 },
    { field: 'round', headerName: 'دوره', width: 300, valueGetter: (p) => p.row.round.title },
    {
        field: 'progressPercent',
        headerName: 'درصد پیشرفت',
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
                مشاهده
            </Button>
        ),
    },
];

const createTargetColumns = (targetType: Target['type']): GridColDef[] => [
    { field: 'id', headerName: 'شناسه', width: 100 },
    {
        field: 'name',
        headerName: (
            {
                user: 'نام',
                team: 'تیم',
                company: 'شرکت',
            } as const
        )[targetType],
        width: 300,
    },
    {
        field: 'latestOkrProgressPercent',
        headerName: 'درصد پیشرفت',
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
                to={`${window.location.pathname.match(/\/company\/[^/]*/)}/${param.row.type}/${
                    param.row.id
                }/`}
            >
                مشاهده
            </Button>
        ),
    },
];

export default function HomePage() {
    const params = useParams<{ childTargetId?: ID }>();

    const { company, childTarget, target, team } = getTarget(params);

    const isCompanyLevel = !childTarget;
    const okrs = target.okrs ?? [];

    return (
        <Grid
            container
            height="100vh"
            direction="column"
            alignItems="center"
            justifyContent="center"
        >
            <Typography variant="h1">{target.name}</Typography>
            <Grid item xs={4} mt={3} container width={1000}>
                <DataGrid rows={okrs} columns={okrColumns} />
            </Grid>

            <Grid item xs={4} mt={3} container width={1000}>
                {isCompanyLevel && (
                    <Grid item xs={12}>
                        <DataGrid rows={company.teams} columns={createTargetColumns('team')} />
                    </Grid>
                )}
                {team && (
                    <Grid item xs={12}>
                        <DataGrid rows={team.members} columns={createTargetColumns('user')} />
                    </Grid>
                )}
            </Grid>
        </Grid>
    );
}
