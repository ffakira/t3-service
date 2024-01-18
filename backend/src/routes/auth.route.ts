/**
 * @dev handles auth routes
 */

import express, { Request, Response, NextFunction} from "express";
import { constants as c } from "node:http2";
import passport from "../services/passport-local.service";
import isAuthenticated from "../middlewares/auth.middleware";
import bcrypt from "bcrypt";
import { pool } from "../db";

const router = express.Router();

router.get("/isAuth", (req: Request, res: Response) => {
    return res.status(c.HTTP_STATUS_OK).json({
        status: 200,
        data: {
            //@ts-ignore
            isAuth: req.session["isAuth"] ?? false,
            //@ts-ignore
            username: req.session["username"] ?? "",
            //@ts-ignore
            userId: req.session["userId"] ?? 0
        }
    });
});

router.get("/user/:userId", async (req: Request, res: Response) => {
    const { userId } = req.params;
    const client = await pool.connect();

    if (userId.length === 0) {
        return res.status(c.HTTP_STATUS_BAD_REQUEST).json({
            status: 400,
            error: {
                message: "No user id provided"
            }
        });
    }

    try {
        await client.query("BEGIN");
        const sqlGetUser = "SELECT username FROM users WHERE id = $1 LIMIT 1;";
        const resultGetUser = await client.query(sqlGetUser, [userId]);

        if (resultGetUser.rows.length === 0) {
            return res.status(c.HTTP_STATUS_NOT_FOUND).json({
                status: 404,
                error: {
                    message: "User not found"
                }
            });
        }
        await client.query("COMMIT");
        return res.status(c.HTTP_STATUS_OK).json({
            status: 200,
            data: {
                username: resultGetUser.rows[0].username
            }
        });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error((err as Error).message);
        return res.status(c.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            status: 500,
            error: {
                message: "Internal server error"
            }
        });
    } finally {
        client.release();
    }
});

router.post("/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const client = await pool.connect();

    try {
        const sqlCheckUser = "SELECT username, id, password FROM users WHERE username = $1 LIMIT 1";
        const resultCheckUser = await client.query(sqlCheckUser, [username]);
        if (resultCheckUser.rows.length === 0) {
            return res.status(c.HTTP_STATUS_UNAUTHORIZED).json({
                status: 401,
                error: {
                    message: "Unauthorized"
                }
            });
        } else {
            const comparePassword = await bcrypt.compare(password, resultCheckUser.rows[0].password);
            if (!comparePassword) {
                return res.status(c.HTTP_STATUS_UNAUTHORIZED).json({
                    status: 401,
                    error: {
                        message: "Unauthorized"
                    }
                });
            } else {
                /**
                 * @dev weird. the session.d.ts is not being taken care of
                 * even after declaration merging. perhaps is time to stop
                 * using old libraries :l
                 */
                //@ts-ignore
                req.session["userId"] = resultCheckUser.rows[0].id;
                //@ts-ignore
                req.session["isAuth"] = true;
                //@ts-ignore
                req.session["username"] = resultCheckUser.rows[0].username;

                return res.status(c.HTTP_STATUS_OK).json({
                    status: 200,
                    data: {
                        user: {
                            id: resultCheckUser.rows[0].id,
                            username: resultCheckUser.rows[0].username
                        }
                    }
                });
            }
        }
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
            return res.status(c.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
                status: 500,
                error: {
                    message: "Internal server error"
                }
            });
        }
    }
});

router.post("/register", (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local-register", (err: Error, user: unknown, info: { message: string }) => {
        if (err) {
            return res.status(c.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
                status: 500,
                error: {
                    message: err.message
                }
            });
        }

        if (!user) {
            return res.status(c.HTTP_STATUS_BAD_REQUEST).json({
                status: 400,
                error: {
                    message: info.message
                }
            });
        }

        return res.status(c.HTTP_STATUS_CREATED).json({
            status: 201,
            data: {
                user
            }
        });
    })(req, res, next);
});

router.delete("/logout", isAuthenticated, (req: Request, res: Response) => {
    if (req.user) {
        req.session.destroy((err) => {
            console.error("err:", err);
        });
        res.clearCookie("connect.sid");
        return res.redirect("http://localhost:3000");
    } else {
        return res.redirect("http://localhost:3000");
    }
});

export default router;
