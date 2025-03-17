import React, {useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";
import {toast as sonnerToast, Toaster} from "sonner";
import GameMap from "@/components/GameMap";
import GameControls from "@/components/GameControls";

// Define the Player interface
interface Player {
    id: string;
    position: { x: number, y: number };
    health: number;
    name: string;
    color: string;
    playerIdsToAttack: {};
}

let socketGlobal: Socket;
//const socketUrl = "http://localhost:4000";
const socketUrl = "http://lynx-devoted-mutt.ngrok-free.app/socketio";

const Index = () => {
    const [players, setPlayers] = useState<{ [id: string]: Player }>({});
    const [playerName, setPlayerName] = useState<string | null>();
    const [playerId, setPlayerId] = useState<string>();
    const [attackedPlayerId, setAttackedPlayerId] = useState<string | null>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Set loading state
        setIsLoading(true);

        const socket: Socket = io(socketUrl);
        socketGlobal = socket;

        socket.on("connect", () => {
            const name = prompt("Enter your player name:") || "Player";
            setPlayerId(socket.id);
            setPlayerName(name);
            socket.emit("addPlayer", {name: name});

            sonnerToast("Connected to game server", {
                description: `Welcome, ${name}!`,
            });

            setIsLoading(false);
        });

        // Sync all players when connecting
        socket.on("currentPlayers", (currentPlayers) => {
            console.log("currentPlayers", currentPlayers);
            setPlayers(currentPlayers);
        });

        // Handle new player joining
        socket.on("newPlayer", (player: Player) => {
            console.log("newPlayer", player);
            setPlayers((prevPlayers) => ({...prevPlayers, [player.id]: player}));

            sonnerToast(`${player.name} joined the game`, {
                description: "A new challenger appears!",
            });
        });

        // Handle player updates (e.g., movement, health, etc.)
        socket.on("playerMoved", (updatedPlayer: Player) => {
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
            handleAttack(attackedPlayer.id);

            if (attackedPlayer.id === socket.id) {
                sonnerToast("You were attacked!", {
                    description: `Health remaining: ${attackedPlayer.health}`,
                });
            }
        });

        // Handle player defeat
        socket.on("playerDefeated", (defeatedPlayer: Player) => {
            console.log("playerDefeated", defeatedPlayer);
            sonnerToast(`${defeatedPlayer.name} has been defeated!`, {
                description: "They have been removed from the game.",
            });

            setPlayers((prevPlayers) => {
                const updatedPlayers = {...prevPlayers};
                delete updatedPlayers[defeatedPlayer.id];
                return updatedPlayers;
            });
        });

        // Handle player disconnection
        socket.on("playerDisconnected", (disconnectedId: string) => {
            console.log("playerDisconnected", disconnectedId);

            const disconnectedPlayer = players[disconnectedId];
            if (disconnectedPlayer) {
                sonnerToast(`${disconnectedPlayer.name} left the game`, {
                    description: "Player disconnected",
                });
            }

            setPlayers((prevPlayers) => {
                const updatedPlayers = {...prevPlayers};
                delete updatedPlayers[disconnectedId];
                return updatedPlayers;
            });
        });

        // Handle connection errors
        socket.on("connect_error", (error) => {
            console.error("Connection error:", error);
            sonnerToast("Connection error", {
                description: "Failed to connect to game server. Please try again.",
            });
        });

        return () => {
            socket.disconnect();
            socket.close();
        };
    }, []);

    useEffect(() => {
        // Keyboard controls
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'a':
                    console.log('Attack player', playerId);
                    if (playerId) {
                        attackNearPlayer(playerId);
                    }
                    break;
                case 'ArrowUp':
                    movePlayer('up');
                    break;
                case 'ArrowDown':
                    movePlayer('down');
                    break;
                case 'ArrowLeft':
                    movePlayer('left');
                    break;
                case 'ArrowRight':
                    movePlayer('right');
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [players, playerId]);

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
        sonnerToast("Attacking player", {
            description: `You attacked ${players[targetId]?.name || "a player"}!`,
        });
    };

    const attackNearPlayer = (playerId: string) => {
        const player = players[playerId];
        if (player) {
            if (player.playerIdsToAttack && Object.keys(player.playerIdsToAttack).length > 0) {
                Object.keys(player.playerIdsToAttack).forEach(targetId => {
                    console.log(`Target: ${targetId}`);
                    attackPlayer(targetId);
                });
            } else {
                sonnerToast("No players nearby", {
                    description: "Move closer to other players to attack them",
                });
            }
        }
    };

    const updatePlayer = () => {
        const name = prompt("Enter new name:") || playerName;
        if (name && name !== playerName) {
            socketGlobal.emit("updatePlayer", {name: name});
            setPlayerName(name);
            sonnerToast("Name updated", {
                description: `Your name is now ${name}`,
            });
        }
    };

    const handleAttack = (id: string) => {
        setAttackedPlayerId(id);
        setTimeout(() => {
            setAttackedPlayerId(null);
        }, 300);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-semibold animate-pulse">Connecting to Game Server...</h2>
                    <p className="text-muted-foreground">Please wait while we establish connection</p>
                </div>
            </div>
        );
    }

    return (
        <div className="game-container">
            <Toaster/>
            <GameMap
                players={players}
                playerId={playerId}
                attackedPlayerId={attackedPlayerId}
                onAttack={attackPlayer}
                mapSize={800}
            />

            <GameControls
                playerName={playerName}
                playerId={playerId}
                players={players}
                onMove={movePlayer}
                onAttack={attackPlayer}
                onUpdatePlayer={updatePlayer}
            />
        </div>
    );
};

export default Index;
