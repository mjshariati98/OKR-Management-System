/** @jsxImportSource @emotion/react */
import { Button, Grid, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Link, useParams } from 'react-router-dom';
import { getTarget } from 'src/api/selectors';
import 'twin.macro';

const okrColumns: GridColDef[] = [
    { field: 'id', headerName: 'شناسه', width: 100 },
    { field: 'round', headerName: 'دوره', width: 300, valueGetter: (p) => p.row.round.title },
    
];

const createTargetColumns = (targetType: Target['type']): GridColDef[] => [
    { field: 'id', headerName: 'شناسه', width: 100 },
   
];

export default function OkrPage() {
    const params = useParams<{ companyId: ID; childTargetId?: ID }>();

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
        </Grid>
    );
}
