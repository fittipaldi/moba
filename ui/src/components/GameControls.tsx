import React from "react";
import {
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    Edit3,
    Info,
    Shield,
    Sword,
    User,
    Users
} from "lucide-react";

interface Player {
    id: string;
    position: { x: number; y: number };
    health: number;
    name: string;
    color: string;
    playerIdsToAttack: {};
}

interface GameControlsProps {
    playerName: string | null | undefined;
    playerId: string | undefined;
    players: { [id: string]: Player };
    onMove: (direction: "up" | "down" | "left" | "right") => void;
    onAttack: (targetId: string) => void;
    onUpdatePlayer: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
                                                       playerName,
                                                       playerId,
                                                       players,
                                                       onMove,
                                                       onAttack,
                                                       onUpdatePlayer,
                                                   }) => {
    return (
        <div className="game-controls animate-fade-in">
            <div className="space-y-4">
                <h1 className="game-logo">MOBA Arena</h1>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <div className="chip bg-secondary text-secondary-foreground">
                            <Users size={14} className="mr-1"/>
                            {Object.values(players).length}
                        </div>
                        <span className="text-sm text-muted-foreground">Players Online</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="chip bg-primary/10 text-primary">
                            <User size={14} className="mr-1"/>
                            {playerName || "Unknown"}
                        </div>
                        <button
                            onClick={onUpdatePlayer}
                            className="text-xs text-primary hover:text-primary/80 transition-colors"
                        >
                            <Edit3 size={12}/>
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-1">
                    <Shield size={14}/>
                    Movement
                </h3>
                <p className="text-xs text-muted-foreground">Use arrow keys or buttons to move</p>

                <div className="game-movement-controls">
                    <div className="col-start-1 col-end-2"></div>
                    <button
                        className="game-movement-button"
                        onClick={() => onMove("up")}
                        aria-label="Move Up"
                    >
                        <ArrowUp size={18}/>
                    </button>
                    <div className="col-start-3 col-end-4"></div>

                    <button
                        className="game-movement-button"
                        onClick={() => onMove("left")}
                        aria-label="Move Left"
                    >
                        <ArrowLeft size={18}/>
                    </button>
                    <div className="col-start-2 col-end-3"></div>
                    <button
                        className="game-movement-button"
                        onClick={() => onMove("right")}
                        aria-label="Move Right"
                    >
                        <ArrowRight size={18}/>
                    </button>

                    <div className="col-start-1 col-end-2"></div>
                    <button
                        className="game-movement-button"
                        onClick={() => onMove("down")}
                        aria-label="Move Down"
                    >
                        <ArrowDown size={18}/>
                    </button>
                    <div className="col-start-3 col-end-4"></div>
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-1">
                    <Sword size={14}/>
                    Combat
                </h3>
                <p className="text-xs text-muted-foreground">Press 'a' to attack nearby players</p>

                <button
                    className="game-button game-button-destructive w-full"
                    onClick={() => {
                        const player = players[playerId || ""];
                        if (player?.playerIdsToAttack) {
                            Object.keys(player.playerIdsToAttack).forEach(targetId => {
                                onAttack(targetId);
                            });
                        }
                    }}
                >
                    Attack Nearby Players
                </button>
            </div>

            <div className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-1">
                    <Users size={14}/>
                    Other Players
                </h3>

                <div className="player-list">
                    {Object.values(players)
                        .filter(player => player.id !== playerId)
                        .map(player => (
                            <div key={player.id} className="player-list-item">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{backgroundColor: player.color}}
                                    />
                                    <span className="text-sm">{player.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="chip bg-green-100 text-green-800">
                                        {player.health}HP
                                    </div>
                                    <button
                                        className="p-1 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                                        onClick={() => onAttack(player.id)}
                                    >
                                        <Sword size={14}/>
                                    </button>
                                </div>
                            </div>
                        ))}

                    {Object.values(players).filter(player => player.id !== playerId).length === 0 && (
                        <div className="text-sm text-muted-foreground text-center py-2">
                            No other players online
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-auto pt-4 text-center">
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Info size={12}/>
                    <span>Use keyboard arrows to move and 'a' to attack</span>
                </div>
            </div>
        </div>
    );
};

export default GameControls;
