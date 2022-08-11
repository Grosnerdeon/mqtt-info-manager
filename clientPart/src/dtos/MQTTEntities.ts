export enum clientStatus {
    CONNECT = 'connect',
    RECONNECT = 'reconnect',
    DISCONNECT = 'disconnect',
    OFFLINE = 'offline',
    CLOSE = 'close',
    ERROR = 'error',
    END = 'end'
}

export enum clientReaction {
    MESSAGE = 'message'
}

export interface IMQTTMessage {
    topic: string
    time: string
    qos: number
    retain: boolean
    message: any
}

export interface IMQTTMessageREsponse {
    topic: string
    connectionId: string
    mqttMessage: IMQTTMessage
}

export interface IConfiguredPublisher {
    connectionId: string
    publisherId: string
    interval: number
    message: string,
    topic: string,
    active: boolean
}