import { IPublisherDB, IPublisherTemplate } from "../interfaces/publisher";

class DatabasePublisher {
    datastore;
    db;

    constructor () {
        this.datastore = require('nedb');
        this.db = new this.datastore({ filename: '../publishers' });
        this.load();
    }

    load () {
        this.db.loadDatabase();
    }

    insert (publisher: IPublisherTemplate, callback) {
        this.db.insert(publisher, callback);
    }

    getAll () {
        return new Promise(resolve => {
            this.db.find({}, (_, publishers) => {
                resolve(publishers);
            });
        });
    }
    
    updateById (publisher: IPublisherDB) {
        this.db.update({ _id: publisher._id }, { $set: { 
            name: publisher.name,
            interval: publisher.interval,
            message: publisher.message,
            topic: publisher.topic,
            active: publisher.active
        } });
    }

    removeById (id: string) {
        this.db.remove({ _id: id });
    }
}

export default new DatabasePublisher();