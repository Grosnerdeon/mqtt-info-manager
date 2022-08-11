import { ApplicationEntity, ApplicationGlobalAction } from "../../dtos/applicationDto";
import { connectionActionsType, IResponseConnection } from "../../dtos/connectionsDto";
import { IMQTTMessage } from "../../dtos/MQTTEntities";

class ConnectionService {
    getConnections (): Promise<IResponseConnection[]> {
        return new Promise((resolve) => {
            fetch(`/api/connections/all`).then((response: Response) => {
                const responseData: Promise<IResponseConnection[]> = response.json();

                resolve(responseData);
            });
        });
    }

    getConnetion (connectionId: string): Promise<IResponseConnection> {
        return new Promise((resolve) => {
            fetch(`/api/connections/${connectionId}`).then((response: Response) => {
                const responseData: Promise<IResponseConnection> = response.json();

                resolve(responseData);
            }); 
        });
    }

    createConnection (url: string, port: number): Promise<any> {
        return new Promise((resolve, reject) => {
            fetch(`/api/connections/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    url,
                    port
                })
            }).then((response: Response) => {
                if (response.status !== 200) {
                    const responseData = response.json();

                    reject(responseData)
                }
    
                resolve(`${ApplicationGlobalAction.CREATE}_${ApplicationEntity.CONNECTION}`);
            });
        });
    }

    deleteConnection (connectionId: string): Promise<any> {
        return new Promise((resolve) => {
            fetch(`/api/connections/${connectionId}`, {
                method: 'DELETE'
            }).then((response: Response) => {
                resolve(`${ApplicationGlobalAction.DELETE}_${ApplicationEntity.CONNECTION}`);
            });
        });
    }

    openConnection (connectionId: string): Promise<any> {
        return new Promise((resolve) => {
            fetch(`/api/connections/${connectionId}/action`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    action: connectionActionsType.OPEN_CONNECTION
                })
            }).then((response: Response) => {
                resolve(`${ApplicationGlobalAction.UPDATE}_${ApplicationEntity.CONNECTION}`);
            });
        });
    }

    closeConnection (connectionId: string): Promise<any> {
        return new Promise((resolve) => {
            fetch(`/api/connections/${connectionId}/action`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    action: connectionActionsType.CLOSE_CONNECTION
                })
            }).then((response: Response) => {
                resolve(`${ApplicationGlobalAction.UPDATE}_${ApplicationEntity.CONNECTION}`);
            });
        });
    }

    subscribeTopic (connectionId: string, topic: string): Promise<any> {
        return new Promise((resolve) => {
            fetch(`/api/connections/${connectionId}/action`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    action: connectionActionsType.SUBSCRIBE_TOPIC,
                    topic
                })
            }).then((response: Response) => {
                resolve(`${ApplicationGlobalAction.UPDATE}_${ApplicationEntity.CONNECTION}`);
            });
        });
    }

    unsubscribeTopic (connectionId: string, topic: string): Promise<any> {
        return new Promise((resolve) => {
            fetch(`/api/connections/${connectionId}/action`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    action: connectionActionsType.UNSUBSCRIBE_TOPIC,
                    topic
                })
            }).then((response: Response) => {
                resolve(`${ApplicationGlobalAction.UPDATE}_${ApplicationEntity.CONNECTION}`);
            });
        });
    }

    createPublisher (connectionId: string, topic: string, interval: number, message: string): Promise<any> {
        return new Promise((resolve) => {
            fetch(`/api/connections/${connectionId}/action`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    action: connectionActionsType.CREATE_PUBLISHER,
                    topic,
                    interval,
                    message
                })
            }).then((response: Response) => {
                resolve(`${ApplicationGlobalAction.UPDATE}_${ApplicationEntity.CONNECTION}`);
            });
        });
    }

    updatePublisher (connectionId: string, topic: string, interval: number, message: string, publisherId: string): Promise<any> {
        return new Promise((resolve) => {
            fetch(`/api/connections/${connectionId}/action`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    action: connectionActionsType.UPDATE_PUBLISHER,
                    topic,
                    interval,
                    message,
                    publisherId
                })
            }).then((response: Response) => {
                resolve(`${ApplicationGlobalAction.UPDATE}_${ApplicationEntity.CONNECTION}`);
            });
        });
    }

    startPublisher (connectionId: string, publisherId: string): Promise<any> {
        return new Promise((resolve) => {
            fetch(`/api/connections/${connectionId}/action`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    action: connectionActionsType.START_PUBLISHER,
                    publisherId
                })
            }).then((response: Response) => {
                resolve(`${ApplicationGlobalAction.UPDATE}_${ApplicationEntity.CONNECTION}`);
            });
        });
    }

    sendPublisher (connectionId: string, publisherId: string): Promise<any> {
        return new Promise((resolve) => {
            fetch(`/api/connections/${connectionId}/action`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    action: connectionActionsType.SEND_PUBLISHER,
                    publisherId
                })
            }).then((response: Response) => {
                resolve(`${ApplicationGlobalAction.UPDATE}_${ApplicationEntity.CONNECTION}`);
            });
        });
    }

    stopPublisher (connectionId: string, publisherId: string): Promise<any> {
        return new Promise((resolve) => {
            fetch(`/api/connections/${connectionId}/action`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    action: connectionActionsType.STOP_PUBLISHER,
                    publisherId
                })
            }).then((response: Response) => {
                resolve(`${ApplicationGlobalAction.UPDATE}_${ApplicationEntity.CONNECTION}`);
            });
        });
    }

    deletePublisher (connectionId: string, publisherId: string): Promise<any> {
        return new Promise((resolve) => {
            fetch(`/api/connections/${connectionId}/action`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    action: connectionActionsType.DELETE_PUBLISHER,
                    publisherId
                })
            }).then((response: Response) => {
                resolve(`${ApplicationGlobalAction.UPDATE}_${ApplicationEntity.CONNECTION}`);
            });
        });
    }

    exportTopicInfo (connectionId: string, topic: string, mqttMessages: IMQTTMessage[] | IMQTTMessage | undefined): string[] {
        const content: string[] = [];
        
        if (Array.isArray(mqttMessages)) {
            mqttMessages?.forEach((mqttMessage: IMQTTMessage) => {
                content.push(`=============================================================================================================\n`); 
                content.push(`Topic: ${mqttMessage.topic}\n`);
                content.push(`Time: ${new Date(mqttMessage.time).toLocaleString()}\n`);
                content.push(`QOS: ${mqttMessage.qos}\n`);
                content.push(`${typeof mqttMessage.message === 'object' ? JSON.stringify(mqttMessage.message, null, 2) : mqttMessage.message}\n`);
                content.push(`=============================================================================================================\n`); 
            });
        } else if (mqttMessages !== undefined) {
            content.push(`=============================================================================================================\n`); 
            content.push(`Topic: ${mqttMessages.topic}\n`);
            content.push(`Time: ${new Date(mqttMessages.time).toLocaleString()}\n`);
            content.push(`QOS: ${mqttMessages.qos}\n`);
            content.push(`${typeof mqttMessages.message === 'object' ? JSON.stringify(mqttMessages.message, null, 2) : mqttMessages.message}\n`);
            content.push(`=============================================================================================================\n`); 
        }

        return content;
    }

    addIgnoredTopicToTopic (connectionId: string, topic: string, ignoredTopic: string): Promise<any> {
        return new Promise((resolve) => {
            fetch(`/api/connections/${connectionId}/action`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    action: connectionActionsType.ADD_IGNORED_TOPIC_TO_TOPIC,
                    topic,
                    ignoredTopic
                })
            }).then((response: Response) => {
                resolve(`${ApplicationGlobalAction.UPDATE}_${ApplicationEntity.CONNECTION}`);
            });
        });
    }

    deleteIgnoredTopicToTopic (connectionId: string, topic: string, ignoredTopic: string): Promise<any> {
        return new Promise((resolve) => {
            fetch(`/api/connections/${connectionId}/action`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    action: connectionActionsType.DELETE_IGNORED_TOPIC_TO_TOPIC,
                    topic,
                    ignoredTopic
                })
            }).then((response: Response) => {
                resolve(`${ApplicationGlobalAction.UPDATE}_${ApplicationEntity.CONNECTION}`);
            });
        });
    }

    clearMessagesToTopic (connectionId: string, topic: string): Promise<any> {
        return new Promise((resolve) => {
            fetch(`/api/connections/${connectionId}/action`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    action: connectionActionsType.CLEAR_MESSAGES_TO_TOPIC,
                    topic
                })
            }).then((response: Response) => {
                resolve(`${ApplicationGlobalAction.UPDATE}_${ApplicationEntity.CONNECTION}`);
            });
        });
    }
}

export default new ConnectionService()