import React, { FunctionComponent, useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import './topicCard.css';
import { Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import AlignHorizontalCenterIcon from '@mui/icons-material/AlignHorizontalCenter';
import Unsubscribe from '@mui/icons-material/Unsubscribe';
import AddRoadIcon from '@mui/icons-material/AddRoad';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { ListMessage } from '../listMessage/listMessage';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import Stack from '@mui/material/Stack';
import { IgnoredTopicList } from './ignoredTopicList';
import Divider from '@mui/material/Divider';
import { ApplicationMode } from '../../dtos/applicationDto';

interface ITopicProps {
    topic: string
}

export const TopicCard: FunctionComponent<ITopicProps> =
    (props: ITopicProps) => {
        const { topic } = props;
        const { connection, topicsAutoScroll } = useTypedSelector(state => state.connection);
        const {
            unsubscribeTopic,
            changeMode,
            exportTopicInfo,
            clearMessagesToTopic,
            setAutoScroll
        } = useActions();

        const colorAlignHorizontalCenterIcon = topicsAutoScroll.get(topic) ? 'secondary' : 'primary';

        return (
            <Box className='topic-card' sx={{ width: '100%', paddingTop: 8 }}>
                <Card sx={{ maxWidth: '100%', height: 600 }}>
                    <CardHeader
                        action={
                            <Stack direction="row">
                                <Tooltip title="Auto-Scroll" placement="top-start">
                                    <IconButton aria-label="Auto-Scroll"
                                                color={colorAlignHorizontalCenterIcon}  
                                                onClick={() => { 
                                                    setAutoScroll(topic, !topicsAutoScroll.get(topic))
                                                }}>
                                        <AlignHorizontalCenterIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Unsubscribe" placement="top-start">
                                    <IconButton aria-label="unsubscribe"
                                                color="primary"  
                                                onClick={() => { 
                                                    unsubscribeTopic(connection.id, topic)
                                                }}>
                                        <Unsubscribe />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Create Publisher" placement="top-start">
                                    <div>
                                        <IconButton aria-label="Create Publisher"
                                                    color="primary"
                                                    disabled={connection.topics.get(topic)?.isGlobal}
                                                    onClick={() => { 
                                                        changeMode(ApplicationMode.PUBLISHER_EDIT)
                                                    }}>
                                            <AddRoadIcon />
                                        </IconButton>
                                    </div>
                                </Tooltip>
                                <Tooltip title="Export" placement="top-start">
                                    <IconButton aria-label="Export"
                                                color="primary"  
                                                onClick={() => { 
                                                    exportTopicInfo(connection.id, topic, connection.topics.get(topic)?.messagesFromTopic)
                                                }}>
                                        <FileDownloadIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Clear Messages" placement="top-start">
                                    <IconButton aria-label="Clear Messages"
                                                color="primary"  
                                                onClick={() => { 
                                                    clearMessagesToTopic(connection.id, topic)
                                                }}>
                                        <DeleteSweepIcon />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        }
                        title={`Topic ${topic}`}
                    >
                    </CardHeader>
                    <CardContent>
                        <Stack spacing={2}>
                            {connection.topics.get(topic)?.isGlobal && <Stack>
                                <Divider />
                                <IgnoredTopicList mainTopic={topic}></IgnoredTopicList>
                            </Stack>}
                            <Divider />
                            <Stack>
                                <ListMessage messages={connection.topics.get(topic)?.messagesFromTopic} mainTopic={topic}></ListMessage>
                            </Stack>
                        </Stack>
                        
                    </CardContent>
                </Card>
            </Box>
        )
    };