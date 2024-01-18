"use client";

import GameBoard from "@/components/game/GameBoard/GameBoard";
import { useState } from "react";
import Image from "next/image";

export interface HistoryProps {
  params: {
    id: string;
  };
}

export default function History({ params }: HistoryProps): React.ReactNode {
  const [board, setBoard] = useState<Array<React.ReactNode>>(
    [
      true, false, true, 
      false, true, false,
      true, false, true
    ]
  );
  return (
    <>
      <div className="flex flex-col w-full items-center">
        <div className="flex item-center mb-4 gap-x-2">
          <Image src="/images/player_o.png" alt="Player O" width={30} height={30} />
          <h3 className="text-xl font-bold uppercase">photons takes the win</h3>
        </div>
        <div className="flex items-center mb-4 gap-x-2">
          <Image src="/images/player_x.png" alt="Player X" width={30} height={30} />
          <h3 className="text-xl font-bold uppercase">against johndoe</h3>
        </div>
        <GameBoard board={board} setBoard={setBoard} />
      </div>
    </>
  );
}
