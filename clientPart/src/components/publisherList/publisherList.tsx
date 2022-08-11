import React, { FunctionComponent } from 'react';
import Stack from '@mui/material/Stack';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { IConfiguredPublisher } from '../../dtos/MQTTEntities';
import { PublisherCard } from '../publisherCard/publisherCard';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useActions } from '../../hooks/useActions';
import Divider from '@mui/material/Divider';

export const PublisherList: FunctionComponent =
    () => {
        const { connection } = useTypedSelector(state => state.connection);
        const { 
            changeMode
        } = useActions();

        return (
            <Stack spacing={2} justifyContent="space-between" style={{ height: '100%', padding: 8, minWidth: 600, position: 'relative' }}>
                <Stack>
                    <Typography align='center' variant='h4'>
                        Publishers
                    </Typography>
                </Stack>
                <Stack style={{ height: 'calc(100% - 144px)', marginTop: 64, position: 'absolute', overflow: 'auto', width: 'calc(100% - 8px)', borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>
                    {[...connection.configuredPublishers.values()].map((configuredPublisher: IConfiguredPublisher) => (<PublisherCard 
                        topic={configuredPublisher.topic}
                        interval={configuredPublisher.interval}
                        publisherId={configuredPublisher.publisherId}
                        message={configuredPublisher.message}
                        active={configuredPublisher.active}
                        key={configuredPublisher.publisherId}
                    ></PublisherCard>))}
                </Stack>
                <Stack spacing={2} justifyContent="space-between">
                    <Stack direction="row" justifyContent="center">
                        <Button
                            variant="contained"
                            onClick={() => {
                                changeMode();
                            }}>
                            Close
                        </Button>
                    </Stack>  
                </Stack>    
            </Stack>
        )
    };