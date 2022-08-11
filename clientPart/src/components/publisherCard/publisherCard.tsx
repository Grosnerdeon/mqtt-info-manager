import React, { FunctionComponent } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import { Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Unsubscribe from '@mui/icons-material/Unsubscribe';
import RemoveIcon from '@mui/icons-material/Remove';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import SendIcon from '@mui/icons-material/Send';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import EditIcon from '@mui/icons-material/Edit';
import { ApplicationMode } from '../../dtos/applicationDto';

interface IPublisherProps {
    topic: string
    message: string
    interval: number
    publisherId: string
    active: boolean
}

export const PublisherCard: FunctionComponent<IPublisherProps> =
    (props: IPublisherProps) => {
        const { topic, message, interval, publisherId, active } = props;
        const { connection } = useTypedSelector(state => state.connection);
        const {
            sendPublisher,
            startPublisher,
            stopPublisher,
            deletePublisher,
            changeMode,
        } = useActions();

        return (
            <Box sx={{ width: '100%', paddingTop: 8 }}>
                <Card sx={{ maxWidth: '100%', height: 184 }}>
                    <CardHeader
                        action={
                            <div>
                                <Tooltip title="Send Publisher" placement="top-start">
                                    <IconButton aria-label="Send Publisher"
                                                color="primary"  
                                                onClick={() => { 
                                                    sendPublisher(connection.id, publisherId)
                                                }}>
                                        <SendIcon />
                                    </IconButton>
                                </Tooltip>
                                {!active && <Tooltip title="Start Publisher" placement="top-start">
                                    <IconButton aria-label="Start Publisher"
                                                color="primary"  
                                                onClick={() => { 
                                                    startPublisher(connection.id, publisherId)
                                                }}>
                                        <PlayArrowIcon />
                                    </IconButton>
                                </Tooltip> }
                                {active  && <Tooltip title="Stop Publisher" placement="top-start">
                                    <IconButton aria-label="Stop Publisher"
                                                color="primary"  
                                                onClick={() => { 
                                                    stopPublisher(connection.id, publisherId)
                                                }}>
                                        <StopIcon />
                                    </IconButton>
                                </Tooltip> }
                                <Tooltip title="Update Publisher" placement="top-start">
                                    <IconButton aria-label="Update Publisher"
                                                color="primary"  
                                                onClick={() => { 
                                                    changeMode();
                                                    changeMode(ApplicationMode.PUBLISHER_EDIT, connection.configuredPublishers.get(publisherId))
                                                }}>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Publisher" placement="top-start">
                                    <IconButton aria-label="Delete Publisher"
                                                color="primary"  
                                                onClick={() => { 
                                                    deletePublisher(connection.id, publisherId)
                                                }}>
                                        <RemoveIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        }
                        title={<div style={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <Tooltip title={`Publisher for ${topic}`} placement="top-start">
                                <span >
                                    {`Publisher for ${topic}`}
                                </span>
                            </Tooltip>
                            </div>  }
                    >
                    </CardHeader>
                    <CardContent style={{ height: 82 }}>
                        <Stack>
                            <Typography>
                                Interval: {interval}
                            </Typography>
                        </Stack>
                        <Stack style={{ height: '100%', overflow: 'auto' }}>
                            <Typography whiteSpace='break-spaces'>
                                Message: {typeof message === 'object' ? JSON.stringify(message, null, 2) : message}
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>
        )
    };