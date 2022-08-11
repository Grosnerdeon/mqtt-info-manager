import React, { FunctionComponent, useEffect } from 'react';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { TopicCard } from './topicCard';

export const ConnectionMainPage: FunctionComponent =
    () => {
        const { getConnection } = useActions();
        const { connection: mainConnection } = useTypedSelector(state => state.application);
        const { connection } = useTypedSelector(state => state.connection);

        useEffect(() => {
            if (mainConnection) {
                getConnection(mainConnection?.id);
            }
        }, []);

        return (
            <div>
                {connection && !!connection.topics.size && <div>
                    {[...connection.topics.entries()].map(([topic]) => 
                        <TopicCard topic={topic} key={topic}></TopicCard>)}    
                </div>}
            </div>
        )
    };