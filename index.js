import { server as _server } from 'hapi';

const server = _server({
    port: 3000,
    host: 'localhost',
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => 'Hello World!',
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
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
