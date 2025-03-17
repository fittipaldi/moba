import React, {useEffect, useState} from "react";
import {cn} from "@/lib/utils";
import {ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Shield, Sword, User, X} from "lucide-react";

interface Player {
    id: string;
    position: { x: number; y: number };
    health: number;
    name: string;
    color: string;
    playerIdsToAttack: {};
}

interface GamePlayerProps {
    player: Player;
    isCurrentPlayer: boolean;
    isAttacked: boolean;
    onAttack?: (id: string) => void;
    mapSize: number;
}

const GamePlayer: React.FC<GamePlayerProps> = ({
                                                   player,
                                                   isCurrentPlayer,
                                                   isAttacked,
                                                   onAttack,
                                                   mapSize,
                                               }) => {
    const [showAttackEffect, setShowAttackEffect] = useState(false);
    const size = isCurrentPlayer ? 44 : 40;
    const healthPercentage = (player.health / 100) * 100;

    // Ensure player stays within the map bounds
    const posX = Math.min(Math.max(player.position.x, 0), mapSize - size);
    const posY = Math.min(Math.max(player.position.y, 0), mapSize - size);

    // Calculate position relative to map size, center the player
    const left = posX;
    const top = posY;

    useEffect(() => {
        if (isAttacked) {
            setShowAttackEffect(true);
            const timer = setTimeout(() => {
                setShowAttackEffect(false);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [isAttacked]);

    return (
        <div
            className={cn("game-player", {
                "z-20": isCurrentPlayer,
                "pulse-attack": isAttacked,
            })}
            style={{
                left: `${left}px`,
                top: `${top}px`,
            }}
        >
            <div className="game-player-info animate-float">
                <span>{player.name}</span>
            </div>

            <div
                className={cn("game-player-avatar", {
                    "bg-game-player text-white": isCurrentPlayer,
                    "bg-white border border-gray-200": !isCurrentPlayer,
                })}
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: isCurrentPlayer ? undefined : player.color,
                }}
            >
                {isCurrentPlayer ? (
                    <User size={20}/>
                ) : (
                    <div
                        className="flex items-center justify-center"
                        onClick={() => onAttack && onAttack(player.id)}
                    >
                        <Sword size={18}/>
                    </div>
                )}

                {showAttackEffect && <div className="game-attack-effect"/>}
            </div>

            <div className="game-player-health">
                <div
                    className="game-player-health-inner"
                    style={{width: `${healthPercentage}%`}}
                />
            </div>
        </div>
    );
};

export default GamePlayer;
