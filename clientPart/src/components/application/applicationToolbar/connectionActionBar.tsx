import { IconButton, Stack, Tooltip } from '@mui/material';
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import AddRoadIcon from '@mui/icons-material/AddRoad';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import React, { FunctionComponent } from 'react';

import { useTypedSelector } from "../../../hooks/useTypedSelector";
import { useActions } from "../../../hooks/useActions"
import { ApplicationMode, ApplicationPage } from '../../../dtos/applicationDto';
import localStorageService from "../../../services/localStorageService";

export const ConnectionActionBar: FunctionComponent =
    () => {
        const {
            connection
        } = useTypedSelector((state) => state.connection);
        const { currentMode } = useTypedSelector((state) => state.application);

        const {
            changeMode,
            changePage
        } = useActions();

        return (
            <Stack direction='row'>
                <Tooltip title="Subscribe" 
                         placement="top-start">
                        <IconButton aria-label="Subscribe"
                                    color="inherit" 
                                    disabled={
                                        currentMode === ApplicationMode.SUBSCRIBE || 
                                        (connection && !connection.isOpen)
                                    }
                                    onClick={() => {
                                        changeMode(ApplicationMode.SUBSCRIBE);
                                    }}>
                                        <SubtitlesIcon />
                        </IconButton>
                </Tooltip>
                <Stack spacing={2} 
                        direction='row' 
                        justifyContent="space-between">
                    <Tooltip title="Create Publisher" 
                                placement="top-start">
                        <IconButton aria-label="Create Publisher"
                                    color="inherit" 
                                    onClick={() => { 
                                        changeMode(ApplicationMode.PUBLISHER_EDIT)
                                    }}>
                            <AddRoadIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Publishers" placement="top-start">
                        <IconButton aria-label="Publishers"
                                    color="inherit" 
                                    onClick={() => { 
                                        changeMode(ApplicationMode.PUBLISHER_LIST)
                                    }}>
                            <FormatListBulletedIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
                <Tooltip title="Back to Connection List" placement="top-start">
                    <IconButton aria-label="Back to Connection List"
                            color="inherit" 
                            onClick={() => {
                                changeMode();

                                changePage(ApplicationPage.CONNECTIONS);

                                localStorageService.removeDataToLocalStorage('appConnectionId');
                                }}>
                        <ArrowBackIcon />
                    </IconButton>
                </Tooltip>
            </Stack>
        )
    };