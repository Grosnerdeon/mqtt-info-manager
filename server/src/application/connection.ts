import mqtt, { MqttClient } from "mqtt";
import { ITopic, REGEXP_FILTER_ANY_IN_TOPIC, REGEXP_GLOBAL_TOPIC } from "../interfaces/connection";
import { applicationAction, applicationEntity, MAX_COUNT_MESSAGE_FOR_EACH_TOPIC } from "../interfaces/application";
import { 
    clientReaction,
    clientStatus,
    IConfiguredPublisher, 
    IMQTTMessage 
} from "../interfaces/MQTTEntities";
import { typeNotification } from "../interfaces/notification";
import { defineIsJson, generateId } from "../modules/utilityMethods";
import websocetManager from "../websocetManager";

export class Connection {
    id: string;
    url: string;
    port: number;
    client: MqttClient;
    isOpen: boolean = false;
    topics: Map<string, ITopic>;
    configuredPublishers: Map<string, IConfiguredPublisher>;
    globalTopicRegExp: RegExp;
    globalTopics: Set<string>;

    constructor (url: string, port: number, topics?, isOpen?, configuredPublishers?, globalTopics?, id?, isDB?) {
        if (isDB) {
            this.id = id;
            this.url = url;
            this.port = port;
            this.isOpen = isOpen;
            this.topics = new Map();
            this.configuredPublishers = new Map();
            this.globalTopics = new Set();
            topics.forEach(topic => this.topics.set(topic.instanceName, topic));
            configuredPublishers.forEach(publisher => this.configuredPublishers.set(publisher.publisherId, publisher));
            globalTopics.forEach(topic => this.globalTopics.add(topic));

            if (this.isOpen) {
                this.openConnection();
            }
        } else {
            this.id = id || generateId();
            this.url = url;
            this.port = port;
            this.topics = new Map();
            this.configuredPublishers = new Map();
            this.globalTopicRegExp = new RegExp(REGEXP_GLOBAL_TOPIC);
    
            this.globalTopics = new Set();
        }
    }

    addListener (listenerName: string, callback: Function) {
        this.client.on(listenerName, callback);
    }

    initializeListeners () {
        this.addListener(
            clientStatus.CLOSE, 
            () => {
                this.respondToClose();
            }
        );

        this.addListener(
            clientStatus.END,
            () => {
                this.respondToEnd();
            }
        );

        this.addListener(
            clientStatus.DISCONNECT,
            () => {
                this.respondToDisconnect();
            }
        );

        this.addListener(
            clientStatus.OFFLINE,
            () => {
                this.respondToOffline();
            }
        );

        this.addListener(
            clientStatus.RECONNECT,
            () => {
                this.respondToReconnect();
            }
        );

        this.addListener(
            clientStatus.ERROR,
            () => {
                this.respondToError();
            }
        );

        this.addListener(
            clientStatus.CONNECT,
            () => {
                this.respondToConnect();
            }
        );

        this.addListener(
            clientReaction.MESSAGE,
            (topic, message, packet) => {
                this.reactForMessage(topic, message, packet);
            }
        );
    }

    respondToClose () {
        this.isOpen = false;

        websocetManager.sendMessageAllClients({
            entity: applicationEntity.NOTIFICATION,
            payload: {
                type: typeNotification.INFO,
                message: `Connection ${this.url}:${this.port} was closed`
            }
        });
    }

    respondToEnd () {
        this.isOpen = false;

        websocetManager.sendMessageAllClients({
            entity: applicationEntity.NOTIFICATION,
            payload: {
                type: typeNotification.WARNING,
                message: `Connection ${this.url}:${this.port} was end`
            }
        });

        websocetManager.sendMessageAllClients({
            entity: applicationEntity.CONNECTION,
            action: applicationAction.UPDATE,
            payload: {
                id: this.id,
                url: this.url,
                port: this.port,
                isOpen: this.isOpen,
                topics: [...this.topics.entries()],
                configuredPublishers: [...this.configuredPublishers.entries()]
            }
        });
    }

    respondToDisconnect () {
        this.isOpen = false;

        websocetManager.sendMessageAllClients({
            entity: applicationEntity.NOTIFICATION,
            payload: {
                type: typeNotification.WARNING,
                message: `Connection ${this.url}:${this.port} was disconnected`
            }
        });
    }

