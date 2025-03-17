import React, {useEffect, useState} from "react";
import GamePlayer from "./GamePlayer";

interface Player {
    id: string;
    position: { x: number; y: number };
    health: number;
    name: string;
    color: string;
    playerIdsToAttack: {};
}

interface GameMapProps {
    players: { [id: string]: Player };
    playerId: string | undefined;
    attackedPlayerId: string | null | undefined;
    onAttack: (targetId: string) => void;
    mapSize?: number;
}

const GameMap: React.FC<GameMapProps> = ({
                                             players,
                                             playerId,
                                             attackedPlayerId,
                                             onAttack,
                                             mapSize = 800,
                                         }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Small delay for animation
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className="game-map"
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'scale(1)' : 'scale(0.98)',
            }}
        >
            {/* Grid Pattern */}
            <div className="absolute inset-0 w-full h-full">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 0, 0, 0.05)" strokeWidth="1"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)"/>
                </svg>
            </div>

            {/* Render all players */}
            {Object.values(players).map((player) => (
                <GamePlayer
                    key={player.id}
                    player={player}
                    isCurrentPlayer={player.id === playerId}
                    isAttacked={player.id === attackedPlayerId}
                    onAttack={onAttack}
                    mapSize={mapSize}
                />
            ))}
        </div>
    );
};

export default GameMap;
