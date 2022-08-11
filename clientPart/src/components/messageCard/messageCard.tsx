import React, { FunctionComponent, useEffect, useRef } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import { Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import Typography from '@mui/material/Typography';
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddRoadIcon from '@mui/icons-material/AddRoad';
import { ApplicationMode } from '../../dtos/applicationDto';

interface IMessageProps {
    topic: string
    message: any
    time: string
    qos: number
    retain: boolean,
    mainTopic: string,
    index: number,
    setRowHeight: any,
    rowHeights: any
    clearRowHeights: any
}

export const MessageCard: FunctionComponent<IMessageProps> =
    (props: IMessageProps) => {
        const { topic, message, time, qos, retain, mainTopic, setRowHeight, index, clearRowHeights } = props;
        const { connection } = useTypedSelector(state => state.connection);
        const {
            subscribeTopic,
            addIgnoredTopicToTopic,
            exportTopicInfo,
            changeMode
        } = useActions();

        const rowRef: React.RefObject<HTMLElement> = useRef(null);

        useEffect(() => {
            if (rowRef.current) {
              setRowHeight(index, rowRef.current.clientHeight);
            }
            // eslint-disable-next-line
          }, [rowRef]);
       
        return (
            <Box sx={{ width: '100%', paddingTop: 2 }} ref={rowRef}>
                <Card sx={{ maxWidth: '100%', margin: '16px' }}>
                    <CardHeader
                        action={
                            <Stack direction="row">
                                <Tooltip title="Subscribe for this topic" placement="top-start">
                                    <IconButton aria-label="Subscribe for this topic"
                                                color="primary"  
                                                onClick={() => {
                                                    subscribeTopic(connection.id, topic)
                                                }}>
                                        <SubtitlesIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Create Publisher" placement="top-start">
                                    <div>
                                        <IconButton aria-label="Create Publisher"
                                                    color="primary"
                                                    disabled={connection.topics.get(topic)?.isGlobal}
                                                    onClick={() => { 
                                                        changeMode(ApplicationMode.PUBLISHER_EDIT, {
                                                            publisherId: 'testPublisherId',
                                                            topic: topic,
                                                            interval: 1, 
                                                            message: '',
                                                            connectionId: connection.id,
                                                            active: false
                                                        })
                                                    }}>
                                            <AddRoadIcon />
                                        </IconButton>
                                    </div>
                                </Tooltip>
                                <Tooltip title="Export" placement="top-start">
                                    <IconButton aria-label="Export"
                                                color="primary"  
                                                onClick={() => { 
                                                    exportTopicInfo(connection.id, topic, {
                                                        topic,
                                                        message,
                                                        qos,
                                                        time,
                                                        retain
                                                    })
                                                }}>
                                        <FileDownloadIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Add Topic to Ignore" placement="top-start">
                                    <div>
                                        <IconButton aria-label="Add Topic to Ignore"
                                                    color="primary"
                                                    disabled={!connection.topics.get(mainTopic)?.isGlobal}  
                                                    onClick={() => {
                                                        clearRowHeights();
                                                        addIgnoredTopicToTopic(connection.id, mainTopic, topic);
                                                    }}>
                                            <FilterAltIcon />
                                        </IconButton>
                                    </div>
                                </Tooltip>
                            </Stack>
                        }
                        title={<Stack direction="row" justifyContent="space-between">
                            <Typography variant='h6'>{topic}</Typography>
                            <Typography fontStyle='italic' marginTop='4px' marginRight='24px'>{retain ? ' Retain' : ''}</Typography>
                        </Stack>}
                    >
                    </CardHeader>
                    <CardContent>
                        <Divider />
                        <Stack direction="row" justifyContent="space-around">
                            <Stack>
                                <Typography>
                                    Time: {new Date(time).toLocaleString()}
                                </Typography>
                                <Typography>
                                    QOS: {qos}
                                </Typography>
                            </Stack>
                            <Stack maxHeight={120} width="80%">
                                <Typography height="100%" whiteSpace='break-spaces' overflow='auto' style={{ background: 'rgba(0,0,0,0.5)'}} color='white'>
                                    {typeof message === 'object' ? JSON.stringify(message, null, 2) : message}
                                </Typography>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>
        )
    };