"use client";

import GameBoard from "@/components/game/GameBoard/GameBoard";
import { useAuthCtx } from "@/contexts/AuthContext";
import Image from "next/image";
import { useState, useEffect } from "react";

interface Players {
  player?: {
    username: string;
    id: number;
    symbol: boolean;
  };
  enemy?: {
    username: string;
    id: number;
    symbol: boolean;
  };
}

export default function Match({
  params,
}: {
  params: { id: string };
}): React.ReactNode {
  /** @dev False - Player X || True - Player O */
  const [playerTurn, setPlayerTurn] = useState<boolean>(false);
  const [board, setBoard] = useState<Array<React.ReactNode>>(
    new Array(9).fill(undefined)
  );
  const { userId } = useAuthCtx();
  const [players, setPlayers] = useState<Players>({});

  const [seconds, setSeconds] = useState<number>(0);

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    const message = "Are you sure you want to forfeit?";
    event.returnValue = message;
    return message;
  };

  useEffect(() => {
    const getGameMatch = async () => {
      const reqMatch = await fetch(`/api/game/match/${params.id}`);
      const respMatch = await reqMatch.json();

      if (reqMatch.status === 200) {
        const { player, enemy } = respMatch.data;
        const [reqPlayer, reqEnemy] = await Promise.all([
          fetch(`/api/user/${player.playerId}`),
          fetch(`/api/user/${enemy.playerId}`),
        ]);

        const dataPlayer = await reqPlayer.json();
        const dataEnemy = await reqEnemy.json();

        setPlayers({
          player: {
            symbol: player.symbol,
            id: player.playerId,
            username: dataPlayer.data.username,
          },
          enemy: {
            symbol: enemy.symbol,
            id: enemy.playerId,
            username: dataEnemy.data.username,
          },
        });
      }
    };
    getGameMatch();

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <>
      <div className="flex flex-col w-full items-center">
        <div className="flex gap-x-4 mb-8">
          <div className="flex items-center gap-2 bg-teal-900 p-4">
            <Image src="/images/clock.svg" alt="clock" width={20} height={20} />
            <span>{formatTime(seconds)}</span>
          </div>
          <div className="flex items-center gap-2 bg-teal-900 p-4">
            <Image
              src={
                players.player?.symbol
                  ? "/images/player_o.png"
                  : "/images/player_x.png"
              }
              alt={players.player?.symbol ? "Player O" : "Player X"}
              width={20}
              height={20}
            />
            <span>{players.player?.username}</span>
          </div>

          <div className="flex items-center gap-2 bg-teal-900 p-4">
            <Image
              src={
                players.enemy?.symbol
                  ? "/images/player_o.png"
                  : "/images/player_x.png"
              }
              alt={players.enemy?.symbol ? "Player O" : "Player X"}
              width={20}
              height={20}
            />
            <span>{players.enemy?.username}</span>
          </div>
        </div>
        <GameBoard
          playerTurn={playerTurn}
          setPlayerTurn={setPlayerTurn}
          board={board}
          setBoard={setBoard}
          gameId={params.id}
        />
      </div>
    </>
  );
}
