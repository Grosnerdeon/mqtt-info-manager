import React, { FunctionComponent } from 'react';
import Skeleton from '@mui/material/Skeleton';
import { IConnection } from '../../dtos/connectionsDto';
import { ConnectionCard } from '../connections/connectionCard';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import './connectionList.css';

export const ConnectionList: FunctionComponent =
    () => {
        const { connections, loading } = useTypedSelector(state => state.connections);

        return (
            <div className='connection-list'>
                {!loading &&
                    [...connections.values()].map((connection: IConnection) =>
                        <ConnectionCard
                            key={connection.id}
                            connection={connection}>
                        </ConnectionCard>)}
                {loading &&
                    <div>
                        <Skeleton animation="wave" height={264} />
                        <Skeleton animation="wave" height={264} />
                        <Skeleton animation="wave" height={264} />
                    </div>
                }
            </div>
        )
    };