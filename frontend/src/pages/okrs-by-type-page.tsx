import { Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ResponsiveBar } from '@nivo/bar';
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
                to={`/company/okr/${param.row.id}`.replace('//', '/')}
            >
                view
            </Button>
        ),
    },
];

export default function OkrsByTypePage() {
    const { by: byType, id } = useParams<{ by: 'team' | 'round'; id: ID }>();

    const { data: okrs } = useQuery<OKR[]>('/okrs/by_' + byType + '/' + id);

    if (!okrs) return null;

    return (
        <div className="h-screen">
            <DataGrid rows={okrs} columns={okrColumns} />
            <ResponsiveBar
                data={okrs as any}
                keys={['okrProgress']}
                indexBy="roundId"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={{ scheme: 'nivo' }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'roundId',
                    legendPosition: 'middle',
                    legendOffset: 32,
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'progress percentage',
                    legendPosition: 'middle',
                    legendOffset: -40,
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
            />
        </div>
    );
}
