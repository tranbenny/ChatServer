const Hapi = require('hapi');
const SocketIO = require('socket.io');
const inert = require('inert');
const logger = require('./config/logger');

// handlers
const { connectionHandler, disconectHandler } = require('./controllers/socketController');

const server = Hapi.server({
    port: 3000,
    host: 'localhost',
});

const io = SocketIO.listen(server.listener);
io
    .of('/chat')
    .on('connection', (socket) => {
        socket.on('disconnect', disconectHandler);
        socket.on('chat message', (msg) => {
            logger.info(`message: ${msg}`);
            socket.emit('chat message', msg);
        });
    });

server.route({
    method: 'GET',
    path: '/{name}',
    handler: (request) => {
        const name = encodeURIComponent(request.params.name);
        return `Hello ${name}!`;
    },
});

const init = async () => {
    await server.register(inert);
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, reply) => reply.file('./index.html'),
    });
    await server.start();
    logger.info(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    logger.error(err);
    process.exit(1);
});

init();
