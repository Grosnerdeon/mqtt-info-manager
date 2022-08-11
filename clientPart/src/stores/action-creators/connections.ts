import { Dispatch } from "react";
import { ApplicationActionsType, IError } from "../../dtos/applicationDto";
import { 
    connectionActionsType, 
    connectionsAction, 
    IConnection, 
    IResponseConnection,
    ITopic
} from "../../dtos/connectionsDto";
import { 
    IConfiguredPublisher, 
    IMQTTMessage 
} from "../../dtos/MQTTEntities";
import connectionService from "../../services/connections/connectionService";
import { store } from '../../stores'
import { saveAs } from 'file-saver';

interface IErrorMessage {
    message: string
}

export const fetchConnections = () => {
    return async (dispatch: Dispatch<connectionsAction>) => {
        try {
            dispatch({ 
                type: connectionActionsType.FETCH_CONNECTIONS,
                loading: true,
                error:  null 
            });
            const responseConnections: IResponseConnection[] = await connectionService.getConnections();

            let mapConnection: Map<string, IConnection> = new Map();

            if (responseConnections.length) {
                mapConnection = new Map(responseConnections
                    .map((responseConnection: IResponseConnection) => {
                        const mapTopics: Map<string, ITopic> = 
                            new Map(responseConnection.topics);
                        const mapConfiguredPublishers: Map<string, IConfiguredPublisher> = 
                            new Map(responseConnection.configuredPublishers);
                        
                        return [responseConnection.id, {
                            id: responseConnection.id,
                            isOpen: responseConnection.isOpen,
                            url: responseConnection.url,
                            port: responseConnection.port,
                            topics: mapTopics,
                            configuredPublishers: mapConfiguredPublishers
                        }]
                }));
            }
            dispatch({ 
                type: connectionActionsType.FETCH_CONNECTIONS,
                loading: false,
                error:  null,
                connections: mapConnection  
            });
        } catch (error) {
            dispatch({ 
                type: connectionActionsType.FETCH_CONNECTIONS,
                loading: false,
                error:  'Some Error Fetch Connections' 
            });
        } 
    }
}

export const getConnection = (connectionId: string) => {
    return async (dispatch: Dispatch<connectionsAction>) => {
        try {
            dispatch({
                type: connectionActionsType.GET_CONNECTION,
                loading: true,
                error: null
            });

            const responseConnection: IResponseConnection = await connectionService.getConnetion(connectionId);
            const connection: IConnection = {
                id: responseConnection.id,
                url: responseConnection.url,
                port: responseConnection.port,
                isOpen: responseConnection.isOpen,
                topics: new Map(responseConnection.topics),
                configuredPublishers: new Map(responseConnection.configuredPublishers)
            };
            
            dispatch({
                type: connectionActionsType.GET_CONNECTION,
                loading: false,
                error: null,
                connection
            });
        } catch (error) {
            
            dispatch({ 
                type: connectionActionsType.FETCH_CONNECTIONS,
                loading: false,
                error:  'Some Error Get Connection' 
            });
        }
    }
}

export const createConnection = (url: string, port: number) => {
    return async (dispatch: Dispatch<connectionsAction>) => {
        try {
            await connectionService.createConnection(url, port);
            
            store.dispatch({
                type: ApplicationActionsType.CHANGE_MODE,
                payload: undefined
            });
        } catch (error: IError | any) {
            const responseError: IError | any = await error;
            dispatch({ 
                type: connectionActionsType.CREATE_CONNECTION, 
                loading: false,
                error: responseError.message
            });
        }
    }
}

export const deleteConnection = (connectionId: string) => {
    return async (dispatch: Dispatch<connectionsAction>) => {
        try {
            await connectionService.deleteConnection(connectionId);
        } catch (error) {
            dispatch({ 
                type: connectionActionsType.DELETE_CONNECTION, 
                loading: false,
                error: 'Some Error Delete Connection'
            });
        }
    }
}

export const openConnection = (connectionId: string) => {
    return async (dispatch: Dispatch<connectionsAction>) => {
        try {
            await connectionService.openConnection(connectionId);
        } catch (error) {
            dispatch({ 
                type: connectionActionsType.UPDATE_CONNECTION, 
                loading: false,
                error: 'Some Error Open Connection'
            });
        }
    }
}

export const closeConnection = (connectionId: string) => {
    return async (dispatch: Dispatch<connectionsAction>) => {
        try {
            await connectionService.closeConnection(connectionId);
        } catch (error) {
            dispatch({ 
                type: connectionActionsType.UPDATE_CONNECTION, 
                loading: false,
                error: 'Some Error Close Connection'
            });
        }
    }
}

