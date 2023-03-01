import express, { request } from 'express'
import application from '../../application';
import { Connection } from '../../application/connection';
import { connectionAction } from '../../interfaces/connection';
import { circularJSON } from '../../modules/utilityMethods';
import databaseConnections from '../../database/databaseConnection';

const connectionsRouter = express.Router();

connectionsRouter.get('/all', async (_, response) => {
    if (application.connections.size === 0) {
        const connections: any = await databaseConnections.getAll();

        connections.forEach(connection => {
            application.connections.set(connection._id, 
                new Connection(
                    connection.url, 
                    connection.port, 
                    connection.topics, 
                    connection.isOpen, 
                    connection.configuredPublishers, 
                    connection.globalTopics, 
                    connection._id,
                    true
                ));
        });
    }

    const allConnections = [...application.connections.values()]
        .map((connection: Connection) => ({
            id: connection.id,
            url: connection.url,
            port: connection.port,
            isOpen: connection.isOpen,
            topics: [...connection.topics.entries()],
            configuredPublishers: [...connection.configuredPublishers.entries()]
        }));
 
    response.statusCode = 200;    
    response.send(circularJSON.stringify(allConnections));
});

connectionsRouter.get('/:id', (request, response) => {
    const { id } = request.params;
    const connection = application.connections.get(id);

    response.statusCode = 200; 
    response.send(circularJSON.stringify({
        id: connection.id,
        url: connection.url,
        port: connection.port,
        isOpen: connection.isOpen,
        topics: [...connection.topics.entries()],
        configuredPublishers: [...connection.configuredPublishers.entries()]
    }));
});

connectionsRouter.post('/create', (request, response) => {
    try {
        const { url, port } = request.body;

        const id = application.createConnection(url, port);
        const connection = application.connections.get(id);

        databaseConnections.insert({
            url: connection.url,
            port: connection.port,
            configuredPublishers: [...connection.configuredPublishers.values()],
            topics: [...connection.topics.values()].map(topic => ({
                instanceName: topic.instanceName,
                isGlobal: topic.isGlobal,
                messagesFromTopic: [],
                ignoredTopics: topic.ignoredTopics
            })),
            globalTopics: [...connection.globalTopics.values()],
            isOpen: connection.isOpen
        }, (err, newCon) => {
            application.connections.delete(id);

            application.connections.set(newCon.id, new Connection(newCon.url, newCon.port, 
                newCon.topics, 
                newCon.isOpen, 
                newCon.configuredPublishers, 
                newCon.globalTopics, 
                newCon._id,
                true))
        });

        response.statusCode = 200;
        response.send();  
    } catch (error) {
        response.statusCode = 422;
        response.send({ message: error });
    }
});

connectionsRouter.delete('/:id', (request, response) => {
    const { id } = request.params;

    application.deleteConnection(id);

    databaseConnections.removeById(id);

    response.statusCode = 200;
    response.send();
});

connectionsRouter.put('/:id/action', (request, response) => {
    const { id } = request.params;
    const { 
        action, 
        topic, 
        interval, 
        message, 
        publisherId, 
        ignoredTopic 
    } = request.body;
    const connection = application.connections.get(id);

    switch (action) {
        case connectionAction.OPEN_CONNECTION:
            connection.openConnection();
            break;
        case connectionAction.CLOSE_CONNECTION:
            connection.closeConnection();
            break;
        case connectionAction.SUBSCRIBE_TOPIC:
            connection.subscribeTopic(topic);
            break;
        case connectionAction.UNSUBSCRIBE_TOPIC:
            connection.unsubscribe(topic);
            break;
        case connectionAction.CREATE_PUBLISHER:
            connection.createPublisher(topic, interval, message);
            break;
        case connectionAction.UPDATE_PUBLISHER:
            connection.updatePublisher(topic, interval, message, publisherId);
            break;
        case connectionAction.DELETE_PUBLISHER:
            connection.deletePublisher(publisherId);
            break;
        case connectionAction.ADD_IGNORED_TOPIC_TO_TOPIC:
            connection.addIgnoredTopicToTopic(topic, ignoredTopic);
            break;
        case connectionAction.DELETE_IGNORED_TOPIC_TO_TOPIC:
            connection.deleteIgnoredTopicToTopic(topic, ignoredTopic);
            break;
        case connectionAction.CLEAR_MESSAGES_TO_TOPIC:
            connection.clearMessagesToTopic(topic);
            break;
        case connectionAction.START_PUBLISHER:
            connection.startPublisher(publisherId);
            break;
        case connectionAction.STOP_PUBLISHER:
            connection.stopPublisher(publisherId);
            break;
        case connectionAction.SEND_PUBLISHER:
            connection.sendPublisher(publisherId);
            break;              
        default:
            break;
    }

    response.statusCode = 200;
    response.send();
});

export default connectionsRouter;