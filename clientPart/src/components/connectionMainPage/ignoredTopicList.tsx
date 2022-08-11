import React, { FunctionComponent } from 'react';
import Stack from '@mui/material/Stack';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import Typography from '@mui/material/Typography';
import { useActions } from '../../hooks/useActions';
import Chip from '@mui/material/Chip';
import './ignoredTopicList.css';

interface IgnoredTopicListProps {
    mainTopic: string
}

export const IgnoredTopicList: FunctionComponent<IgnoredTopicListProps> =
    (props: IgnoredTopicListProps) => {
        const { mainTopic } = props;
        const { connection } = useTypedSelector(state => state.connection);
        const {
            deleteIgnoredTopicToTopic 
        } = useActions();

        return (
            <Stack spacing={2} direction="column">
                <Stack>
                    <Typography variant='h6'>
                        Ignored Topics
                    </Typography>
                </Stack>
                <Stack className="ignored-topic-list" spacing={2}>
                    {connection.topics.get(mainTopic)?.ignoredTopics.map(ignoredTopic => <Chip key={ignoredTopic} label={ignoredTopic} onDelete={() => deleteIgnoredTopicToTopic(connection.id, mainTopic, ignoredTopic) } />)}
                </Stack>
            </Stack>
        )
    };