    respondToOffline () {
        websocetManager.sendMessageAllClients({
            entity: applicationEntity.NOTIFICATION,
            payload: {
                type: typeNotification.INFO,
                message: `Connection ${this.url}:${this.port} offline`
            }
        });
    }

    respondToReconnect () {
        websocetManager.sendMessageAllClients({
            entity: applicationEntity.NOTIFICATION,
            payload: {
                type: typeNotification.INFO,
                message: `Connection ${this.url}:${this.port} reconnect`
            }
        });
    }

    respondToError () {
        this.isOpen = false;
        this.client.end();

        websocetManager.sendMessageAllClients({
            entity: applicationEntity.NOTIFICATION,
            payload: {
                type: typeNotification.ERROR,
                message: `Some error during connection for Connection ${this.url}:${this.port}`
            }
        });
    }

    respondToConnect () {
        this.isOpen = true;

        this.client.subscribe('#');

        [...this.topics.values()].filter((topic: ITopic) => !topic.isGlobal).forEach((topic: ITopic) => this.client.subscribe(topic.instanceName));

        websocetManager.sendMessageAllClients({
            entity: applicationEntity.NOTIFICATION,
            payload: {
                type: typeNotification.INFO,
                message: `Connection ${this.url}:${this.port} was connected`
            }
        });

        websocetManager.sendMessageAllClients({
            entity: applicationEntity.CONNECTION,
            action: applicationAction.UPDATE,
            payload: {
                id: this.id,
                url: this.url,
                port: this.port,
                isOpen: this.isOpen,
                topics: [...this.topics.entries()],
                configuredPublishers: [...this.configuredPublishers.entries()]
            }
        });
    }

    reactForMessage (topic, message, packet) {
        const mqttMessage: IMQTTMessage = {
            topic,
            retain: packet.retain,
            qos: packet.qos,
            message: defineIsJson(message.toString()) ? 
                        JSON.parse(message.toString()) : message.toString(),
            time: new Date().toISOString()
        }

        if (this.topics.has(topic)) {
            this.addMessageAndSendSocet(topic, mqttMessage);
        }

        if (this.topics.has('#')) {
            if (this.topics.get('#').ignoredTopics.length) {
                const ignoredTopicsSet = new Set(this.topics.get('#').ignoredTopics);

                if (!ignoredTopicsSet.has(topic)) {
                    this.addMessageAndSendSocet('#', mqttMessage);
                }
            } else {
                this.addMessageAndSendSocet('#', mqttMessage);
            }
        }

        [...this.globalTopics.values()].forEach(globalTopic => {
            const regexpFilterAnyInTopic = new RegExp(REGEXP_FILTER_ANY_IN_TOPIC); 
            const globalTopicRegExp = new RegExp(REGEXP_GLOBAL_TOPIC);
            const verifyGlobalTopicRegExp = globalTopicRegExp.test(globalTopic);
            const verifyRegexpFilterAnyInTopic = regexpFilterAnyInTopic.test(globalTopic);
            const mqttMessage: IMQTTMessage = {
                topic,
                retain: packet.retain,
                qos: packet.qos,
                message: defineIsJson(message.toString()) ? 
                            JSON.parse(message.toString()) : message.toString(),
                time: new Date().toISOString()
            };

            if (!verifyGlobalTopicRegExp && verifyRegexpFilterAnyInTopic) {
                const { checked } = this.distributionOfMessageByTopic(globalTopic, topic)

                if (this.topics.get(globalTopic).ignoredTopics.length) {
                    const ignoredTopicsSet = new Set(this.topics.get(globalTopic).ignoredTopics);

                    if (!ignoredTopicsSet.has(topic)) {
                        if (checked) {
                            this.addMessageAndSendSocet(globalTopic, mqttMessage);
                        }
                    }
                } else {
                    if (checked) {
                        this.addMessageAndSendSocet(globalTopic, mqttMessage);
                    }
                }
            }

            if (verifyGlobalTopicRegExp && !verifyRegexpFilterAnyInTopic) {
                const [includeTopic] = globalTopic.split(globalTopicRegExp);

                const reqExpIncludeTopic = new RegExp(`^${includeTopic}`);
                
                if (reqExpIncludeTopic.test(topic)) {
                    if (this.topics.get(globalTopic).ignoredTopics.length) {
                        const ignoredTopicsSet = new Set(this.topics.get(globalTopic).ignoredTopics);
    
                        if (!ignoredTopicsSet.has(topic)) {
                            this.addMessageAndSendSocet(globalTopic, mqttMessage);
                        }
                    } else {
                        this.addMessageAndSendSocet(globalTopic, mqttMessage);
                    }
                    
                }
            }

            if (verifyGlobalTopicRegExp && verifyRegexpFilterAnyInTopic) {
                const topicSplitedArray = topic.split('/');
                const globalTopicSplitedArray = globalTopic.split('/');

                topicSplitedArray.length === globalTopicSplitedArray.length;
                const { topicCheck, checked } = this.distributionOfMessageByTopic(globalTopic.split('/#')[0], topicSplitedArray.join('/'))
                const [includeTopic] = globalTopic.split(globalTopicRegExp);
                const reqExpIncludeTopic = new RegExp(`^${topicCheck}`);

                if (reqExpIncludeTopic.test(topicCheck)) {
                    if (this.topics.get(globalTopic).ignoredTopics.length) {
                        const ignoredTopicsSet = new Set(this.topics.get(globalTopic).ignoredTopics);
    
                        if (!ignoredTopicsSet.has(topic)) {
                            if (checked) {
                                this.addMessageAndSendSocet(globalTopic, mqttMessage);
                            }
                        }
                    } else {
                        if (checked) {
                            this.addMessageAndSendSocet(globalTopic, mqttMessage);
                        }
                    }
                    
                }
            }
        });
    }

