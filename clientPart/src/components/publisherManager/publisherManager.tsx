import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import Typography from '@mui/material/Typography';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Divider from '@mui/material/Divider';
import validationService from '../../services/validationService';
import { REGEXP_VALIDATION } from '../../dtos/validationDto';
import { Checkbox } from '@mui/material';

export const PublisherManager: FunctionComponent =
    () => {
        const intervalInputRef: React.RefObject<HTMLInputElement> = useRef(null);
        const topicInputRef: React.RefObject<HTMLInputElement> = useRef(null);
        const messageInputRef: React.Ref<HTMLTextAreaElement> = useRef(null);
        const [errorTopicByRegexp, setErrorTopicByRegexp] = useState(false);
        const [errorTopicByEmpty, setErrorTopicByEmpty] = useState(true);
        const [errorIntervalByEmpty, setErrorIntervalByEmpty] = useState(true);
        const [errorMessageByEmpty, setErrorMessageByEmpty] = useState(true);
        const [errorMessageByJson, setErrorMessageByJson] = useState(false);
        const [useJsonFormat, setUseJsonFormat] = useState(false);

        const validateTopic = (value: string) => {
            setErrorTopicByRegexp(false);
            setErrorTopicByEmpty(false);

            if (value === '') {
                setErrorTopicByEmpty(true);
            } else {
                const topicSplit = value.split('/');

                if (topicSplit.length > 1) {
                    setErrorTopicByRegexp(!topicSplit.every(topic => validationService.checkByRegexp(new RegExp(REGEXP_VALIDATION.TOPIC_BY_PUBLISHER.REGEXP), topic)))
                } else {
                    const checkTopicByPublisher = 
                        validationService.checkByRegexp(new RegExp(REGEXP_VALIDATION.TOPIC_BY_PUBLISHER.REGEXP), topicSplit[0]);
                    setErrorTopicByRegexp(checkTopicByPublisher !== undefined ? !checkTopicByPublisher : false)
                }
            }
        }

        const validateIntereval = (value: string) => {
            setErrorIntervalByEmpty(false);

            if (value === '') {
                setErrorIntervalByEmpty(true);
            }
        }

        const validateMessage = (value: string) => {
            setErrorMessageByEmpty(false);
            setErrorMessageByJson(false);

            if (value === '') {
                setErrorMessageByEmpty(true);
            } else {
                setErrorMessageByJson(!validationService.defineIsJson(value));
            }
        }

        const updateTopic = (event: React.ChangeEvent<HTMLInputElement>) => {
            validateTopic(event.target.value);
        };

        const updateInterval = (event: React.ChangeEvent<HTMLInputElement>) => {
            validateIntereval(event.target.value)
        }

        const updateMessage = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            validateMessage(event.target.value);
        }

        const defineHelperText = (textValidationByRegexp: string, errorByEmpty: boolean, errorByRegexp: boolean): string | undefined => {
            if (errorByEmpty) {
                return 'Please enter value';
            }

            if (errorByRegexp) {
                return textValidationByRegexp;
            }

            return undefined;
        }

        const { 
            changeMode,
            createPublisher,
            updatePublisher
        } = useActions();
        const { publisher } = useTypedSelector(state => state.application);
        const { connection } = useTypedSelector(state => state.connection);
        const isEdit = publisher && publisher.publisherId;

        useEffect(() => {
            intervalInputRef.current!.value = '1';
            if (publisher) {
                topicInputRef.current!.value = publisher.topic;

                if (isEdit) {
                    intervalInputRef.current!.value = `${publisher.interval}`;
                    messageInputRef.current!.value = typeof publisher.message === 'object' ? JSON.stringify(publisher.message, null, 2) : publisher.message;

                    validateIntereval(`${publisher.interval}`);
                    validateMessage(typeof publisher.message === 'object' ? JSON.stringify(publisher.message, null, 2) : publisher.message);
                } else {
                    validateIntereval(`1`);

                    messageInputRef.current!.value = typeof publisher.message === 'object' ? JSON.stringify(publisher.message, null, 2) : publisher.message;
                    validateMessage(typeof publisher.message === 'object' ? JSON.stringify(publisher.message, null, 2) : publisher.message);
                }

                validateTopic(publisher.topic)
            } else {
                topicInputRef.current!.value = '';
                validateIntereval(`1`);
            }
        }, [])

        const helperTextByTopic = defineHelperText(REGEXP_VALIDATION.TOPIC_BY_PUBLISHER.TEXT_VALIDATION, errorTopicByEmpty, errorTopicByRegexp);
        const helperTextByInterval = (() => {
            if (errorIntervalByEmpty) {
                return 'Please enter value';
            }

            return undefined;
        })();
        const helperTextByMessage = (() => {
            if (errorMessageByEmpty) {
                return 'Please enter value';
            }

            if (errorMessageByJson) {
                return 'Invalid Json'
            }

            return undefined;
        })();

        return (
            <Stack spacing={2} justifyContent="space-between" style={{ height: '100%', padding: 8 }}>
                <Stack>
                    <Typography align='center' variant='h4'>
                        Publisher For Topic: {publisher && topicInputRef.current ? topicInputRef.current!.value : publisher?.topic}
                    </Typography>
                </Stack>
                <Divider />
                <Stack>
                    <TextField
                            id="topic"
                            error={errorTopicByRegexp || errorTopicByEmpty}
                            label="Topic"
                            variant="outlined"
                            onChange={updateTopic}
                            helperText={helperTextByTopic}
                            inputRef={topicInputRef} />
                </Stack>
                <Stack>
                    <TextField
                            id="intetrval"
                            error={errorIntervalByEmpty}
                            label="Intetrval (Seconds)"
                            type="number"
                            variant="outlined"
                            onChange={updateInterval}
                            helperText={helperTextByInterval}
                            InputProps={{ inputProps: { min: 1, max: 999 } }}
                            inputRef={intervalInputRef} />
                </Stack>
                <Stack style={{ height: '100%' }}>
                    <Stack>
                        <Typography align='center' variant='h6'>
                            Message
                        </Typography>
                        <Stack flexDirection='row' justifyContent='center'>
                            <Typography align='center' style={{ paddingTop: '4px' }} variant='caption'>
                                Use Json Format
                            </Typography>
                            <Checkbox style={{ paddingTop: '0' }} value={useJsonFormat} onChange={() => setUseJsonFormat(!useJsonFormat)}></Checkbox>
                        </Stack>
                    </Stack>
                    <Stack>
                        <TextareaAutosize
                            aria-label="message"
                            minRows={3}
                            onChange={updateMessage}
                            placeholder="If you want to use json, follow the json format!"
                            ref={messageInputRef}
                            style={{ 
                                width: 400, 
                                maxWidth: 400, 
                                height: 200, 
                                maxHeight: 400,
                                minHeight: 200,
                                minWidth: 400,
                                borderColor: errorMessageByEmpty || (useJsonFormat && errorMessageByJson) ? '#d32f2f' : '#c4c4c4',
                                overflow: 'auto' 
                            }}/>
                    </Stack>
                    {(errorMessageByEmpty || (useJsonFormat && errorMessageByJson)) && <Stack>
                        <Typography align='center' variant='h6' style={{ color: '#d32f2f', marginLeft: '14px', marginTop: '3px', textAlign: 'start', fontSize: '0.75rem' }}>
                            {helperTextByMessage}
                        </Typography>
                    </Stack>}
                </Stack>
                <Divider />
                <Stack spacing={2} justifyContent="space-between">
                    {!isEdit && <Button
                        variant="contained"
                        disabled={errorTopicByEmpty || errorTopicByRegexp || errorIntervalByEmpty || errorMessageByEmpty || (useJsonFormat && errorMessageByJson)}
                        onClick={() => {
                            createPublisher(
                                connection.id,
                                publisher ? publisher?.topic : topicInputRef.current!.value,
                                +intervalInputRef.current!.value,
                                messageInputRef.current!.value
                            );
                        }}>
                        Create
                    </Button>}
                    {isEdit && <Button
                        variant="contained"
                        disabled={errorTopicByEmpty || errorTopicByRegexp || errorIntervalByEmpty || errorMessageByEmpty || (useJsonFormat && errorMessageByJson)}
                        onClick={() => {
                            updatePublisher(
                                connection.id,
                                topicInputRef.current!.value,
                                +intervalInputRef.current!.value,
                                messageInputRef.current!.value,
                                publisher ? publisher.publisherId : ''
                            );
                        }}>
                        Update
                    </Button>}   
                    <Button
                        variant="contained"
                        onClick={() => {
                            changeMode();
                        }}>
                        Cancel
                    </Button>
                </Stack>    
            </Stack>
        )
    };