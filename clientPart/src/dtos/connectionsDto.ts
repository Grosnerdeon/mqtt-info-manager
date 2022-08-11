import { IConfiguredPublisher, IMQTTMessage } from "./MQTTEntities";

export interface IResponseConnection {
    id: string
    url: string
    port: number
    isOpen: boolean
    topics: [string, ITopic][],
    configuredPublishers: [string, IConfiguredPublisher][]
}

export interface ITopic {
    instanceName: string
    isGlobal: boolean
    messagesFromTopic: IMQTTMessage[]
    ignoredTopics: string[]
}

export interface IConnection {
    url: string
    port: number
    id: string,
    isOpen: boolean,
    topics: Map<string, ITopic>;
    configuredPublishers: Map<string, IConfiguredPublisher>
}

export interface IConnectionTemplate {
    url: string
    port: number
}

export interface IConnectionsState {
    connections: Map<string, IConnection>
    loading: boolean
    error: null | string
}

export interface IConnectionState {
    connection: IConnection
    topicsAutoScroll: Map<string, boolean>
    loading: boolean
    error: null | string
}

export enum connectionActionsType {
    FETCH_CONNECTIONS = 'FETCH_CONNECTIONS',
    GET_CONNECTION = 'GET_CONNECTION',
    CREATE_CONNECTION = 'CREATE_CONNECTION',
    DELETE_CONNECTION = 'DELETE_CONNECTION',
    UPDATE_CONNECTION = 'UPDATE_CONNECTION',
    OPEN_CONNECTION = 'OPEN_CONNECTION',
    CLOSE_CONNECTION = 'CLOSE_CONNECTION',
    SUBSCRIBE_TOPIC = 'SUBSCRIBE_TOPIC',
    UNSUBSCRIBE_TOPIC = 'UNSUBSCRIBE_TOPIC',
    CREATE_PUBLISHER = 'CREATE_PUBLISHER',
    UPDATE_PUBLISHER = 'UPDATE_PUBLISHER',
    DELETE_PUBLISHER = 'DELETE_PUBLISHER',
    START_PUBLISHER = 'START_PUBLISHER',
    STOP_PUBLISHER = 'STOP_PUBLISHER',
    SEND_PUBLISHER = 'SEND_PUBLISHER',
    SET_MQTT_MESSAGE = 'SET_MQTT_MESSAGE',
    DELETE_MQTT_MESSAGE = 'DELETE_MQTT_MESSAGE',
    EXPORT_TOPIC_INFO = 'EXPORT_TOPIC_INFO',
    ADD_IGNORED_TOPIC_TO_TOPIC = 'ADD_IGNORED_TOPIC_TO_TOPIC',
    DELETE_IGNORED_TOPIC_TO_TOPIC = 'DELETE_IGNORED_TOPIC_TO_TOPIC',
    CLEAR_MESSAGES_TO_TOPIC = 'CLEAR_MESSAGES_TO_TOPIC',
    AUTO_SCROLL = 'AUTO_SCROLL' 
}

export interface IFetchConnections {
    type: connectionActionsType.FETCH_CONNECTIONS
    loading: boolean
    error: null | string
    connections?: Map<string, IConnection>
}

export interface IGetConnection {
    type: connectionActionsType.GET_CONNECTION
    loading: boolean
    error: null | string
    connection?: IConnection 
}

export interface ICreateConnection {
    type: connectionActionsType.CREATE_CONNECTION
    loading: boolean
    error: null | string
    connection?: IConnection
}

export interface IDeleteConnection {
    type: connectionActionsType.DELETE_CONNECTION,
    loading: boolean
    error: null | string,
    id?: string
}

export interface IUpdateConnection {
    type: connectionActionsType.UPDATE_CONNECTION
    loading: boolean
    error: null | string
    connection?: IConnection
}

export interface ICloseConnection {
    type: connectionActionsType.CLOSE_CONNECTION
    loading: boolean
    error: null | string
    id?: string
    isOpen?: boolean
}