    distributionOfMessageByTopic (topicChecked, verificationTopic) {
        const levelsTopicChecked = topicChecked.split('/');
        const levelsTopicVerification = verificationTopic.split('/');
        const levelsTopicVerificationMap = new Map(levelsTopicVerification.map((value, index) => [index, value]));

        const topicCheck = levelsTopicChecked.map((value, index) => {
            if (value === '+') {
                return levelsTopicVerificationMap.get(index);
            }

            return value;
        }).join('/')

        return { topicCheck, checked: levelsTopicChecked.every((value, index) => value === '+' || levelsTopicVerificationMap.get(index) === value) }
    }

    addMessageAndSendSocet (topic: string, mqttMessage: IMQTTMessage) {
        if (this.topics.get(topic).messagesFromTopic.length > MAX_COUNT_MESSAGE_FOR_EACH_TOPIC) {
            this.topics.get(topic).messagesFromTopic.shift();

            websocetManager.sendMessageAllClients({
                entity: applicationEntity.MQTT_MESSAGE,
                action: applicationAction.DELETE,
                payload: {
                    connectionId: this.id,
                    topic: topic,
                    mqttMessage
                }
            })
        }

        this.topics.get(topic).messagesFromTopic.push(JSON.parse(JSON.stringify(mqttMessage)));

        websocetManager.sendMessageAllClients({
            entity: applicationEntity.MQTT_MESSAGE,
            action: applicationAction.CREATE,
            payload: {
                connectionId: this.id,
                topic: topic,
                mqttMessage
            }
        })

        /*websocetManager.sendMessageAllClients({
            entity: applicationEntity.CONNECTION,
            action: applicationAction.UPDATE,
            payload: {
                id: this.id,
                url: this.url,
                port: this.port,
                isOpen: this.isOpen,
                topics: [...this.topics.entries()],
                configuredPublishers: [...this.configuredPublishers.entries()]
            }
        });*/
    }

    addIgnoredTopicToTopic (topic: string, ignoredTopic: string) {
        if (this.topics.has(topic)) {
            const ignoredTopicsSet = new Set(this.topics.get(topic).ignoredTopics);

            ignoredTopicsSet.add(ignoredTopic);

            this.topics.get(topic).messagesFromTopic = this.topics.get(topic).messagesFromTopic.filter((message: IMQTTMessage) => message.topic !== ignoredTopic);

            this.topics.get(topic).ignoredTopics = [...ignoredTopicsSet.values()];

            websocetManager.sendMessageAllClients({
                entity: applicationEntity.IGNORED_TOPIC_TO_TOPIC,
                action: applicationAction.CREATE,
                payload: {
                    connectionId: this.id,
                    topic,
                    ignoredTopic: ignoredTopic,
                    messagesFromTopic: this.topics.get(topic).messagesFromTopic
                }
            });

            websocetManager.sendMessageAllClients({
                entity: applicationEntity.CONNECTION,
                action: applicationAction.UPDATE,
                payload: {
                    id: this.id,
                    url: this.url,
                    port: this.port,
                    isOpen: this.isOpen,
                    topics: [...this.topics.entries()],
                    configuredPublishers: [...this.configuredPublishers.entries()]
                }
            });
        }
    }

