import * as express from 'express';
import { ClusterConfig } from './cluster';
const port = 3001;
const app: express.Application = require('./app/app');
import { socketInit } from './app/config/socket';

const clusterConfig = new ClusterConfig();

clusterConfig.initaliseCLuster(false, (isReady: boolean) => {
    const server = app.listen(port, () => {
        console.log("Node app is running at localhost:" + port);
    });
    socketInit(server);
});
