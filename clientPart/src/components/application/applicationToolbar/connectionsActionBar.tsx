import { IconButton, Tooltip } from '@mui/material';
import CreateIcon from "@mui/icons-material/Add";

import React, { FunctionComponent } from 'react';

import { useTypedSelector } from "../../../hooks/useTypedSelector";
import { useActions } from "../../../hooks/useActions"
import { ApplicationMode } from '../../../dtos/applicationDto';

export const ConnectionsActionBar: FunctionComponent =
    () => {
        const {
            currentMode
        } = useTypedSelector((state) => state.application);

        const {
            changeMode
        } = useActions();

        return (
            <Tooltip title="Create Connection" 
                     placement="top-start">
                <IconButton aria-label="Create Connection" 
                            disabled={currentMode === ApplicationMode.CONNECTION_CREATE}
                            color="inherit"
                            onClick={() => {
                                changeMode(ApplicationMode.CONNECTION_CREATE);
                            }}>
                            <CreateIcon />
                </IconButton>
            </Tooltip>
        )
    };