export const subscribeTopic = (connectionId: string, topic: string) => {
    return async (dispatch: Dispatch<connectionsAction>) => {
        try {
            dispatch({ 
                type: connectionActionsType.SUBSCRIBE_TOPIC, 
                loading: true,
                error: null
            });

            await connectionService.subscribeTopic(connectionId, topic);

            dispatch({ 
                type: connectionActionsType.SUBSCRIBE_TOPIC,
                loading: false,
                error: null 
            });

            store.dispatch({
                type: ApplicationActionsType.CHANGE_MODE,
                payload: undefined
            })
        } catch (error) {
            dispatch({ 
                type: connectionActionsType.SUBSCRIBE_TOPIC, 
                loading: false,
                error: 'Some Error Subscribe Topic'
            });
        }
    }
}

export const unsubscribeTopic = (connectionId: string, topic: string) => {
    return async (dispatch: Dispatch<connectionsAction>) => {
        try {
            dispatch({ 
                type: connectionActionsType.UNSUBSCRIBE_TOPIC, 
                loading: true,
                error: null
            });

            await connectionService.unsubscribeTopic(connectionId, topic);

            dispatch({ 
                type: connectionActionsType.UNSUBSCRIBE_TOPIC,
                loading: false,
                error: null 
            });
        } catch (error) {
            dispatch({ 
                type: connectionActionsType.UNSUBSCRIBE_TOPIC, 
                loading: false,
                error: 'Some Error Unsubscribe Topic'
            });
        }
    }
}

export const createPublisher = (connectionId: string, topic: string, interval: number, message: string) => {
    return async (dispatch: Dispatch<connectionsAction>) => {
        try {
            dispatch({ 
                type: connectionActionsType.CREATE_PUBLISHER, 
                loading: true,
                error: null
            });

            await connectionService.createPublisher(connectionId, topic, interval, message);

            dispatch({ 
                type: connectionActionsType.CREATE_PUBLISHER,
                loading: false,
                error: null 
            });

            store.dispatch({
                type: ApplicationActionsType.CHANGE_MODE
            })
        } catch (error) {
            dispatch({ 
                type: connectionActionsType.CREATE_PUBLISHER, 
                loading: false,
                error: 'Some Error Create Publisher'
            });
        }
    }
}

export const updatePublisher = (connectionId: string, topic: string, interval: number, message: string, publisherId: string) => {
    return async (dispatch: Dispatch<connectionsAction>) => {
        try {
            dispatch({ 
                type: connectionActionsType.UPDATE_PUBLISHER, 
                loading: true,
                error: null
            });

            await connectionService.updatePublisher(connectionId, topic, interval, message, publisherId);

            dispatch({ 
                type: connectionActionsType.UPDATE_PUBLISHER,
                loading: false,
                error: null 
            });

            store.dispatch({
                type: ApplicationActionsType.CHANGE_MODE,
                payload: undefined
            });

            store.dispatch({
                type: ApplicationActionsType.CHANGE_MODE,
                payload: undefined
            });
        } catch (error) {
            dispatch({ 
                type: connectionActionsType.UPDATE_PUBLISHER, 
                loading: false,
                error: 'Some Error Create Publisher'
            });
        }
    }
}

export const deletePublisher = (connectionId: string, publisherId: string) => {
    return async (dispatch: Dispatch<connectionsAction>) => {
        try {
            dispatch({ 
                type: connectionActionsType.DELETE_PUBLISHER, 
                loading: true,
                error: null
            });

            await connectionService.deletePublisher(connectionId, publisherId);

            dispatch({ 
                type: connectionActionsType.DELETE_PUBLISHER,
                loading: false,
                error: null 
            });
        } catch (error) {
            dispatch({ 
                type: connectionActionsType.DELETE_PUBLISHER, 
                loading: false,
                error: 'Some Error Delete Publisher'
            });
        }
    }
}

export const startPublisher = (connectionId: string, publisherId: string) => {
    return async (dispatch: Dispatch<connectionsAction>) => {
        try {
            dispatch({ 
                type: connectionActionsType.START_PUBLISHER, 
                loading: true,
                error: null
            });

            await connectionService.startPublisher(connectionId, publisherId);

            dispatch({ 
                type: connectionActionsType.START_PUBLISHER,
                loading: false,
                error: null 
            });
        } catch (error) {
            dispatch({ 
                type: connectionActionsType.START_PUBLISHER, 
                loading: false,
                error: 'Some Error Start Publisher'
            });
        }
    }
}

