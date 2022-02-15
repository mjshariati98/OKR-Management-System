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
import { useParams } from 'react-router-dom';
import { getTarget } from 'src/api/selectors';
import 'twin.macro';

export default function OkrPage() {
    const params = useParams<{ childTargetId?: ID; roundId?: ID }>();

    const { target, team } = getTarget(params);

    const okr = target.okrs!.find((okr) => okr.round.id === params.roundId);

    return (
        <div>
            <Typography variant="h1">spring round , {team!.name}</Typography>
            {okr?.objectives.map((objective) => (
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
