import { LineWeight, TextSnippet, Title } from '@mui/icons-material';
import { Button, FormControl, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BaseKR, BaseObjective, KRFull, ObjectiveFull } from 'src/api/entities';
import { createOrUpdateKR, createOrUpdateObjective } from 'src/api/tasks';

interface Props {
    initKR: Partial<BaseKR>;
    type: 'update' | 'add';
    okrId: string;
    objectiveId: string;
    onClose(): void;
}

export function KREdit(props: Props) {
    const [kr, setKR] = useState<Partial<BaseObjective>>(props.initKR);
    const [titleError, setTitleError] = useState(false);
    const [weightError, setWeightError] = useState(false);

    useEffect(() => {
        if (kr.title && kr.title.length > 0) {
            setTitleError(false);
        }
        if (kr.weight) {
            setWeightError(false);
        }
    }, [kr.title, kr.weight]);

    const onChange =
        (field: keyof BaseKR) => (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            if (field === 'weight' && isNaN(Number(value))) {
                return;
            }
            setKR((prevKR) => {
                const newKR = { ...prevKR };
                newKR[field] = field === 'weight' ? Number(value) : (value as any);
                return newKR;
            });
        };

    const onSaveClick = async () => {
        if (!kr.title || kr.title === '') {
            setTitleError(true);
            return;
        }
        if (!kr.weight || kr.weight.toString().length === 0) {
            setWeightError(true);
            return;
        }
        await createOrUpdateKR(kr as KRFull, props.objectiveId, props.okrId, props.type);
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
                    value={kr.title ?? ''}
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
                    value={kr.weight ?? ''}
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
                    value={kr.description ?? ''}
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
