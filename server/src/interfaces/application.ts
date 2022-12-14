export enum applicationEntity {
    NOTIFICATION = "NOTIFICATION",
    MQTT_MESSAGE = "MQTT_MESSAGE",
    CONNECTION = "CONNECTION",
    MESSAGE_FROM_TOPIC = "MESSAGE_FROM_TOPIC",
    TOPIC = "TOPIC",
    PUBLISHER = "PUBLISHER",
    IGNORED_TOPIC_TO_TOPIC = 'IGNORED_TOPIC_TO_TOPIC'
}

export enum applicationAction {
    CREATE = "CREATE",
    DELETE = "DELETE",
    UPDATE = "UPDATE"
}

export const MAX_COUNT_MESSAGE_FOR_EACH_TOPIC = 10000;