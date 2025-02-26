import {Server} from 'socket.io';
import {createServer} from 'http';
import {io, Socket} from 'socket.io-client';

const SERVER_PORT = 4123;

describe('Socket.IO connection test', () => {
    let server: Server;
    let httpServer: any;
    let client: any;

    beforeAll((done) => {
        // Create and start the server
        httpServer = createServer();
        server = new Server(httpServer, {
            cors: {origin: '*'},
        });

        httpServer.listen(SERVER_PORT, () => {
            // Connect the client to the server
            client = io('http://localhost:' + SERVER_PORT, {
                transports: ['websocket'],
            });

            client.on('connect', () => {
                done(); // Call done() once the connection is successful
            });
        });
    });

    afterAll((done) => {
        // Cleanup: Close connections after the test
        if (client.connected) client.disconnect();
        server.close(done);
    });

    test('should connect to the socket server', (done) => {
        expect(client.connected).toBe(true);
        done();
    });
});
