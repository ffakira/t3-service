import express from "express";
import { createServer } from "node:http";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";
import * as Sentry from "@sentry/node";
import path from "node:path";
import session from "express-session";
import cookieParser from "cookie-parser";
import FileStore from "session-file-store";

import gamesRoute from "./routes/game.route";
import authRoute from "./routes/auth.route";
import { createTable } from "./db";
import onConnection from "./sockets";

/**
 * @dev Naming convention of env file is:
 * .env.development
 * .env.production
 * .env.test
 */
dotenv.config({
    path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`)
});

/** 
 * @dev setup express configuration
 */
const app = express();
const FileStoreInstance = FileStore(session);
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
        credentials: true
    },
    path: "/socket.io"
});

/**
 * @dev flag check for Sentry to run production
 */
if (process.env.NODE_ENV === "production") {
    Sentry.init({
        dsn: process.env.SENTRY_DNS,
        integrations: [
            new Sentry.Integrations.Http({ tracing: true }),
            new Sentry.Integrations.Express({ app }),
        ],
        tracesSampleRate: 1.0,
        profilesSampleRate: 1.0
    });
    
    app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);
    app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler);
}

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    store: new FileStoreInstance(),
    secret: process.env.COOKIE_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 86400 * 1000,
        sameSite: "lax"
    }
}));

// app.set("trust proxy", 1);

/**
 * @dev register routes
 */
app.use("/api/auth", authRoute);
app.use("/api/games", gamesRoute);

/**
 * @dev listen to socket events
 */
io.on("connection", (socket) => onConnection(io, socket));

server.listen(process.env.PORT || 9000, async () => {
    await createTable();
    console.log("server running :9000");
});
