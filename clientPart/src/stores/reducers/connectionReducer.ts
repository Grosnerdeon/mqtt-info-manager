import { 
    connectionActionsType,
    connectionsAction,
    IConnectionState
} from "../../dtos/connectionsDto"

const initialState: IConnectionState = {
    connection: {
        id: '',
        url: '',
        port: 0,
        isOpen: false,
        topics: new Map(),
        configuredPublishers: new Map()
    },
    topicsAutoScroll: new Map(),
    loading: false,
    error: null
}

export const connectionReducer = (state = initialState, action: connectionsAction): IConnectionState => {
    switch (action.type) {
        case connectionActionsType.GET_CONNECTION: {
            if (action.connection) {
                return { ...state, loading: action.loading, error: action.error, connection: action.connection }  
            }
            
            return { ...state, loading: action.loading, error: action.error }  
        }  
        case connectionActionsType.SUBSCRIBE_TOPIC: {
            if (action.connectionId && action.topic && action.isGlobal !== undefined) {
                state.connection.topics.set(action.topic, {
                    instanceName: action.topic,
                    messagesFromTopic: [],
                    ignoredTopics: [],
                    isGlobal: action.isGlobal
                });
            }

            return { ...state, loading: action.loading, error: action.error }
        }
        case connectionActionsType.UNSUBSCRIBE_TOPIC: {
            if (action.connectionId && action.topic) {
                state.connection.topics.delete(action.topic);
            }

            return { ...state, loading: action.loading, error: action.error }
        }   
        case connectionActionsType.CREATE_PUBLISHER: {
            if (action.connectionId && action.topic && action.interval && action.message && action.publisherId && action.active !== undefined) {
                state.connection.configuredPublishers.set(action.publisherId, {
                    interval: action.interval,
                    message: action.message,
                    publisherId: action.publisherId,
                    connectionId: action.connectionId,
                    topic: action.topic,
                    active: action.active
                });
            }

            return { ...state, loading: action.loading, error: action.error }
        }
        case connectionActionsType.UPDATE_PUBLISHER: {
            if (action.connectionId && action.topic && action.interval && action.message && action.publisherId && action.active !== undefined) {
                state.connection.configuredPublishers.set(action.publisherId, {
                    interval: action.interval,
                    message: action.message,
                    publisherId: action.publisherId,
                    connectionId: action.connectionId,
                    topic: action.topic,
                    active: action.active
                });
            }

            return { ...state, loading: action.loading, error: action.error }
        }
        case connectionActionsType.DELETE_PUBLISHER: {
            if (action.connectionId && action.publisherId) {
                state.connection.configuredPublishers.delete(action.publisherId);
            }

            return { ...state, loading: action.loading, error: action.error }
        }
        case connectionActionsType.START_PUBLISHER: {
            if (action.connectionId && action.topic && action.interval && action.message && action.publisherId && action.active !== undefined) {
                state.connection.configuredPublishers.set(action.publisherId, {
                    interval: action.interval,
                    message: action.message,
                    publisherId: action.publisherId,
                    connectionId: action.connectionId,
                    topic: action.topic,
                    active: action.active
                });
            }

            return { ...state, loading: action.loading, error: action.error }
        }
        case connectionActionsType.STOP_PUBLISHER: {
            if (action.connectionId && action.topic && action.interval && action.message && action.publisherId && action.active !== undefined) {
                state.connection.configuredPublishers.set(action.publisherId, {
                    interval: action.interval,
                    message: action.message,
                    publisherId: action.publisherId,
                    connectionId: action.connectionId,
                    topic: action.topic,
                    active: action.active
                });
            }

            return { ...state, loading: action.loading, error: action.error }
        }
        case connectionActionsType.SEND_PUBLISHER: {
            if (action.connectionId && action.topic && action.interval && action.message && action.publisherId && action.active !== undefined) {
                state.connection.configuredPublishers.set(action.publisherId, {
                    interval: action.interval,
                    message: action.message,
                    publisherId: action.publisherId,
                    connectionId: action.connectionId,
                    topic: action.topic,
                    active: action.active
                });
            }

            return { ...state, loading: action.loading, error: action.error }
        }
        case connectionActionsType.SET_MQTT_MESSAGE: {
            if (action.connectionId && action.mqttMessage && action.topic && state.connection.topics.has(action.topic)) {
                state.connection.topics.get(action.topic)?.messagesFromTopic.push(action.mqttMessage);
            }

            return { ...state, loading: action.loading, error: action.error }
        }
        case connectionActionsType.DELETE_MQTT_MESSAGE: {
            if (action.connectionId && action.mqttMessage && action.topic && state.connection.topics.has(action.topic)) {
                state.connection.topics.get(action.topic)?.messagesFromTopic.shift();
            }

            return { ...state, loading: action.loading, error: action.error }
        }
        case connectionActionsType.EXPORT_TOPIC_INFO: {
            return { ...state, loading: action.loading, error: action.error }
        }
        case connectionActionsType.ADD_IGNORED_TOPIC_TO_TOPIC: {
            if (action.connectionId && action.topic && action.ignoredTopic && action.messagesFromTopic) {
                if (!action.loading) {
                    state.connection.topics.get(action.topic)?.ignoredTopics.push(action.ignoredTopic);
                }

                state.connection.topics.get(action.topic)!.messagesFromTopic = action.messagesFromTopic;
            }

            return { ...state, loading: action.loading, error: action.error }
        }
        case connectionActionsType.DELETE_IGNORED_TOPIC_TO_TOPIC: {
            if (action.connectionId && action.topic && action.ignoredTopic) {
                let indexFilter;

                state.connection.topics.get(action.topic)?.ignoredTopics.forEach((ignoredTopic, index) => {
                    if (ignoredTopic === action.ignoredTopic) {
                        indexFilter = index;
                    }
                });

                if (indexFilter !== undefined) {
                    state.connection.topics.get(action.topic)?.ignoredTopics.splice(indexFilter, 1);
                }
            }

            return { ...state, loading: action.loading, error: action.error }
        }
        case connectionActionsType.CLEAR_MESSAGES_TO_TOPIC: {
            if (action.connectionId && action.topic) {
                state.connection.topics.get(action.topic)!.messagesFromTopic.length = 0;
            }

            return { ...state, loading: action.loading, error: action.error }
        }
        case connectionActionsType.AUTO_SCROLL: {
            if (action.topic && action.state !== undefined) {
                state.topicsAutoScroll.set(action.topic, action.state);
            }

            return { ...state }
        } 
        default:
            return state;
    }
}