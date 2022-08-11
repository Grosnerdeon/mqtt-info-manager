import { applicationAction, applicationEntity } from "../interfaces/application";
import websocetManager from "../websocetManager";
import { Connection } from "./connection";
import verification from "../modules/verification";
import { REGEXP_PORT, REGEXP_URL } from "../interfaces/connections";

class Application {
    connections: Map<string, Connection>

    constructor () {
        this.connections = new Map();
    }

    createConnection (url: string, port: number) {
        const verificationUrl = verification.verifyStringWithRegExp(
            new RegExp(REGEXP_URL),
            url,
            `${url} - Incorrect url.`
        );

        const verificationPort = verification.verifyStringWithRegExp(
            new RegExp(REGEXP_PORT),
            `${port}`,
            `${port} - Incorrect port.`
        );

        const verificationForDuplicates = verification.verifyForDuplicates(
            [...this.connections.values()]
                .map((connection: Connection) => (`${connection.url}:${connection.port}`)),
            `${url}:${port}`,
            `Connection ${url}:${port} already exist.`
        )
        
        if (verificationUrl.error) {
            throw(verificationUrl.error);
        }

        if (verificationPort.error) {
            throw(verificationPort.error);
        }

        if (verificationForDuplicates.error) {
            throw(verificationForDuplicates.error);
        }

        const newConnection = new Connection(url, port);

        this.connections.set(newConnection.id, newConnection);

        websocetManager.sendMessageAllClients({
            entity: applicationEntity.CONNECTION,
            action: applicationAction.CREATE,
            payload: {
                id: newConnection.id,
                url: newConnection.url,
                port: newConnection.port,
                isOpen: newConnection.isOpen,
                topics: [...newConnection.topics.entries()],
                configuredPublishers: [...newConnection.configuredPublishers.entries()]
            }
        });
    }

    deleteConnection (connectionId: string) {
        if (this.connections.has(connectionId)) {
            this.connections.get(connectionId).deleteAllPublisher();

            this.connections.delete(connectionId);

            websocetManager.sendMessageAllClients({
                entity: applicationEntity.CONNECTION,
                action: applicationAction.DELETE,
                payload: {
                    id: connectionId
                }
            });
        }
    }
}

export default new Application();