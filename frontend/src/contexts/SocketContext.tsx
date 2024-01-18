"use client";

import {
  useContext,
  useState,
  useEffect,
  createContext,
  Dispatch as ReactDispatch,
  SetStateAction as ReactSetStateAction,
  PropsWithChildren,
} from "react";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { io, Socket } from "socket.io-client";

export interface ISocketContext {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
  setSocket: ReactDispatch<
    ReactSetStateAction<Socket<DefaultEventsMap, DefaultEventsMap> | null>
  >;
}

const SocketContext = createContext({
  socket: null as Socket<DefaultEventsMap, DefaultEventsMap> | null,
  setSocket: (() => {}) as ReactDispatch<
    ReactSetStateAction<Socket<DefaultEventsMap, DefaultEventsMap> | null>
  >,
});

SocketContext.displayName = "SocketContext";

export const useSocketContext = (): ISocketContext => useContext(SocketContext);

export function SocketProvider({ children }: PropsWithChildren) {
  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(io("ws://localhost:9000", {path: "/socket.io", withCredentials: true }));

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
}
