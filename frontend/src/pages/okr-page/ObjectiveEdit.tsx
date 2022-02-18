import { LineWeight, TextSnippet, Title } from '@mui/icons-material';
import { Button, FormControl, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BaseObjective, ObjectiveFull } from 'src/api/entities';
import { createOrUpdateObjective } from 'src/api/tasks';

interface Props {
    initObjective: Partial<BaseObjective>;
    type: 'update' | 'add';
    okrId: string;
    onClose(): void;
}

export function ObjectiveEdit(props: Props) {
    const [objective, setObjective] = useState<Partial<BaseObjective>>(props.initObjective);
    const [titleError, setTitleError] = useState(false);
    const [weightError, setWeightError] = useState(false);

    useEffect(() => {
        if (objective.title && objective.title.length > 0) {
            setTitleError(false);
        }
        if (objective.weight) {
            setWeightError(false);
        }
    }, [objective.title, objective.weight]);

    const onChange =
        (field: keyof BaseObjective) => (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            if (field === 'weight' && isNaN(Number(value))) {
                return;
            }
            setObjective((prevObjective) => {
                const newObjective = { ...prevObjective };
                newObjective[field] = field === 'weight' ? Number(value) : (value as any);
                return newObjective;
            });
        };

    const onSaveClick = async () => {
        await createOrUpdateObjective(objective as ObjectiveFull, props.okrId, props.type);
        props.onClose();
    };

    return (
        <div className="flex items-center py-2">
            <FormControl
                size="small"
                required
                error={titleError}
                className="w-48"
                variant="outlined"
            >
                <InputLabel>Title</InputLabel>
                <OutlinedInput
                    disabled={props.type === 'update'}
                    value={objective.title ?? ''}
                    onChange={onChange('title')}
                    endAdornment={
                        <InputAdornment position="end">
                            <Title />
                        </InputAdornment>
                    }
                    label="Title"
                />
            </FormControl>
            <FormControl
                size="small"
                required
                error={weightError}
                className="w-32 ml-2"
                variant="outlined"
            >
                <InputLabel>Weight</InputLabel>
                <OutlinedInput
                    value={objective.weight ?? ''}
                    onChange={onChange('weight')}
                    endAdornment={
                        <InputAdornment position="end">
                            <LineWeight />
                        </InputAdornment>
                    }
                    label="Weight"
                />
            </FormControl>
            <FormControl size="small" className="grow ml-2" variant="outlined">
                <InputLabel>Description</InputLabel>
                <OutlinedInput
                    value={objective.description ?? ''}
                    onChange={onChange('description')}
                    endAdornment={
                        <InputAdornment position="end">
                            <TextSnippet />
                        </InputAdornment>
                    }
                    label="Description"
                />
            </FormControl>
            <div>
                <Button
                    variant="contained"
                    className="w-7 ml-2 normal-case m-0.5"
                    color="success"
                    onClick={onSaveClick}
                >
                    Save
                </Button>
                <Button
                    variant="contained"
                    className="w-7 normal-case m-0.5"
                    color="error"
                    onClick={props.onClose}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
}
