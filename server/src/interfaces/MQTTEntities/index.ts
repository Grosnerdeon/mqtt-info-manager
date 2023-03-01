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