export interface ISubscribeTopic {
    type: connectionActionsType.SUBSCRIBE_TOPIC
    loading: boolean
    error: null | string
    connectionId?: string
    topic?: string,
    isGlobal?: boolean
}

export interface IUnsubscribeTopic {
    type: connectionActionsType.UNSUBSCRIBE_TOPIC
    loading: boolean
    error: null | string
    connectionId?: string
    topic?: string
}

export interface IAddIgnoredTopicToTopic {
    type: connectionActionsType.ADD_IGNORED_TOPIC_TO_TOPIC
    loading: boolean
    error: null | string
    connectionId?: string
    topic?: string
    ignoredTopic?: string
    messagesFromTopic?: IMQTTMessage[]
}

export interface IDeleteIgnoredTopicToTopic {
    type: connectionActionsType.DELETE_IGNORED_TOPIC_TO_TOPIC
    loading: boolean
    error: null | string
    connectionId?: string
    topic?: string,
    ignoredTopic?: string
}

export interface IClearMessagesToTopic {
    type: connectionActionsType.CLEAR_MESSAGES_TO_TOPIC
    loading: boolean
    error: null | string
    connectionId?: string
    topic?: string,
    messagesFromTopic?: IMQTTMessage[]
}

export interface ICreatePublisher {
    type: connectionActionsType.CREATE_PUBLISHER
    loading: boolean
    error: null | string
    connectionId?: string
    topic?: string
    interval?: number
    message?: string
    publisherId?: string
    active?: boolean
}

export interface IDeletePublisher {
    type: connectionActionsType.DELETE_PUBLISHER
    loading: boolean
    error: null | string
    connectionId?: string
    publisherId?: string
}

export interface IStartPublisher {
    type: connectionActionsType.START_PUBLISHER
    loading: boolean
    error: null | string
    connectionId?: string
    topic?: string
    interval?: number
    message?: string
    publisherId?: string
    active?: boolean
}

export interface IUpdatePublisher {
    type: connectionActionsType.UPDATE_PUBLISHER
    loading: boolean
    error: null | string
    connectionId?: string
    topic?: string
    interval?: number
    message?: string
    publisherId?: string
    active?: boolean
}

export interface ISendPublisher {
    type: connectionActionsType.SEND_PUBLISHER
    loading: boolean
    error: null | string
    connectionId?: string
    topic?: string
    interval?: number
    message?: string
    publisherId?: string
    active?: boolean
}

export interface IStopPublisher {
    type: connectionActionsType.STOP_PUBLISHER
    loading: boolean
    error: null | string
    connectionId?: string
    topic?: string
    interval?: number
    message?: string
    publisherId?: string
    active?: boolean
}

export interface ISetMqttMessage {
    type: connectionActionsType.SET_MQTT_MESSAGE
    loading: boolean
    error: null | string
    connectionId?: string
    topic?: string
    mqttMessage?: IMQTTMessage 
}

export interface IDeleteMqttMessage {
    type: connectionActionsType.DELETE_MQTT_MESSAGE
    loading: boolean
    error: null | string
    connectionId?: string
    topic?: string
    mqttMessage?: IMQTTMessage 
}

export interface IExportTopicInfo {
    type: connectionActionsType.EXPORT_TOPIC_INFO
    loading: boolean
    error: null | string
}

export interface IAutoScroll {
    type: connectionActionsType.AUTO_SCROLL
    topic: string
    state: boolean
}

export type connectionsAction = IFetchConnections | 
                                ICreateConnection |
                                IDeleteConnection | 
                                IUpdateConnection |
                                ICloseConnection |
                                IGetConnection | 
                                ISubscribeTopic |
                                IUnsubscribeTopic | 
                                ICreatePublisher |
                                IUpdatePublisher |
                                IDeletePublisher |
                                IStartPublisher |
                                ISendPublisher |
                                IStopPublisher | 
                                ISetMqttMessage | 
                                IDeleteMqttMessage |
                                IExportTopicInfo | 
                                IAddIgnoredTopicToTopic |
                                IDeleteIgnoredTopicToTopic | 
                                IClearMessagesToTopic | 
                                IAutoScroll;