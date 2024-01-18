/**
 * @dev handles core game 
 */

import express, { Request, Response } from "express";
import isAuthenticated from "../middlewares/auth.middleware";
import { constants as c } from "node:http2";
import { pool } from "../db";

const router = express.Router();

router.get("/stats/:player", async (req: Request, res: Response) => {
    const client = await pool.connect();
    const player = req.params.player;

    if (!player) {
        return res.status(c.HTTP_STATUS_BAD_REQUEST).json({
            status: 400,
            error: {
                message: "Invalid player"
            }
        });
    }

    try {
        await client.query("BEGIN");
        const sqlFindUser = "SELECT id, username FROM users WHERE username = $1";
        const resultFindUser = await client.query(sqlFindUser, [player]);

        if (resultFindUser.rows.length === 0) {
            return res.status(c.HTTP_STATUS_NOT_FOUND).json({
                status: 404,
                error: {
                    message: "Player not found"
                }
            });
        }

        const sqlGetUserStats = `SELECT
            total_matches,
            win_pvp,
            loose_pvp,
            tie_pvp,
            win_bot,
            loose_bot,
            tie_bot
        FROM user_stats WHERE user_id = $1`;
        const resultGetUserStats = await client.query(sqlGetUserStats, [resultFindUser.rows[0].id]);
        await client.query("COMMIT");
        const playerStats = resultGetUserStats.rows[0];

        res.status(c.HTTP_STATUS_OK).json({
            status: 200,
            data: {
                player,
                stats: {
                    pvp: {
                        win: playerStats.win_pvp,
                        loose: playerStats.loose_pvp,
                        tie: playerStats.tie_pvp,
                    },
                    bot: {
                        win: playerStats.win_bot,
                        loose: playerStats.loose_bot,
                        tie: playerStats.tie_bot
                    }
                }
            }
        });

    } catch(err) {
        await client.query("ROLLBACK");
        res.status(c.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            status: 500,
            error: {
                message: (err as Error).message
            }
        });

    } finally {
        client.release();
    }
});

router.post("/create", isAuthenticated, async (req: Request, res: Response) => {
    const client = await pool.connect();
    const { gameType } = req.body;

    try {
        await client.query("BEGIN");
        /** @dev Check if a match exists for this user < 15 mins */
        const sqlGetMatch = `SELECT id FROM match WHERE user_id = $1 AND 
            created_at >= CURRENT_TIMESTAMP - INTERVAL '15 minutes' AND pending = TRUE`;
        //@ts-ignore
        const getMatchResult = await client.query(sqlGetMatch, [req.session["userId"]]);

        if (getMatchResult.rows.length === 0) {
            /** @dev create a new match */
            const sqlInsertMatch = `INSERT INTO match (
                user_id,
                enemy_id,
                pending,
                game_type,
                player_symbol,
                enemy_symbol,
                player_turn,
                board_state
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, created_at;`;
            //@ts-ignore
            const userId = req.session["userId"];
            const pending = gameType === "bot" ? false : true;
            const playerSymbol = Math.random() > 0.5;
            const enemySymbol = !playerSymbol;
            const playerTurn = false;
            const boardState = new Array(9).fill(0);

            const insertMatchResult = await client.query(sqlInsertMatch, [
                userId, userId, pending, gameType, playerSymbol, enemySymbol, playerTurn, boardState
            ]);
            const newMatch = insertMatchResult.rows[0];
            await client.query("COMMIT");

            return res.status(c.HTTP_STATUS_OK).json({
                status: 200,
                data: {
                    //@ts-ignore
                    user: req.session["username"],
                    gameId: newMatch.id
                }
            });
        } else {
            return res.status(c.HTTP_STATUS_OK).json({
                status: 200,
                data: {
                    //@ts-ignore
                    user: req.session["username"],
                    gameId: getMatchResult.rows[0].id
                }
            });
        }
    } catch (err) {
        await client.query("ROLLBACK");
        res.status(c.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            status: 500,
            error: {
                message: (err as Error).message
            }
        });
    } finally {
        client.release();
    }
});

router.post("/join", isAuthenticated, async (req: Request, res: Response) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        /** @dev Find matches within 15 minutes, which doesn't equal to userId */
        const sqlGetMatch = `SELECT id FROM match 
            WHERE pending = TRUE AND user_id <> $1 AND enemy_id <> $1
            ORDER BY DATE_TRUNC('minute', created_at) + INTERVAL '15 minutes' ASC, created_at ASC;
        `;
        //@ts-ignore
        const getMatchResult = await client.query(sqlGetMatch, [req.session["userId"]]);

        /** @dev No matches found */
        if (getMatchResult.rows.length === 0) {
            return res.status(c.HTTP_STATUS_NOT_FOUND).json({
                status: 404,
                data: []
            });
        } else {
            const gameId = getMatchResult.rows[0].id;
            const sqlUpdateMatch = `UPDATE match SET 
                enemy_id = $1, updated_at = CURRENT_TIMESTAMP, pending = FALSE 
                WHERE pending = TRUE AND id = $2;
            `;
            //@ts-ignore
            await client.query(sqlUpdateMatch, [req.session["userId"], gameId]);
            await client.query("COMMIT");

            return res.status(c.HTTP_STATUS_OK).json({
                status: 200,
                data: {
                    //@ts-ignore
                    user: req.session["username"],
                    gameId
                }
            });
        }
    } catch (err) {
        await client.query("ROLLBACK");
        res.status(c.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            status: 500,
            error: {
                message: (err as Error).message
            }
        });
    } finally {
        client.release();
    }
});

/**
 * @dev can only be accessed by the player
 */
router.get("/match/:gameId", isAuthenticated, async (req: Request, res: Response) => {
    const client = await pool.connect();
    const { gameId } = req.params;

    if (gameId.length === 0) {
        return res.status(c.HTTP_STATUS_BAD_REQUEST).json({
            status: 400,
            error: {
                message: "No params provided"
            }
        });
    } else {
        try {
            await client.query("BEGIN");
    
            const sqlGetMatch = `SELECT 
                user_id, 
                enemy_id,
                player_symbol, 
                enemy_symbol, 
                player_turn, 
                board_state 
                FROM match WHERE id = $1`;
            const getMatchResult = await client.query(sqlGetMatch, [gameId]);

            if (getMatchResult.rows.length === 0) {
                return res.status(c.HTTP_STATUS_NOT_FOUND).json({
                    status: 404,
                    data: []
                });
            }
            await client.query("COMMIT");

            const userId = getMatchResult.rows[0].user_id;
            const enemyId = getMatchResult.rows[0].enemy_id;

            //@ts-ignore
            if (req.session["userId"] === userId || req.session["userId"] == enemyId) {
                return res.status(c.HTTP_STATUS_UNAUTHORIZED).json({
                    status: 401,
                    error: {
                        message: "Access denied."
                    }
                });
            }

            res.status(c.HTTP_STATUS_OK).json({
                status: 200,
                data: {
                    player: {
                        symbol: getMatchResult.rows[0].player_symbol,
                        playerId: userId
                    },
                    enemy: {
                        symbol: getMatchResult.rows[0].enemy_symbol,
                        playerId: enemyId
                    },
                    playerTurn: getMatchResult.rows[0].player_turn,
                    boardState: getMatchResult.rows[0].board_state
                }
            });

        } catch (err) {
            await client.query("ROLLBACK");
            res.status(c.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
                status: 500,
                error: {
                    message: (err as Error).message
                }
            });
        } finally {
            client.release();
        }
    }
});

export default router;
