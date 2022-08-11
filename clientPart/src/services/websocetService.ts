import { ApplicationEntity, ApplicationGlobalAction } from "../dtos/applicationDto";
import { connectionActionsType, IResponseConnection } from "../dtos/connectionsDto";
import { IMQTTMessage, IMQTTMessageREsponse } from "../dtos/MQTTEntities";
import { NotificationsActionsType, NotificationsType } from "../dtos/notificationsDto";
import { store } from "../stores";

export class WebSoceketService {
    socet: WebSocket;
    eventListener: Map<string, VoidFunction>

    constructor (url: string) {
        this.socet = new WebSocket(url);
        this.eventListener = new Map();
        this.socet.onmessage = event => {
            const data = JSON.parse(event.data);
            const actionEntity = `${data.action}_${data.entity}`;

            switch(actionEntity) {
                case `${ApplicationGlobalAction.CREATE}_${ApplicationEntity.CONNECTION}`: {
                    const responseConnection: IResponseConnection = data.payload;

                    store.dispatch({ 
                        type: connectionActionsType.CREATE_CONNECTION, 
                        loading: false,
                        error: null,
                        connection: {
                            id: responseConnection.id,
                            url: responseConnection.url,
                            port: responseConnection.port,
                            isOpen: responseConnection.isOpen,
                            topics: new Map(responseConnection.topics),
                            configuredPublishers: new Map(responseConnection.configuredPublishers)
                        }
                    });
                }
                break;
                case `${ApplicationGlobalAction.DELETE}_${ApplicationEntity.CONNECTION}`: {
                    const responseId: string = data.payload.id;

                    store.dispatch({ 
                        type: connectionActionsType.DELETE_CONNECTION, 
                        loading: false,
                        error: null,
                        id: responseId
                    });
                }
                break;
                case `${ApplicationGlobalAction.UPDATE}_${ApplicationEntity.CONNECTION}`: {
                    const responseConnection: IResponseConnection = data.payload;

                    store.dispatch({ 
                        type: connectionActionsType.UPDATE_CONNECTION,
                        loading: false,
                        error: null,
                        connection: {
                            id: responseConnection.id,
                            url: responseConnection.url,
                            port: responseConnection.port,
                            isOpen: responseConnection.isOpen,
                            topics: new Map(responseConnection.topics),
                            configuredPublishers: new Map(responseConnection.configuredPublishers)
                        }
                    });
                }
                break;
                case `${ApplicationGlobalAction.CREATE}_${ApplicationEntity.TOPIC}`: {
                    const responseTopic: string = data.payload.topic;
                    const responseIsGlobal: boolean = data.payload.isGlobal;
                    const responseConnectionId: string = data.payload.connectionId;

                    store.dispatch({
                        type: connectionActionsType.SUBSCRIBE_TOPIC,
                        loading: false,
                        error: null,
                        connectionId: responseConnectionId,
                        topic: responseTopic,
                        isGlobal: responseIsGlobal
                    });
                }
                break;
                case `${ApplicationGlobalAction.UPDATE}_${ApplicationEntity.TOPIC}`: {
                    const responseTopic: string = data.payload.topic;
                    const responseConnectionId: string = data.payload.connectionId;
                    const responseMessagesFromTopic: IMQTTMessage[] = data.payload.messagesFromTopic;

                    if (responseMessagesFromTopic && responseMessagesFromTopic.length === 0) {
                        store.dispatch({
                            type: connectionActionsType.CLEAR_MESSAGES_TO_TOPIC,
                            loading: false,
                            error: null,
                            connectionId: responseConnectionId,
                            topic: responseTopic
                        });
                    }
                }
                break;
                case `${ApplicationGlobalAction.DELETE}_${ApplicationEntity.IGNORED_TOPIC_TO_TOPIC}`: {
                    const responseTopic: string = data.payload.topic;
                    const responseConnectionId: string = data.payload.connectionId;
                    const responseIgnoredTopic: string = data.payload.ignoredTopic

                    if (responseIgnoredTopic) {
                        store.dispatch({
                            type: connectionActionsType.DELETE_IGNORED_TOPIC_TO_TOPIC,
                            loading: false,
                            error: null,
                            connectionId: responseConnectionId,
                            ignoredTopic: responseIgnoredTopic,
                            topic: responseTopic
                        });
                    }
                }
                break;
                case `${ApplicationGlobalAction.CREATE}_${ApplicationEntity.IGNORED_TOPIC_TO_TOPIC}`: {
                    const responseTopic: string = data.payload.topic;
                    const responseConnectionId: string = data.payload.connectionId;
                    const responseMessagesFromTopic: IMQTTMessage[] = data.payload.messagesFromTopic;
                    const responseIgnoredTopic: string =  data.payload.ignoredTopic

                    if (responseIgnoredTopic && responseMessagesFromTopic) {
                        store.dispatch({
                            type: connectionActionsType.ADD_IGNORED_TOPIC_TO_TOPIC,
                            loading: true,
                            error: null,
                            connectionId: responseConnectionId,
                            topic: responseTopic,
                            ignoredTopic: responseIgnoredTopic,
                            messagesFromTopic: []
                        });

                        store.dispatch({
                            type: connectionActionsType.ADD_IGNORED_TOPIC_TO_TOPIC,
                            loading: false,
                            error: null,
                            connectionId: responseConnectionId,
                            topic: responseTopic,
                            ignoredTopic: responseIgnoredTopic,
                            messagesFromTopic: responseMessagesFromTopic
                        });
                    }
                }
                break;
                case `${ApplicationGlobalAction.DELETE}_${ApplicationEntity.TOPIC}`: {
                    const responseTopic: string = data.payload.topic;
                    const responseConnectionId: string = data.payload.connectionId;

                    store.dispatch({
                        type: connectionActionsType.UNSUBSCRIBE_TOPIC,
                        loading: false,
                        error: null,
                        connectionId: responseConnectionId,
                        topic: responseTopic
                    });
                }
                break;
                case `${ApplicationGlobalAction.CREATE}_${ApplicationEntity.PUBLISHER}`: {
                    const responseTopic: string = data.payload.topic;
                    const responseConnectionId: string = data.payload.connectionId;
                    const responseMessage: string = data.payload.message;
                    const responseInterval: number = data.payload.interval;
                    const responsePublisherId: string = data.payload.publisherId;
                    const responseActive: boolean = data.payload.active;

                    store.dispatch({
                        type: connectionActionsType.CREATE_PUBLISHER,
                        loading: false,
                        error: null,
                        connectionId: responseConnectionId,
                        topic: responseTopic,
                        interval: responseInterval,
                        message: responseMessage,
                        publisherId: responsePublisherId,
                        active: responseActive
                    });
                }
                break;
                case `${ApplicationGlobalAction.UPDATE}_${ApplicationEntity.PUBLISHER}`: {
                    const responseTopic: string = data.payload.topic;
                    const responseConnectionId: string = data.payload.connectionId;
                    const responseMessage: string = data.payload.message;
                    const responseInterval: number = data.payload.interval;
                    const responsePublisherId: string = data.payload.publisherId;
                    const responseActive: boolean = data.payload.active;

                    store.dispatch({
                        type: connectionActionsType.UPDATE_PUBLISHER,
                        loading: false,
                        error: null,
                        connectionId: responseConnectionId,
                        topic: responseTopic,
                        interval: responseInterval,
                        message: responseMessage,
                        publisherId: responsePublisherId,
                        active: responseActive
                    });
                }
                break;
                case `${ApplicationGlobalAction.DELETE}_${ApplicationEntity.PUBLISHER}`: {
                    const responsePublisherId: string = data.payload.publisherId;
                    const responseConnectionId: string = data.payload.connectionId;

                    store.dispatch({
                        type: connectionActionsType.DELETE_PUBLISHER,
                        loading: false,
                        error: null,
                        connectionId: responseConnectionId,
                        publisherId: responsePublisherId
                    });
                }
                break;
                case `${ApplicationGlobalAction.CREATE}_${ApplicationEntity.MQTT_MESSAGE}`: {
                    const mqttMessages: IMQTTMessageREsponse[] = data.payload;

                    mqttMessages.forEach(mqttMessage => {
                        store.dispatch({
                            type: connectionActionsType.SET_MQTT_MESSAGE,
                            loading: false,
                            error: null,
                            connectionId: mqttMessage.connectionId,
                            topic: mqttMessage.topic,
                            mqttMessage: mqttMessage.mqttMessage
                        });
                    });
                }
                break;
                case `${ApplicationGlobalAction.DELETE}_${ApplicationEntity.MQTT_MESSAGE}`: {
                    const mqttMessages: IMQTTMessageREsponse[] = data.payload;

                    mqttMessages.forEach(mqttMessage => {
                        store.dispatch({
                            type: connectionActionsType.DELETE_MQTT_MESSAGE,
                            loading: false,
                            error: null,
                            connectionId: mqttMessage.connectionId,
                            topic: mqttMessage.topic,
                            mqttMessage: mqttMessage.mqttMessage
                        });
                    });

                    
                }
                break;
            }

            switch (data.entity) {
                case ApplicationEntity.NOTIFICATION: {
                    const message: string = data.payload.message;
                    const typeNotification: NotificationsType = data.payload.type;

                    store.dispatch({ 
                        type: NotificationsActionsType.SHOW_NOTIFICATION,
                        notificationType: typeNotification, 
                        payload: message
                    });
                }
                break;
            }
        }
    }
}