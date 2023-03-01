export interface IPublisherDB {
    _id: string
    name: string
    interval: number
    message: string
    topic: string
    active: boolean
    connectionId: string
}

export interface IPublisher extends IPublisherDB {
    intervalTimer?: NodeJS.Timer
}

export interface IPublisherTemplate {
    name: string
    interval: number
    message: string
    topic: string
    active: boolean
}