    deleteIgnoredTopicToTopic (topic: string, ignoredTopic: string) {
        if (this.topics.has(topic)) {
            const ignoredTopicsSet = new Set(this.topics.get(topic).ignoredTopics);

            ignoredTopicsSet.delete(ignoredTopic);

            this.topics.get(topic).ignoredTopics = [...ignoredTopicsSet.values()];

            websocetManager.sendMessageAllClients({
                entity: applicationEntity.IGNORED_TOPIC_TO_TOPIC,
                action: applicationAction.DELETE,
                payload: {
                    connectionId: this.id,
                    topic,
                    ignoredTopic: ignoredTopic
                }
            });
        }
    }

    clearMessagesToTopic (topic: string) {
        if (this.topics.has(topic)) {
            this.topics.get(topic).messagesFromTopic = [];

            websocetManager.sendMessageAllClients({
                entity: applicationEntity.TOPIC,
                action: applicationAction.UPDATE,
                payload: {
                    connectionId: this.id,
                    topic,
                    messagesFromTopic: this.topics.get(topic).messagesFromTopic
                }
            });

            websocetManager.sendMessageAllClients({
                entity: applicationEntity.CONNECTION,
                action: applicationAction.UPDATE,
                payload: {
                    id: this.id,
                    url: this.url,
                    port: this.port,
                    isOpen: this.isOpen,
                    topics: [...this.topics.entries()],
                    configuredPublishers: [...this.configuredPublishers.entries()]
                }
            });
        }
    }

    openConnection () {
        this.client = mqtt.connect(`mqtt://${this.url}:${this.port}`);

        this.initializeListeners();
    }

    closeConnection () {
        this.client.end();

        this.configuredPublishers.forEach((publisher: IConfiguredPublisher) => {
            this.stopPublisher(publisher.publisherId);
        });
    }

    subscribeTopic (topic: string) {
        let isGlobal = false;
        const regexpFilterAnyInTopic = new RegExp(REGEXP_FILTER_ANY_IN_TOPIC);
        const globalTopicRegExp = new RegExp(REGEXP_GLOBAL_TOPIC); 

        if (!(globalTopicRegExp.test(topic) || regexpFilterAnyInTopic.test(topic))) {
            this.client.subscribe(topic);
        } else {
            if (topic !== '#') {
                this.globalTopics.add(topic);
            }
            
            isGlobal = true;
        }

        this.topics.set(topic, {
            isGlobal,
            ignoredTopics: [],
            messagesFromTopic: [],
            instanceName: topic
        });

        websocetManager.sendMessageAllClients({
            entity: applicationEntity.TOPIC,
            action: applicationAction.CREATE,
            payload: {
                connectionId: this.id,
                topic,
                isGlobal
            }
        });

        websocetManager.sendMessageAllClients({
            entity: applicationEntity.CONNECTION,
            action: applicationAction.UPDATE,
            payload: {
                id: this.id,
                url: this.url,
                port: this.port,
                isOpen: this.isOpen,
                topics: [...this.topics.entries()],
                configuredPublishers: [...this.configuredPublishers.entries()]
            }
        });
    }

    unsubscribe (topic: string) {
        const globalTopicRegExp = new RegExp(REGEXP_GLOBAL_TOPIC);

        if (!globalTopicRegExp.test(topic)) {
            this.client.unsubscribe(topic);
        }

        this.topics.delete(topic);

        if (this.globalTopics.has(topic)) {
            this.globalTopics.delete(topic);
        }

        websocetManager.sendMessageAllClients({
            entity: applicationEntity.TOPIC,
            action: applicationAction.DELETE,
            payload: {
                connectionId: this.id,
                topic
            }
        });

        websocetManager.sendMessageAllClients({
            entity: applicationEntity.CONNECTION,
            action: applicationAction.UPDATE,
            payload: {
                id: this.id,
                url: this.url,
                port: this.port,
                isOpen: this.isOpen,
                topics: [...this.topics.entries()],
                configuredPublishers: [...this.configuredPublishers.entries()]
            }
        });
    }

