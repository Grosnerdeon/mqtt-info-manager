import React, { FunctionComponent, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useActions } from '../../hooks/useActions';
import validationService from '../../services/validationService';
import { REGEXP_VALIDATION } from '../../dtos/validationDto';

export const ConnectionCreater: FunctionComponent =
    () => {
        const urlInputRef: React.RefObject<HTMLInputElement> = useRef(null)
        const portInputRef: React.RefObject<HTMLInputElement> = useRef(null)
        const { createConnection, changeMode } = useActions();
        const [errorUrlByRegexp, setErrorUrlByRegexp] = useState(false);
        const [errorPortByRegexp, setErrorPortByRegexp] = useState(false); 
        const [errorUrlByEmpty, setErrorUrlByEmpty] = useState(true);
        const [errorPortByEmpty, setErrorPortByEmpty] = useState(true);
        
        const updateUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
            setErrorUrlByEmpty(false);
            setErrorUrlByRegexp(false);

            if (event.target.value === '') {
                setErrorUrlByEmpty(true);
            } else {
                setErrorUrlByRegexp(!validationService.checkByRegexp(new RegExp(REGEXP_VALIDATION.URL.REGEXP), event.target.value));
            }
        };

        const updatePort = (event: React.ChangeEvent<HTMLInputElement>) => {
            setErrorPortByEmpty(false);
            setErrorPortByRegexp(false);

            if (event.target.value === '') {
                setErrorPortByEmpty(true);
            } else {
                setErrorPortByRegexp(!validationService.checkByRegexp(new RegExp(REGEXP_VALIDATION.PORT.REGEXP), event.target.value));
            }
        };

        const defineHelperText = (textValidationByRegexp: string, errorByEmpty: boolean, errorByRegexp: boolean): string | undefined => {
            if (errorByEmpty) {
                return 'Please enter value';
            }

            if (errorByRegexp) {
                return textValidationByRegexp;
            }

            return undefined;
        }

        const helperTextByUrl = defineHelperText(REGEXP_VALIDATION.URL.TEXT_VALIDATION, errorUrlByEmpty, errorUrlByRegexp);
        const helperTextByPort = defineHelperText(REGEXP_VALIDATION.PORT.TEXT_VALIDATION, errorPortByEmpty, errorPortByRegexp);
        
        return (
            <Stack spacing={2}>
                <Stack spacing={2} style={{ height: '80px' }} direction="row" justifyContent="center">
                    <Stack style={{ width: '100%' }}>
                        <TextField
                            id="url"
                            label="Url"
                            error={errorUrlByRegexp || errorUrlByEmpty}
                            variant="outlined"
                            onChange={updateUrl}
                            helperText={helperTextByUrl}
                            inputRef={urlInputRef} />
                    </Stack>
                    <Stack style={{ width: '100%' }}>
                        <TextField
                            id="port"
                            label="Port"
                            error={errorPortByRegexp || errorPortByEmpty}
                            variant="outlined"
                            onChange={updatePort}
                            helperText={helperTextByPort}
                            inputRef={portInputRef} />
                    </Stack>
                </Stack>
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
                        disabled={errorUrlByRegexp || errorPortByRegexp || errorPortByEmpty || errorUrlByEmpty}
                        onClick={() => {
                            createConnection(
                                urlInputRef.current!.value,
                                +portInputRef.current!.value
                            )
                        }}>
                        Create Connection
                    </Button>
                </Stack>
            </Stack>
        )
    };