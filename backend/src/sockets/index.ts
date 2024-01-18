import { Server, Socket } from "socket.io";
import {
    registerFindMatches,
    registerBotMatch,
    registerBoardState,
    registerJoinSession,
    registerPvpMatch
} from "./game.handler";

const onConnection = (io: Server, socket: Socket) => {
    socket.on("error", (err: Error) => {
        console.error("Socket error:", err);
    });

    socket.on("disconnect", () => {
        console.log("disconnected");
    });

    registerPvpMatch("game:pvp-match", io, socket);
    registerBotMatch("game:bot-match", io, socket);
    registerJoinSession("game:join-session", io, socket);
    registerBoardState("game:board-state", io, socket);
    registerFindMatches("game:find-matches", io, socket);
};

export default onConnection;
