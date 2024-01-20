import { NextFunction, Request, Response } from "express";
import { constants as c } from "http2";
import { Pool, PoolClient } from "pg";
import { ZodError } from "zod";
import UserRepository from "../repositories/user.repository";
import AuthService from "../services/auth.service";
import { User, UserSchema } from "../models/user.model";
import Logger, { format } from "../services/logger.service";
import passport from "../services/passport-local.service";
import { DatabaseManager } from "../db";

/**
 * @dev business logic to handle user authentication with passport.js
 * as middleware.
 * 
 * @TODO in future implement Google and Discord OAuth 2.0, to allow users
 * to login
 */
class AuthController {
    private static databaseManager: DatabaseManager = new DatabaseManager();
    private static userRepository: UserRepository = new UserRepository(AuthController.databaseManager);
    private static authService: AuthService = new AuthService();
    private static pool: Pool = AuthController.databaseManager.getPool;

    public static async isAuth(req: Request, res: Response) {
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
    }

    public static async getUserId(req: Request, res: Response) {
        const client: PoolClient = await AuthController.pool.connect();
        const { userId } = req.params;

        if (!userId || userId.length === 0) {
            return res.status(c.HTTP_STATUS_BAD_REQUEST).json({
                status: c.HTTP_STATUS_BAD_REQUEST,
                error: {
                    message: "No user id provided"
                }
            });
        }

        try {
            await client.query("BEGIN");
            const user = await AuthController.userRepository.getUserById(userId);
            await client.query("COMMIT");

            if (user === null) {
                return res.status(c.HTTP_STATUS_NOT_FOUND).json({
                    status: c.HTTP_STATUS_NOT_FOUND,
                    error: {
                        message: "Not Found"
                    }
                });
            }

            return res.status(c.HTTP_STATUS_OK).json({
                status: c.HTTP_STATUS_OK,
                data: {
                    username: user.username
                }
            });
        } catch (err) {
            await client.query("ROLLBACK");
            console.error(`GET /user/:userId error occured: ${(err as Error).message}`);
            return res.status(c.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
                status: c.HTTP_STATUS_INTERNAL_SERVER_ERROR,
                error: {
                    message: "Internal server error"
                }
            });
        } finally {
            client.release();
        }
    }

    public static async login(req: Request, res: Response) {
        const client: PoolClient = await AuthController.pool.connect();

        try {
            /** @dev validate req.body schema */
            const validateSchema = UserSchema.parse(req.body);
            const user = validateSchema as Partial<User>;

            const getUser = await AuthController.userRepository.getUserByUsername(user.username!);

            /** @dev  check if the username exists and compare hash password with plain password*/
            if (getUser === null) {
                return res.status(c.HTTP_STATUS_UNAUTHORIZED).json({
                    status: c.HTTP_STATUS_UNAUTHORIZED,
                    error: {
                        message: "Unauthorized"
                    }
                });
            } else {
                const comparePassword = await AuthController.authService.verifyPassword(user.password!, getUser.password!);
                if (!comparePassword) {
                    return res.status(c.HTTP_STATUS_UNAUTHORIZED).json({
                        status: c.HTTP_STATUS_UNAUTHORIZED,
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
                    req.session["userId"] = getUser.id!;
                    //@ts-ignore
                    req.session["isAuth"] = true;
                    //@ts-ignore
                    req.session["username"] = getUser.username!;

                    return res.status(c.HTTP_STATUS_OK).json({
                        status: c.HTTP_STATUS_OK,
                        data: {
                            user: {
                                id: getUser.id!,
                                username: getUser.username!
                            }
                        }
                    });
                }
            }

        } catch (err) {
            if (err instanceof ZodError) {
                Logger.info(`${format.brightCyan.bold(`${req.method} ${req.url}`)} Zod Error validating schema: ${JSON.stringify(err.errors)}`);
                return res.status(c.HTTP_STATUS_BAD_REQUEST).json({
                    status: c.HTTP_STATUS_BAD_REQUEST,
                    error: {
                        message: err.errors
                    }
                });
            }

            if (err instanceof Error) {
                Logger.error(`${format.red.bold(`${req.method} ${req.url}`)}`);

                return res.status(c.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
                    status: c.HTTP_STATUS_INTERNAL_SERVER_ERROR,
                    error: {
                        message: "Internal server error"
                    }
                });
            }
        } finally {
            client.release();
        }
    }

    public static async register(req: Request, res: Response, next: NextFunction) {
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
    }

    public static async logout(req: Request, res: Response) {
        if (req.user) {
            req.session.destroy((err: Error) => {
                console.error(`Error destroying session: ${err.message}`);
            });
            res.clearCookie("connect.sid");
            return res.redirect("http://localhost:3000");
        } else {
            return res.redirect("http://localhost:3000");
        }
    }
}

export default AuthController;
