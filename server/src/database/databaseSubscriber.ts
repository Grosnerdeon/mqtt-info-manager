import { ISubscriberDB, ISubscriberTemplate } from "../interfaces/subscriber";

class DatabaseSubscriber {
    datastore;
    db;

    constructor () {
        this.datastore = require('nedb');
        this.db = new this.datastore({ filename: '../subscribers' });
        this.load();
    }

    load () {
        this.db.loadDatabase();
    }

    insert (subscriber: ISubscriberTemplate, callback) {
        this.db.insert(subscriber, callback);
    }

    getAll () {
        return new Promise(resolve => {
            this.db.find({}, (_, subscribers) => {
                resolve(subscribers);
            });
        });
    }
    
    updateById (subscriber: ISubscriberDB) {
        this.db.update({ _id: subscriber._id }, { $set: { 
            topic: subscriber.topic,
            isGlobalTopic: subscriber.isGlobalTopic,
            ignoredTopics: subscriber.ignoredTopics
        } });
    }

    removeById (id: string) {
        this.db.remove({ _id: id });
    }
}

export default new DatabaseSubscriber();