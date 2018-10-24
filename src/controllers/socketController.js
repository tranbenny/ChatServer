const appRoot = require('app-root-path');

const logger = require(`${appRoot}/src/config/logger`);

// handle user disconnect events 
const disconectHandler = () => {
    logger.debug('user disconnected');
};

// Handles socket connection events
const connectionHandler = (socket) => {
    socket.on('disconnect', disconectHandler);
    socket.on('chat message', (msg) => {
        logger.debug(`message: ${msg}`);
    });
};

module.exports = {
    connectionHandler,
    disconectHandler,
};
