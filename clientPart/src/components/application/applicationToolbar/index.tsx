import { AppBar, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import React, { FunctionComponent } from 'react';

import { useTypedSelector } from "../../../hooks/useTypedSelector";
import { ApplicationPage } from '../../../dtos/applicationDto';
import { ConnectionsActionBar } from './connectionsActionBar';
import { ConnectionActionBar } from './connectionActionBar';

interface ApplicationToolBarProps {
    colorMode: any
    theme: any
}

export const ApplicationToolBar: FunctionComponent<ApplicationToolBarProps> =
    (props: ApplicationToolBarProps) => {
        const { colorMode, theme } = props;
        const {
            connection, 
            currentPage
        } = useTypedSelector((state) => state.application);

        const title = connection ? 
            `Connection ${connection.url}:${connection.port}` : 
            "Mqtt Info Manager";

        return (
            <AppBar position="fixed">
                <Toolbar variant="dense">
                    <Stack spacing={2} 
                           direction='row' 
                           justifyContent="space-between" 
                           style={{ width: '100%' }}>
                            <Stack spacing={2} 
                                direction='row' 
                                justifyContent="start" 
                                style={{ width: '100%', marginTop: 4 }}>
                                    <Typography variant="h6" 
                                                color="inherit" 
                                                component="div" 
                                                align="center" 
                                                style={{ width: '100%' }}>
                                                    {title}
                                    </Typography>
                            </Stack>
                            {currentPage === ApplicationPage.CONNECTIONS && 
                            <ConnectionsActionBar></ConnectionsActionBar>}
                            {currentPage === ApplicationPage.CONNECTION && 
                            <ConnectionActionBar></ConnectionActionBar>}
                            <IconButton sx={{ ml: 1 }} 
                                        onClick={colorMode.toggleColorMode} 
                                        color="inherit">
                                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                            </IconButton> 
                    </Stack>
                </Toolbar>
            </AppBar>
        )
    };