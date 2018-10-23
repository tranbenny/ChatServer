const Hapi = require('hapi');
const SocketIO = require('socket.io');
const inert = require('inert');
const logger = require('./config/logger');

const server = Hapi.server({
    port: 3000,
    host: 'localhost',
});

const io = SocketIO.listen(server.listener);
io.sockets.on('connection', (socket) => {
    socket.emit({ msg: 'welcome' });
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: (request, h) => {
        const name = encodeURIComponent(request.params.name);
        return `Hello ${name}!`;
    },
});

const init = async () => {
    await server.register(inert);
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => h.file('./index.html'),
    });
    await server.start();
    logger.info(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    logger.error(err);
    process.exit(1);
});

init();
