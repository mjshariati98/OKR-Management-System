import { css, injectGlobal } from '@emotion/css';
import { Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ResponsiveBar } from '@nivo/bar';
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import { Progressbar } from './home-page/Progressbar';

const okrColumns: GridColDef[] = [
    { field: 'id', headerName: 'id', width: 100 },
    { field: 'description', headerName: 'description', width: 200 },
    { field: 'team', headerName: 'team', width: 200 },
    { field: 'roundId', headerName: 'roundId', width: 200 },
    // { field: 'objectives.length', headerName: 'objectives length', width: 100, valueGetter: (x: any) => x.objectives?.length },
    {
        field: 'okrProgress',
        headerName: 'okrProgress',
        width: 200,
        renderCell: (param) => {
            const value = param.row?.okrProgress;
            return value != null ? <Progressbar value={value} /> : '---';
        },
    },
    {
        field: 'actions',
        headerName: 'actions',
        sortable: false,
        renderCell: (param) => (
            <Button component={Link} to={`/okr/${param.row.id}`}>
                view
            </Button>
        ),
    },
];

injectGlobal`
`

export default function OkrsByTypePage() {
    const { by: byType, id } = useParams<{ by: 'team' | 'round'; id: ID }>();

    const { data: okrs } = useQuery<OKR[]>('/okrs/by_' + byType + '/' + id);

    if (!okrs) return null;

    const indexBy = byType === 'round' ? 'team' : 'roundId';

    return (
        <div className="h-[70vh]">
            <DataGrid autoHeight rows={okrs} columns={okrColumns} />
            <ResponsiveBar
                data={okrs as any}
                keys={['okrProgress']}
                indexBy={indexBy}
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
                    legend: indexBy,
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
