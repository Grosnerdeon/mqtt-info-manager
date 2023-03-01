import { IMQTTMessage } from "../MQTTEntities"

export interface ISubscriberDB {
    _id: string
    topic: string
    isGlobalTopic: boolean
    ignoredTopics: string[]
    connectionId: string
}

export interface ISubscriber extends ISubscriberDB{
    MQTTMessages: IMQTTMessage[]
}

export interface ISubscriberTemplate {
    topic: string
    isGlobalTopic?: boolean
}