import { IConnection } from "./connectionsDto"
import { IConfiguredPublisher } from "./MQTTEntities"

export enum ApplicationEntity {
    NOTIFICATION = "NOTIFICATION",
    MQTT_MESSAGE = "MQTT_MESSAGE",
    CONNECTION = "CONNECTION",
    MESSAGE_FROM_TOPIC = "MESSAGE_FROM_TOPIC",
    TOPIC = "TOPIC",
    PUBLISHER = "PUBLISHER",
    IGNORED_TOPIC_TO_TOPIC = 'IGNORED_TOPIC_TO_TOPIC'
}

export enum ApplicationGlobalAction {
    CREATE = "CREATE",
    DELETE = "DELETE",
    UPDATE = "UPDATE"
}

export enum ApplicationPage {
    CONNECTIONS = "CONNECTIONS",
    CONNECTION = "CONNECTION" 
}

export enum ApplicationMode {
    CONNECTION_CREATE = "CONNECTION_CREATE",
    SUBSCRIBE = "SUBSCRIBE",
    PUBLISHER_EDIT = "PUBLISHER_EDIT",
    PUBLISHER_LIST = "PUBLISHER_LIST"  
}

export enum ApplicationActionsType {
    CHANGE_PAGE = "CHANGE_PAGE",
    CHANGE_MODE = "CHANGE_MODE" 
}

export interface IApplicationState {
    currentPage: ApplicationPage
    currentMode?: ApplicationMode 
    connection?: IConnection
    publisher?: IConfiguredPublisher
}

export interface IChangePageAction {
    type: ApplicationActionsType.CHANGE_PAGE
    page: ApplicationPage
    connection?: IConnection

}

export interface IChangeMode {
    type: ApplicationActionsType.CHANGE_MODE
    mode?: ApplicationMode
    publisher?: IConfiguredPublisher
}

export interface IError {
    message: string
}

export type ApplicationAction = 
IChangePageAction | 
IChangeMode;