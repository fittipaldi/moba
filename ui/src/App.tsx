import React, {useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";
import "./App.css"; // Import the CSS file

// Define the Player interface for TypeScript
interface Player {
    id: string;
    position: { x: number, y: number };
    health: number;
    name: string;
    color: string;
    playerIdsToAttack: string[];
}

let socketGlobal: Socket;

function App() {
    const [players, setPlayers] = useState<{ [id: string]: Player }>({});
    const [playerName, setPlayerName] = useState<string | null>();
    const [playerId, setPlayerId] = useState<string>();

    // Fetch the initial players and listen for updates
    useEffect(() => {
        const socket: Socket = io("http://localhost:4000");
        socketGlobal = socket;

        socket.on("connect", () => {
            const name = prompt("Insert your player name:")
            setPlayerId(socket.id);
            setPlayerName(name);
            socket.emit("addPlayer", {name: name});
        });

        // Sync all players when connecting
        socket.on("currentPlayers", (currentPlayers) => {
            console.log("currentPlayers", currentPlayers);
            setPlayers(currentPlayers); // Update state with all current players
        });

        // Handle new player joining
        socket.on("newPlayer", (player: Player) => {
            console.log("newPlayer", player);
            setPlayers((prevPlayers) => ({...prevPlayers, [player.id]: player}));
        });

        // Handle player updates (e.g., movement, health, etc.)
        socket.on("playerMoved", (updatedPlayer: Player) => {
            console.log("playerMoved", updatedPlayer);
            setPlayers((prevPlayers) => ({
                ...prevPlayers,
                [updatedPlayer.id]: updatedPlayer,
            }));
        });

        socket.on("playerUpdated", (updatedPlayer: Player) => {
            console.log("playerUpdated", updatedPlayer);
            setPlayers((prevPlayers) => ({
                ...prevPlayers,
                [updatedPlayer.id]: updatedPlayer,
            }));
        });

        // Handle player attacks
        socket.on("playerAttacked", (attackedPlayer: Player) => {
            console.log("playerAttacked", attackedPlayer);
            setPlayers((prevPlayers) => ({
                ...prevPlayers,
                [attackedPlayer.id]: attackedPlayer,
            }));
        });

        // Handle player defeat
        socket.on("playerDefeated", (defeatedPlayer: Player) => {
            console.log("playerDefeated", defeatedPlayer);
            alert(`Player ${defeatedPlayer.name} has been defeated!`);
            setPlayers((prevPlayers) => {
                const updatedPlayers = {...prevPlayers};
                delete updatedPlayers[defeatedPlayer.id];
                return updatedPlayers;
            });
        });

        // Handle player disconnection
        socket.on("playerDisconnected", (disconnectedId: string) => {
            console.log("playerDisconnected", disconnectedId);
            setPlayers((prevPlayers) => {
                const updatedPlayers = {...prevPlayers};
                delete updatedPlayers[disconnectedId];
                return updatedPlayers;
            });
        });

        return () => {
            socket.disconnect();
            socket.close();
        };
    }, []);

    // Handle player movement
    const movePlayer = (direction: "up" | "down" | "left" | "right") => {
        let movement = {x: 0, y: 0};
        if (direction === "up") movement.y = -10;
        if (direction === "down") movement.y = 10;
        if (direction === "left") movement.x = -10;
        if (direction === "right") movement.x = 10;
        socketGlobal.emit("playerMovement", movement);
    };

    // Handle attacking another player
    const attackPlayer = (targetId: string) => {
        socketGlobal.emit("attack", targetId);
    };

    const updatePlayer = () => {
        const name = prompt("Enter new name:");
        socketGlobal.emit("updatePlayer", {name: name});
    }

    const addPlayer = () => {

    }

    return (
        <div className="game-container">
            <div className="controls">
                <h1>MOBA Game</h1>
                <p>Your ID: {playerId}</p>
                <div>
                    <button onClick={() => movePlayer("up")}>Up</button>
                    <button onClick={() => movePlayer("down")}>Down</button>
                    <button onClick={() => movePlayer("left")}>Left</button>
                    <button onClick={() => movePlayer("right")}>Right</button>
                    <button onClick={() => updatePlayer()}>update</button>
                </div>
            </div>

            {/* Render all players */}
            <div className="map-container">
                {Object.values(players).map((player) => (
                    <div
                        key={player.id}
                        className={`player ${player.id === playerId ? "current" : "other"}`}
                        style={{
                            backgroundColor: `${player.color}`,
                            position: "absolute",
                            transform: `translate(${player.position.x}px, ${player.position.y}px)`,
                        }}
                    >
                        <span>{player.name} ({player.health})</span>
                        {player.id !== playerId && (
                            <button className="attack-button" onClick={() => attackPlayer(player.id)}>
                                Attack
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;