import { IPublisherTemplate, IPublisher, IPublisherDB } from "src/interfaces/publisher";
import databasePublisher from '../../database/databasePublisher';

export class ManagerPublishers {
    publishers: Map<string, IPublisher>;

    constructor () {
        this.publishers = new Map();
    }
    
    createPublisher (publisher: IPublisherTemplate, connectionId: string) {
        databasePublisher.insert(publisher, newPublisher => {
            this.publishers.set(
                newPublisher._id,
                {
                    _id: newPublisher._id,
                    name: newPublisher.name,
                    interval: newPublisher.interval,
                    message: newPublisher.message,
                    topic: newPublisher.topic,
                    active: newPublisher.active,
                    connectionId
                }
            )
        });
    }

    updatePublisher (publisher: IPublisherDB) {
        databasePublisher.updateById(publisher)

        this.publishers.get(publisher._id).name = publisher.name;
        this.publishers.get(publisher._id).interval = publisher.interval;
        this.publishers.get(publisher._id).message = publisher.message;
        this.publishers.get(publisher._id).topic = publisher.topic;
        this.publishers.get(publisher._id).active = publisher.active;
        this.publishers.get(publisher._id).connectionId = publisher.connectionId;   
        
        if (this.publishers.get(publisher._id).active && this.publishers.get(publisher._id).intervalTimer !== undefined) {
            this.activePublisher(publisher);
        } else if (this.publishers.get(publisher._id).intervalTimer !== undefined) {
            this.deactivePublisher(publisher);
        }  
    }

    deletePublisher (publisherId: string, connectionId: string) {
        databasePublisher.removeById(publisherId);
    }

    activePublisher (publisher) {
        this.publishers.get(publisher._id).intervalTimer = setInterval(() => {
            // this.client.publish(this.configuredPublishers.get(publisherId).topic, this.configuredPublishers.get(publisherId).message);
        }, this.publishers.get(publisher._id).interval * 1000);
    }

    deactivePublisher (publisher) {
        clearInterval(this.publishers.get(publisher._id).intervalTimer);
        this.publishers.get(publisher._id).intervalTimer = undefined;
    }

    sendMessage (publisherId: string) {

    }
}