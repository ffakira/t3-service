"use client";

import GameBoard from "@/components/game/GameBoard/GameBoard";
import Image from "next/image";
import { useState, useEffect } from "react";

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

  const [seconds, setSeconds] = useState<number>(0);

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;

    if (seconds > 0) {
      timer = setInterval(() => {
        console.log(seconds);
        setSeconds((prevState) => prevState + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [seconds]);

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
              src="/images/player_x.png"
              alt="Player X"
              width={20}
              height={20}
            />
            <span>photons</span>
          </div>

          <div className="flex items-center gap-2 bg-teal-900 p-4">
            <Image
              src="/images/player_o.png"
              alt="Player O"
              width={20}
              height={20}
            />
            <span>johndoe</span>
          </div>
        </div>
        {/* <p>New Match {params.id} </p> */}
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