    createPublisher (topic: string, interval: number = 1, message: string = '') {
        const publisherId = generateId();

        this.configuredPublishers.set(
            publisherId,
            {
                connectionId: this.id,
                publisherId,
                interval,
                message,
                topic,
                active: false 
            }
        );

        websocetManager.sendMessageAllClients({
            entity: applicationEntity.PUBLISHER,
            action: applicationAction.CREATE,
            payload: {
                connectionId: this.id,
                publisherId,
                interval,
                topic,
                message,
                active: false
            }
        });
    }

    updatePublisher (topic: string, interval: number = 1, message: string = '', publisherId: string) {
        this.stopPublisher(publisherId, false);

        this.configuredPublishers.set(
            publisherId,
            {
                connectionId: this.id,
                publisherId,
                interval,
                message,
                topic,
                active: false 
            }
        );

        websocetManager.sendMessageAllClients({
            entity: applicationEntity.PUBLISHER,
            action: applicationAction.UPDATE,
            payload: {
                connectionId: this.id,
                publisherId,
                interval,
                topic,
                message,
                active: false
            }
        });
    }

    startPublisher (publisherId: string) {
        if (this.configuredPublishers.has(publisherId)) {
            this.configuredPublishers.get(publisherId).intervalTimer = setInterval(() => {
                this.client.publish(this.configuredPublishers.get(publisherId).topic, this.configuredPublishers.get(publisherId).message);
            }, this.configuredPublishers.get(publisherId).interval * 1000);

            this.configuredPublishers.get(publisherId).active = true;

            websocetManager.sendMessageAllClients({
                entity: applicationEntity.PUBLISHER,
                action: applicationAction.UPDATE,
                payload: {
                    connectionId: this.id,
                    publisherId,
                    interval: this.configuredPublishers.get(publisherId).interval,
                    topic: this.configuredPublishers.get(publisherId).topic,
                    message: this.configuredPublishers.get(publisherId).message,
                    active: true
                }
            });
        }
    }

    sendPublisher (publisherId: string) {
        if (this.configuredPublishers.has(publisherId)) {
            this.client.publish(this.configuredPublishers.get(publisherId).topic, this.configuredPublishers.get(publisherId).message);
        }
    }

    stopPublisher (publisherId: string, sendWebsocet: boolean = true) {
        if (this.configuredPublishers.has(publisherId)) {
            clearInterval(this.configuredPublishers.get(publisherId).intervalTimer);

            this.configuredPublishers.get(publisherId).intervalTimer = undefined;
            
            this.configuredPublishers.get(publisherId).active = false;

            if (sendWebsocet) {
                websocetManager.sendMessageAllClients({
                    entity: applicationEntity.PUBLISHER,
                    action: applicationAction.UPDATE,
                    payload: {
                        connectionId: this.id,
                        publisherId,
                        interval: this.configuredPublishers.get(publisherId).interval,
                        topic: this.configuredPublishers.get(publisherId).topic,
                        message: this.configuredPublishers.get(publisherId).message,
                        active: false
                    }
                });
            }
        }
    }

    deletePublisher (publisherId: string) {
        if (this.configuredPublishers.has(publisherId)) {
            clearInterval(this.configuredPublishers.get(publisherId).intervalTimer);

            this.configuredPublishers.delete(publisherId)
        }

        websocetManager.sendMessageAllClients({
            entity: applicationEntity.PUBLISHER,
            action: applicationAction.DELETE,
            payload: {
                connectionId: this.id,
                publisherId
            }
        });
    }

    deleteAllPublisher () {
        this.configuredPublishers.forEach((publisher: IConfiguredPublisher) => {
            clearInterval(publisher.intervalTimer);
        });

        this.configuredPublishers.clear();

        websocetManager.sendMessageAllClients({
            entity: applicationEntity.PUBLISHER,
            action: applicationAction.DELETE,
            payload: {
                connectionId: this.id,
                isAll: true
            }
        });
    }
}
