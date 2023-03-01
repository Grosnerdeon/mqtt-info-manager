import { IMQTTMessage } from "../MQTTEntities";

export const REGEXP_URL = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gm;
export const REGEXP_PORT = /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/gm;
export const REGEXP_FILTER_ANY_IN_TOPIC = /\/[+]/g;
export const REGEXP_GLOBAL_TOPIC = /[#]$/g;

export enum connectionAction {
    OPEN_CONNECTION = 'OPEN_CONNECTION',
    CLOSE_CONNECTION = 'CLOSE_CONNECTION',
    SUBSCRIBE_TOPIC = 'SUBSCRIBE_TOPIC',
    UNSUBSCRIBE_TOPIC = 'UNSUBSCRIBE_TOPIC',
    CREATE_PUBLISHER = 'CREATE_PUBLISHER',
    DELETE_PUBLISHER = 'DELETE_PUBLISHER',
    UPDATE_PUBLISHER = 'UPDATE_PUBLISHER',
    START_PUBLISHER = 'START_PUBLISHER',
    STOP_PUBLISHER = 'STOP_PUBLISHER',
    SEND_PUBLISHER = 'SEND_PUBLISHER',
    EXPORT_TOPIC_INFO = 'EXPORT_TOPIC_INFO',
    ADD_IGNORED_TOPIC_TO_TOPIC = 'ADD_IGNORED_TOPIC_TO_TOPIC',
    DELETE_IGNORED_TOPIC_TO_TOPIC = 'DELETE_IGNORED_TOPIC_TO_TOPIC',
    CLEAR_MESSAGES_TO_TOPIC = 'CLEAR_MESSAGES_TO_TOPIC'  
}

export interface ITopic {
    instanceName: string
    isGlobal: boolean
    messagesFromTopic: IMQTTMessage[]
    ignoredTopics: string[]
}
