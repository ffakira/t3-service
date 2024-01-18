/**
 * @dev This handles match history of games
 */

import express, { Request, Response } from "express";
import { constants } from "node:http2";

const router = express.Router();

/**
 * @dev game match history
 */
router.get("/history/player/:player", (req: Request, res: Response) => {
    if (req.params.player === "abc") {
        res.status(constants.HTTP_STATUS_OK).json({
            status: 200,
            data: {
                matches: [
                    {
                        date: "12 Jan, 2024 at 00:28:31",
                        gameId: "c0722bf4-0bb0-4727-896f-e8bdb3bde43e",
                        players: [req.params.player, "johndoe"],
                        duration: "30s",
                        // 0 - loose, 1: win, 2: tie
                        isWin: 0,
                    },
                    {
                        date: "12 Jan, 2024 at 13:31:00",
                        gameId: "c0722bf4-0bb0-4727-896f-e8bdb3bde43e",
                        players: ["johndoe", req.params.player],
                        duration: "45s",
                        isWin: 1
                    }
                ]
            },
            meta: {
                pageSize: 1    
            }
        });
    } else {
        res.status(constants.HTTP_STATUS_NOT_FOUND).json({
            status: 404,
            error: {
                message: "Player not found"
            }
        });
    }
});

/**
 * @dev Allows to replay the session game id
 */
router.get("/history/:user/match/:gameId", (req: Request, res: Response) => {
    if (req.params.user === "abc") {
        res.status(constants.HTTP_STATUS_OK).json({
            status: 200,
            data: {
                date: "12 Jan, 2024 at 13:31:00",
                gameId: "c0722bf4-0bb0-4727-896f-e8bdb3bde43e",
                players: [req.params.user, "johndoe"],
                replay: [
                    [0, 8], [1, 4], [0, 0], [1, 5], [0, 3], [1, 6], [0, 2], [1, 1], [0, 7]
                ]
            }
        });
    } else {
        res.status(constants.HTTP_STATUS_NOT_FOUND).json({
            status: 404,
            error: "Match not found"
        });
    }
});

export default router;
