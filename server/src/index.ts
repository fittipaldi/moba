import express from 'express';
import {createServer} from 'http';
import {Server, Socket} from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import getRandomHexColor from "./utils";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins (for development purposes)
        methods: ['GET', 'POST'], // Allowed HTTP methods
    },
});

// Use the cors middleware for the Express server
app.use(cors());

const PORT = process.env.PORT || 4000; // Default to 4000 if PORT is not set in .env
const MAX_X = 760;
const MAX_Y = 760;

interface Player {
    id: string;
    position: { x: number, y: number };
    health: number;
    name: string;
    color: string;
    playerIdsToAttack: string[];
}

const players: { [id: string]: Player } = {};

app.get('/', (req, res) => {
    res.send('MOBA Server');
});

io.on('connection', (socket: Socket) => {
    console.log(`Player ${socket.id} - connected`);

    // Initialize a new player with default values
    players[socket.id] = {
        id: socket.id,
        position: {x: 0, y: 0},
        health: 100,
        name: "Player" + socket.id, // Default name, can be updated later
        color: getRandomHexColor(),
        playerIdsToAttack: []
    };

    // Log new player data
    console.log(`New player initialized: ${JSON.stringify(players[socket.id])}`);

    // Send the new player data to the client
    socket.emit('currentPlayers', players);
    socket.broadcast.emit('newPlayer', players[socket.id]);

    // Handle player movement
    socket.on('playerMovement', (movementData: { x: number, y: number }) => {
        const player = players[socket.id];
        if (player) {
            player.position.x += movementData.x;
            player.position.y += movementData.y;
            if (player.position.x < 0 || player.position.x > MAX_X) {
                player.position.x -= movementData.x;
            }
            if (player.position.y < 0 || player.position.y > MAX_Y) {
                player.position.y -= movementData.y;
            }
            console.log(`Player ${socket.id} - moved to position: ${JSON.stringify(player.position)}`);
            io.emit('playerMoved', player);
        }
    });

    // Handle player attacks
    socket.on('attack', (targetId: string) => {
        const player = players[targetId];
        if (player) {
            player.health -= 10; // Simple damage calculation
            console.log(`Player ${socket.id} attacked player ${targetId}: New health of ${targetId} is ${player.health}`);
            io.emit('playerAttacked', player);
            if (player.health <= 0) {
                console.log(`Player ${targetId} defeated by player ${socket.id}`);
                io.emit('playerDefeated', player);
            }
        }
    });

    // Handle player updates (e.g., name, character icon)
    socket.on('updatePlayer', (updateData: { name?: string; color?: string }) => {
        const player = players[socket.id];
        if (player) {
            if (updateData.name) player.name = updateData.name;
            if (updateData.color) player.color = updateData.color;
            console.log(`Player ${socket.id} - updated: ${JSON.stringify(player)}`);
            io.emit('playerUpdated', player);
        }
    });

    // Handle set player
    socket.on('addPlayer', (playerData: { name?: string; color?: string }) => {
        const player = players[socket.id];
        if (player) {
            if (playerData.name) player.name = playerData.name;
            if (playerData.color) player.color = playerData.color;
            player.health = 100;
            player.playerIdsToAttack = [];
            player.position = {x: 0, y: 0};
            console.log(`Player ${socket.id} - data: ${JSON.stringify(player)}`);
            io.emit('playerUpdated', player);
        }
    });

    // Handle player disconnection
    socket.on('disconnect', () => {
        console.log(`Player ${socket.id} - disconnected`);
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Listening on *:${PORT}`);
});
