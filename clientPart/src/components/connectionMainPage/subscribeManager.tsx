import React, { FunctionComponent, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';

export const SubscribeManager: FunctionComponent =
    () => {
        const topicInputRef: React.RefObject<HTMLInputElement> = useRef(null);
        const { subscribeTopic, changeMode } = useActions();
        const { connection } = useTypedSelector(state => state.connection);
        const [errorTopicByEmpty, setErrorTopicByEmpty] = useState(true);

        const updateTopic = (event: React.ChangeEvent<HTMLInputElement>) => {
            setErrorTopicByEmpty(false);

            if (event.target.value === '') {
                setErrorTopicByEmpty(true);
            }
        };

        const helperTextByTopic = (() => {
            if (errorTopicByEmpty) {
                return 'Please enter value';
            }
            
            return undefined;
        })();

        return (
            <Stack spacing={2} direction="column" justifyContent="space-between">
                <TextField
                    id="topic"
                    label="Topic"
                    style={{ height: '80px' }}
                    error={errorTopicByEmpty}
                    onChange={updateTopic}
                    helperText={helperTextByTopic}
                    variant="outlined"
                    inputRef={topicInputRef} />
                <Stack spacing={2} direction="row" justifyContent="center">
                    <Button
                        variant="contained"
                        onClick={() => {
                            changeMode();
                        }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        disabled={errorTopicByEmpty}
                        onClick={() => {
                            if (connection) {
                                subscribeTopic(connection?.id, topicInputRef.current!.value)
                            }
                        }}>
                        Subscribe
                    </Button>
                </Stack>
            </Stack>
        )
    };