import { Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import { Progressbar } from './home-page/Progressbar';

const okrColumns: GridColDef[] = [
    { field: 'id', headerName: 'id', width: 100 },
    { field: 'round', headerName: 'round', width: 300, valueGetter: (p) => p.row.roundName },
    {
        field: 'progressPercent',
        headerName: 'progressPercent',
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
                to={`${window.location.pathname}/okr/${param.row.id}`.replace('//', '/')}
            >
                مشاهده
            </Button>
        ),
    },
];

export default function OkrsByTypePage() {
    const { by: byType, id } = useParams<{ by: 'team' | 'round'; id: ID }>();

    const { data: okrs } = useQuery<OKR[]>('/okrs/by_' + byType + '/' + id);

    if (!okrs) return null;

    return <DataGrid rows={okrs!} columns={okrColumns} />;
}
