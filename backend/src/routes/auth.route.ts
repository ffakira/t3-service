/**
 * @dev handles auth routes
 */

import express, { Request, Response, NextFunction} from "express";
import { constants as c } from "node:http2";
import passport from "../services/passport-local.service";
import isAuthenticated from "../middlewares/auth.middleware";
import bcrypt from "bcrypt";
import { pool } from "../db";
import AuthController from "../controllers/auth.controller";

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

router.get("/user/:userId", AuthController.getUserId);
router.post("/login", AuthController.login);
router.delete("/logout", AuthController.logout);

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

export default router;
