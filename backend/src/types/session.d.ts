import "express-session";

declare module "express-session" {
    interface SessionData {
        isAuth?: boolean
        userId?: number
        username?: string
    }
}

export {};
