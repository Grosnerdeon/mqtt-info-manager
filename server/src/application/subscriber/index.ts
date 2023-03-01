import { REGEXP_FILTER_ANY_IN_TOPIC, REGEXP_GLOBAL_TOPIC } from "../../interfaces/connection";
import { ISubscriber, ISubscriberDB, ISubscriberTemplate } from "../../interfaces/subscriber";
import databaseSubscriber from '../../database/databaseSubscriber';

export class ManagerSubscribers {
    subscribers: Map<string, ISubscriber>;

    constructor () {
        this.subscribers = new Map();
    }

    createSubscriber (subscriber: ISubscriberTemplate, connectionId: string) {
        subscriber.isGlobalTopic = this.defineIsGlobalTopic(subscriber.topic);

        databaseSubscriber.insert(subscriber, newSubscriber => {
            this.subscribers.set(newSubscriber._id, {
                _id: newSubscriber._id,
                topic: newSubscriber.topic,
                isGlobalTopic: newSubscriber.isGlobalTopic,
                ignoredTopics: [],
                connectionId,
                MQTTMessages: []
            })
        })
    }

    updateSubscriber (subscriber: ISubscriberDB) {
        subscriber.isGlobalTopic = this.defineIsGlobalTopic(subscriber.topic);
        subscriber.ignoredTopics = [];

        databaseSubscriber.updateById(subscriber);

        this.subscribers.get(subscriber._id).topic = subscriber.topic;
        this.subscribers.get(subscriber._id).isGlobalTopic = subscriber.isGlobalTopic;
        this.subscribers.get(subscriber._id).ignoredTopics = subscriber.ignoredTopics;
        this.subscribers.get(subscriber._id).MQTTMessages = [];
    }

    deleteSubscriber () {

    }

    defineIsGlobalTopic (topic) {
        const regexpFilterAnyInTopic = new RegExp(REGEXP_FILTER_ANY_IN_TOPIC);
        const globalTopicRegExp = new RegExp(REGEXP_GLOBAL_TOPIC); 
        
        return globalTopicRegExp.test(topic) || regexpFilterAnyInTopic.test(topic)
    }
}