const Hapi = require('hapi');
const SocketIO = require('socket.io');
const inert = require('inert');
const fs = require('fs');
const Boom = require('boom');
const uuid = require('uuid');
const logger = require('./config/logger');

// handlers
const { connectionHandler, disconectHandler } = require('./controllers/socketController');
const loginHandler = require('./controllers/loginController');

const UPLOAD_PATH = 'uploads';

// create folder for uploads if it doesn't exist
if (!fs.existsSync(UPLOAD_PATH)) {
    fs.mkdirSync(UPLOAD_PATH);
}

const fileHandler = (file, options) => {
    const filename = uuid.v1();
    const path = `${options.dest}${filename}`;
    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
        file.on('error', (error) => {
            reject(error);
        });

        file.pipe(fileStream);

        file.on('end', (error) => {
            if (error) {
                reject(error);
            }
            const fileDetails = {
                fileName: filename,
                status: 200,
            };
            resolve(fileDetails);
        });
    });
};

const uploader = (file, options) => {
    if (!file) {
        throw new Error('no file(s)');
    }
    return fileHandler(file, options);
};

const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
        cors: true,
    },
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

server.route({
    method: 'POST',
    path: '/login',
    handler: loginHandler,
});

// file upload route
server.route({
    method: 'POST',
    path: '/upload',
    config: {
        payload: {
            output: 'stream',
            allow: 'multipart/form-data',
        },
    },
    handler: async (request, reply) => {
        try {
            const data = request.payload;
            const { file } = data;
            const fileOptions = {
                dest: `${UPLOAD_PATH}/`,
            };
            const fileDetails = await uploader(file, fileOptions);

            return reply.response({
                fileName: fileDetails.fileName,
                status: fileDetails.status,
            });
        } catch (error) {
            console.log(error);
            // TODO: FIX THIS
            // return reply.response(Boom.badRequest(error.message, error));
            return reply.response({
                error: error.message,
            }).code(500);
        }
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
