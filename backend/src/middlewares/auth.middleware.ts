import { Request, Response, NextFunction } from "express";
import { constants as c } from "node:http2";

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    //@ts-ignore
    if (req.session["isAuth"]) {
        next();
    } else {
        res.status(c.HTTP_STATUS_FORBIDDEN).json({
            error: {
                message: "Unauthorized"
            }
        });
    }
}

export default isAuthenticated;
