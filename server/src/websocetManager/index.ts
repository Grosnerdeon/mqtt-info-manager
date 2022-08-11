import { applicationAction, applicationEntity } from '../interfaces/application';
import { WebSocketServer, WebSocket }  from 'ws';
import { circularJSON } from '../modules/utilityMethods';

class WebsocetManager {
    websocetServer;
    setTimeoutObjForCreate;
    messagesStackForCreate;
    messagesStackForDelete;
    setTimeoutObjForDelete

    constructor() {
        this.websocetServer = new WebSocketServer({ port: 5001 });
        this.setTimeoutObjForCreate = undefined;
        this.setTimeoutObjForDelete = undefined;
        this.messagesStackForCreate = [];
        this.messagesStackForDelete = [];
    }

    sendMessageAllClients (message: any) {
        if (message.entity === applicationEntity.MQTT_MESSAGE && message.action === applicationAction.CREATE) {
            this.messagesStackForCreate.push(message.payload);

            this.createTimeoutObjForCreate();
        } else if (message.entity === applicationEntity.MQTT_MESSAGE && message.action === applicationAction.DELETE) {
            this.messagesStackForDelete.push(message.payload);

            this.createTimeoutObjForDelete();
        } else {
            this.websocetServer.clients.forEach((ws: WebSocket) => {
                ws.send(circularJSON.stringify(message));
            });
        }
        //
    }

    createTimeoutObjForDelete () {
        if (!this.setTimeoutObjForDelete) {
            this.setTimeoutObjForDelete = setTimeout(() => {
                this.websocetServer.clients.forEach((ws: WebSocket) => {
                    ws.send(circularJSON.stringify({
                        entity: applicationEntity.MQTT_MESSAGE,
                        action: applicationAction.DELETE,
                        payload: this.messagesStackForDelete
                    }));
                });
                
                this.messagesStackForDelete = [];
                clearTimeout(this.setTimeoutObjForDelete);
                this.setTimeoutObjForDelete = undefined;

                if (this.messagesStackForDelete.length > 0) {
                    this.createTimeoutObjForDelete()
                }
            }, 1000);
        }
    }

    createTimeoutObjForCreate () {
        if (!this.setTimeoutObjForCreate) {
            this.setTimeoutObjForCreate = setTimeout(() => {
                this.websocetServer.clients.forEach((ws: WebSocket) => {
                    ws.send(circularJSON.stringify({
                        entity: applicationEntity.MQTT_MESSAGE,
                        action: applicationAction.CREATE,
                        payload: this.messagesStackForCreate
                    }));
                });
                
                this.messagesStackForCreate = [];
                clearTimeout(this.setTimeoutObjForCreate);
                this.setTimeoutObjForCreate = undefined;

                if (this.messagesStackForCreate.length > 0) {
                    this.createTimeoutObjForCreate()
                }
            }, 1000);
        }
    }
}

export default new WebsocetManager();