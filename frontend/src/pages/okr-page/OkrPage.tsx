/** @jsxImportSource @emotion/react */
import { ExpandMore } from '@mui/icons-material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import 'twin.macro';

export default function OkrPage() {
    const params = useParams<{ okrId?: ID }>();

    const { data: okr } = useQuery<OKR>(['/okrs/' + params.okrId]);

    if (!okr) return null;

    return (
        <div>
            <Typography variant="h1">spring round , {''}</Typography>
            {okr.objectives.map((objective) => (
                <Accordion key={objective.id}>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>{objective.description}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List>
                            {objective.keyResults.map((keyResult) => (
                                <ListItem>
                                    <ListItemText>{keyResult.description}</ListItemText>
                                </ListItem>
                            ))}
                        </List>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
}
