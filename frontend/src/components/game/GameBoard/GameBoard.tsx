"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSocketContext } from "@/contexts/SocketContext";
import { useAuthCtx } from "@/contexts/AuthContext";
import style from "./style.module.css";

export interface GameBoardProps {
  playerTurn?: boolean;
  setPlayerTurn?: React.Dispatch<React.SetStateAction<boolean>>;
  board: Array<React.ReactNode>;
  setBoard: React.Dispatch<React.SetStateAction<Array<React.ReactNode>>>;
  gameId: string;
}

/**
 * @dev Game board which paints the board
 */
export default function GameBoard({
  playerTurn,
  setPlayerTurn,
  board,
  setBoard,
  gameId,
}: GameBoardProps): React.ReactNode {
  const { socket } = useSocketContext();
  const { userId } = useAuthCtx();
  const [winCells, setWinCells] = useState<Array<Number>>([]);
  const [isWin, setIsWin] = useState<boolean | null>(null);

  /** @dev for changing hover color */
  const styleBoardCells = (player: React.ReactNode, idx: number) => {
    if (player === undefined || player === null) {
      if (isWin !== null) return "";
      return playerTurn
        ? style["board-cells__player-o"]
        : style["board-cells__player-x"];
    }
    return "";
  };

  /** @dev style win board cells */
  const styleWinCells = (idx: number) => {
    if (isWin === null) return "";
    if (winCells[0] === idx || winCells[1] === idx || winCells[2] === idx) {
      return isWin
        ? style["board-cells__win--player-o"]
        : style["board-cells__win--player-x"];
    }
    return "";
  };

  const handlePlayerTurn = (idx: number) => {
    if (!board[idx] && isWin === null) {
      setBoard((prevState) => {
        const newBoard = [...prevState];
        newBoard[idx] = playerTurn;
        return newBoard;
      });
      setPlayerTurn!((prevPlayerTurn) => !prevPlayerTurn);
    }
  };

  useEffect(() => {
    if (socket) {
      console.log(userId);
      socket.emit("game:join-session", gameId);
      socket.emit("game:board-state", { gameId, board, playerTurn, userId });

      socket.on("game:board-state", ({ gameId, board, playerTurn, result }) => {
        console.log(result);
        if (result !== null) {
          setIsWin(result.player);
          setWinCells(result.board);
        }
        setBoard(board);
        setPlayerTurn!(playerTurn);
      });

      return () => {
        if (socket) {
          socket.off("game:board-state");
        }
      };
    }
  }, [playerTurn, setPlayerTurn, userId]);

  return (
    <div className={style.board}>
      {board.map((player, idx: number) => (
        <div
          onClick={() => handlePlayerTurn(idx)}
          className={`${style["board-cells"]} ${styleBoardCells(
            player,
            idx
          )} ${styleWinCells(idx)}`}
          key={idx}
        >
          {player === undefined || player === null ? (
            <></>
          ) : player ? (
            <Image
              src="/images/player_o.png"
              alt="Player O"
              width={40}
              height={40}
            />
          ) : (
            <Image
              src="/images/player_x.png"
              alt="Player X"
              width={40}
              height={40}
            />
          )}
        </div>
      ))}
    </div>
  );
}
