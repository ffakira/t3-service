import { pool } from "../db";
import { Server, Socket } from "socket.io";
import { checkWin } from "../services/game.service";

/** 
 * @dev Creates a new match for PvP 
 * Payload to receive from client side:
 * `player` - username accepted as string
 * `gameId` - gameId as UUIDv4(string) that initially created from POST /api/games/create
*/
export const registerPvpMatch = (name: string, io: Server, socket: Socket) => {
    socket.on(name, ({ player, gameId }) => {
        io.emit(name, { player, gameId });
    });
};

/**
 * @dev Creates a new match for Bot
 * Payload to receive from client side:
 * `player` - username accepted as string
 * `gameId` - gameId as UUIDv4(string) that initially created from POST /api/games/create
 */
export const registerBotMatch = (name: string, io: Server, socket: Socket) => {
    socket.on(name, ({ player, gameId }) => {
        const board = [
            true, false, true,
            false, true, false,
            true, false, true
        ];
        io.emit(name, { player, gameId, board });
    });
};

export const registerJoinSession = (name: string, io: Server, socket: Socket) => {
    socket.on(name, (room) => {
        console.log("connected to room:", room);
        socket.join(room);
    });
};

/**
 * @dev Keeps in tracker player turn
 * Payload to receive from client side:
 * `gameId` - gameId as UUIDv4(string) that initially created from /api/games/create
 * `board` - board as Array of the game
 * `playerTurn` - playerTurn as boolean check player turns
 */
export const registerBoardState = (name: string, io: Server, socket: Socket) => {
    const player = "akiraff";

    socket.on(name, async ({ gameId, board, playerTurn }) => {
        const result = checkWin(board);
        const client = await pool.connect();
        try {
            console.log("board state:", board, playerTurn);

            io.to(gameId).emit(name, {
                player, 
                board, 
                playerTurn,
                result
            });
        } catch (err) {
            io.emit("error", (err as Error).message);
        } finally {
            client.release();
        }
    });
};

/**
 * @dev Show all available matches 
 * Payload to receive from client side:
 * `player` - username accepted as string
 */
export const registerFindMatches = (name: string, io: Server, socket: Socket) => {
    socket.on(name, async (player: string) => {
        const client = await pool.connect();
        try {
            const gameId = "game-session";
            io.emit(name, { player, gameId });
        } catch (err) {
            io.emit("error", (err as Error).message);
        } finally {
            client.release();
        }
    });
};
