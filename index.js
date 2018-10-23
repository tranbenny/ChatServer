const Hapi = require('hapi');
const inert = require('inert');
const SocketIO = require('socket.io');

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
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
