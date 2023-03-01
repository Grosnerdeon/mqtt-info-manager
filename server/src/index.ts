import express from 'express'
import * as bodyParser from 'body-parser';
import connectionsRouter from './routing/connections';
import databaseConnections from './database/databaseConnection';

const app = express();
const port = 5000;
var path = require('path');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static('../clientPart/dist'));
app.use('/api/connections', connectionsRouter);

app.get('*', (_, res) => res.sendFile(path.resolve('public', 'index.html')));

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});