export const sendPublisher = (connectionId: string, publisherId: string) => {
    return async (dispatch: Dispatch<connectionsAction>) => {
        try {
            dispatch({ 
                type: connectionActionsType.SEND_PUBLISHER, 
                loading: true,
                error: null
            });

            await connectionService.sendPublisher(connectionId, publisherId);

            dispatch({ 
                type: connectionActionsType.SEND_PUBLISHER,
                loading: false,
                error: null 
            });
        } catch (error) {
            dispatch({ 
                type: connectionActionsType.SEND_PUBLISHER, 
                loading: false,
                error: 'Some Error Send Publisher'
            });
        }
    }
}

export const stopPublisher = (connectionId: string, publisherId: string) => {
    return async (dispatch: Dispatch<connectionsAction>) => {
        try {
            dispatch({ 
                type: connectionActionsType.STOP_PUBLISHER, 
                loading: true,
                error: null
            });

            await connectionService.stopPublisher(connectionId, publisherId);

            dispatch({ 
                type: connectionActionsType.STOP_PUBLISHER,
                loading: false,
                error: null 
            });
        } catch (error) {
            dispatch({ 
                type: connectionActionsType.STOP_PUBLISHER, 
                loading: false,
                error: 'Some Error Stop Publisher'
            });
        }
    }
}

export const exportTopicInfo = (connectionId: string, topic: string, mqttMessages: IMQTTMessage[] | IMQTTMessage | undefined) => {
    return async (dispatch: Dispatch<connectionsAction>) => {
        try {
            dispatch({ 
                type: connectionActionsType.EXPORT_TOPIC_INFO, 
                loading: true,
                error: null
            });

            const topicInfo = connectionService.exportTopicInfo(connectionId, topic, mqttMessages);
            
            saveAs(new Blob(topicInfo), `${topic}`)           
        } catch (error) {
            dispatch({ 
                type: connectionActionsType.EXPORT_TOPIC_INFO,
                loading: false,
                error: 'Export Topic Info'
            });
        }
    }
}

export const setAutoScroll = (topic: string, state: boolean) => {
    return async (dispatch: Dispatch<connectionsAction>) => {
        dispatch({ 
            type: connectionActionsType.AUTO_SCROLL,
            topic,
            state 
        });
    }
}

export const addIgnoredTopicToTopic = (connectionId: string, topic: string, ignoredTopic: string) => {
    return async (dispatch: Dispatch<connectionsAction>) => {
        try {
            dispatch({ 
                type: connectionActionsType.ADD_IGNORED_TOPIC_TO_TOPIC, 
                loading: true,
                error: null
            });

            await connectionService.addIgnoredTopicToTopic(connectionId, topic, ignoredTopic);

            dispatch({ 
                type: connectionActionsType.ADD_IGNORED_TOPIC_TO_TOPIC,
                loading: false,
                error: null 
            });
        } catch (error) {
            dispatch({ 
                type: connectionActionsType.ADD_IGNORED_TOPIC_TO_TOPIC, 
                loading: false,
                error: 'Some Error Add Filter to Topic'
            });
        }
    }
}

export const deleteIgnoredTopicToTopic = (connectionId: string, topic: string, ignoredTopic: string) => {
    return async (dispatch: Dispatch<connectionsAction>) => {
        try {
            dispatch({ 
                type: connectionActionsType.DELETE_IGNORED_TOPIC_TO_TOPIC, 
                loading: true,
                error: null
            });

            await connectionService.deleteIgnoredTopicToTopic(connectionId, topic, ignoredTopic);

            dispatch({ 
                type: connectionActionsType.DELETE_IGNORED_TOPIC_TO_TOPIC,
                loading: false,
                error: null 
            });
        } catch (error) {
            dispatch({ 
                type: connectionActionsType.DELETE_IGNORED_TOPIC_TO_TOPIC, 
                loading: false,
                error: 'Some Error Delete Filter to Topic'
            });
        }
    }
}

export const clearMessagesToTopic = (connectionId: string, topic: string) => {
    return async (dispatch: Dispatch<connectionsAction>) => {
        try {
            dispatch({ 
                type: connectionActionsType.CLEAR_MESSAGES_TO_TOPIC, 
                loading: true,
                error: null
            });

            await connectionService.clearMessagesToTopic(connectionId, topic);

            dispatch({ 
                type: connectionActionsType.CLEAR_MESSAGES_TO_TOPIC,
                loading: false,
                error: null 
            });
        } catch (error) {
            dispatch({ 
                type: connectionActionsType.CLEAR_MESSAGES_TO_TOPIC, 
                loading: false,
                error: 'Some Error Unsubscribe Topic'
            });
        }
    }
}

