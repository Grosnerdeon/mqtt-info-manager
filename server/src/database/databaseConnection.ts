import { IConnectionDB, IConnectionTempalte } from "../interfaces/connection";

class DatabaseConnections {
    datastore;
    db;

    constructor () {
        this.datastore = require('nedb');
        this.db = new this.datastore({ filename: '../connections' });
        this.load();
    }

    load () {
        this.db.loadDatabase();
    }

    insert (connection: IConnectionTempalte, callback) {
        this.db.insert(connection, callback);
    }

    getAll () {
        return new Promise(resolve => {
            this.db.find({}, (_, connections) => {
                resolve(connections);
            });
        });
    }
    
    updateById (connection: IConnectionDB) {
        this.db.update({ _id: connection._id }, { $set: { 
            url: connection.url,
            port: connection.port,
            isOpen: connection.isOpen,
            subscriberIDs: connection.subscriberIDs,
            publisherIDs: connection.publisherIDs 
        } });    
    }

    removeById (id: string) {
        this.db.remove({ _id: id });
    }
}

export default new DatabaseConnections();