"use client";

import {
  useContext,
  useState,
  createContext,
  PropsWithChildren,
  Dispatch as ReactDispatch,
  SetStateAction as ReactSetStateAction
} from "react";

enum GameType {
  BOT,
  PVP
}

export interface IGameContext {
  gameType?: GameType
  setGameType: ReactDispatch<ReactSetStateAction<GameType | undefined>>
}

export const GameContext = createContext<IGameContext>({
  gameType: undefined,
  setGameType: () => {}
});

GameContext.displayName = "GameContext";

export const useGameContext = (): IGameContext => useContext(GameContext);

export function GameProvider({ children }: PropsWithChildren) {
  const [gameType, setGameType] = useState<GameType | undefined>(undefined); 

  return (
    <GameContext.Provider value={{gameType, setGameType}}>
      {children}
    </GameContext.Provider>
  );
}
