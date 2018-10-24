const appRoot = require('app-root-path');
const io = require('socket.io-client');

const logger = require(`${appRoot}/src/config/logger`);


// TODO: IMPLEMENT TEST
describe('Suite for testing SocketIO connections', ()  => {

    function startServer() {
        const server = require(`${appRoot}/src/index.js`);
    }

    function getSocketClient() {
        return io('http://localhost');
    }
});
