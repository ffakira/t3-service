import request from "supertest";
import express from "express";
import session from "express-session";
import { constants as c } from "http2";
import bcrypt from "bcrypt";
import { pool } from "../db";
import authRoutes from "../routes/auth.route";

const app = express();
app.use(express.json());
app.use(
    session({
        secret: "test-secret",
        resave: false,
        saveUninitialized: false,
    })
);
app.use("/auth", authRoutes);

jest.mock("../db", () => ({
    pool: {
        connect: jest.fn(),
    },
}));

jest.mock("bcrypt", () => ({
    compare: jest.fn(),
}));

const consoleErrorSpy = jest.spyOn(console, "error");

describe("Auth Routes", () => {
    beforeAll(() => {
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    describe("POST /auth/login", () => {
        it("should return 200 OK and set session variables on successful login", async () => {
            (pool.connect as jest.Mock).mockImplementation(() => ({
                query: jest.fn().mockResolvedValue({
                    rows: [
                        {
                            username: "testuser",
                            id: 1,
                            password: "hashedPassword",
                        },
                    ],
                }),
                release: jest.fn(),
            }));

            const response = await request(app)
                .post("/auth/login")
                .send({ username: "testuser", password: "testpassword" })
                .expect(c.HTTP_STATUS_OK);

            expect(response.body.data.user.id).toBe(1);
            expect(response.body.data.user.username).toBe("testuser");
            expect(response.headers["set-cookie"]).toBeTruthy();
        });

        it("should return 401 Unauthorized for invalid login credentials", async () => {
            (pool.connect as jest.Mock).mockImplementation(() => ({
                query: jest.fn().mockResolvedValue({ rows: [] }),
                release: jest.fn(),
            }));

            const response = await request(app)
                .post("/auth/login")
                .send({ username: "nonexistentuser", password: "invalidpassword" })
                .expect(c.HTTP_STATUS_UNAUTHORIZED);

            expect(response.body.data).toBeFalsy();
            expect(response.headers["set-cookie"]).toBeFalsy();
        });

        it("should return 500 Internal Server Error for database errors", async () => {
            (pool.connect as jest.Mock).mockImplementation(() => ({
                query: jest.fn().mockRejectedValue(new Error("Database error")),
                release: jest.fn(),
            }));

            await request(app)
                .post("/auth/login")
                .send({ username: "testuser", password: "testpassword" })
                .expect(c.HTTP_STATUS_INTERNAL_SERVER_ERROR);

            expect(consoleErrorSpy).toHaveBeenCalledWith("Database error");
            consoleErrorSpy.mockRestore();
        });
    });
});
