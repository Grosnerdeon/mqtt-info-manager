import React, { FunctionComponent, useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import RemoveIcon from '@mui/icons-material/Remove';
import SignalWifi0Bar from '@mui/icons-material/SignalWifi0Bar';
import SignalWifiConnectedNoInternet4Icon from '@mui/icons-material/SignalWifiConnectedNoInternet4';
import { IConnection } from '../../dtos/connectionsDto';
import Box from '@mui/material/Box';
import { useActions } from '../../hooks/useActions';
import CardContent from '@mui/material/CardContent';
import CastConnectedIcon from '@mui/icons-material/CastConnected';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import './connectionsCard.css';
import Stack from '@mui/material/Stack';
import localStorageService from '../../services/localStorageService';
import { ApplicationPage } from '../../dtos/applicationDto';

interface IConnectionProps {
    connection: IConnection
}

export const ConnectionCard: FunctionComponent<IConnectionProps> =
    (props: IConnectionProps) => {
        const { connection } = props;
        const { 
            deleteConnection, 
            openConnection,
            closeConnection, 
            changePage, 
            changeMode 
        } = useActions();

        const [firstTopic] = [...connection.topics.values()]

        return (
            <Box className='connection-card' sx={{ width: '100%', paddingTop: 2 }}>
                <Card sx={{ maxWidth: '100%', height: 184 }}>
                    <CardHeader
                        action={
                            <Stack direction="row"> 
                                <Tooltip title="Open Connection" placement="top-start">
                                    <div>
                                        <IconButton aria-label="Open Connection"
                                                    color="primary"
                                                    disabled={connection.isOpen} 
                                                    onClick={() => { 
                                                        openConnection(connection.id)
                                                    }}>
                                            <SignalWifi0Bar />
                                        </IconButton>
                                    </div>
                                </Tooltip>
                                <Tooltip title="Close Connection" placement="top-start">
                                    <div>
                                        <IconButton aria-label="Close Connection"
                                                    color="primary" 
                                                    disabled={!connection.isOpen}
                                                    onClick={() => { 
                                                        closeConnection(connection.id)
                                                    }}>
                                            <SignalWifiConnectedNoInternet4Icon />
                                        </IconButton>
                                    </div>
                                </Tooltip>
                                <Tooltip title="Connection Info" placement="top-start">
                                    <div>
                                        <IconButton aria-label="Connection Info"
                                                    color="primary" 
                                                    disabled={!connection.isOpen}
                                                    onClick={() => { 
                                                        changePage(ApplicationPage.CONNECTION, connection);
                                                        localStorageService.addDataToLocalStorage('appMainConnection', JSON.stringify({ connection: connection, text: `${connection.url} : ${connection.port}` }));
                                                        changeMode();
                                                        }}>
                                            <CastConnectedIcon />
                                        </IconButton>
                                    </div>
                                </Tooltip>
                                <Tooltip title="Remove" placement="top-start">
                                    <IconButton aria-label="Remove"
                                                color="primary"  
                                                onClick={() => deleteConnection(connection.id) }>
                                        <RemoveIcon />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        }
                        title={`Connection ${connection.url} : ${connection.port}`}
                    >
                    </CardHeader>
                    <CardContent>
                        <Stack display='grid' gridTemplateColumns='1fr 1fr'>
                            <Stack>
                                <Typography>
                                    Connection Status: {connection.isOpen ? 'Connected' : 'Diconnected'}
                                </Typography>
                                <Typography>
                                    Subscribed Topics: {connection.topics.size}
                                </Typography>
                            </Stack>
                            <Stack>
                                {firstTopic && 
                                    <Typography>
                                        First Topic: {firstTopic.instanceName} - Count Messages: {firstTopic.messagesFromTopic.length} 
                                    </Typography>}
                            </Stack>
                        </Stack>
                        {connection.isOpen && <LinearProgress style={{ marginTop: 28 }} color="success" />}
                    </CardContent>
                </Card>
            </Box>
        )
    };