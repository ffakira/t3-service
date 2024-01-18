import request from "supertest";
import express from "express";
import { constants as c } from "node:http2";
import { pool } from "../db";
import gameRoutes from "../routes/game.route";

// Create an Express app
const app = express();
app.use(express.json());
app.use("/game", gameRoutes);

// Mock the database connection
jest.mock("../db", () => ({
    pool: {
        connect: jest.fn(),
    },
}));

describe("Game Routes", () => {
    beforeAll(() => {
        // Mock necessary database queries or setup
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    describe("GET /game/stats/:player", () => {
        it("should return player stats when a valid player is provided", async () => {
            (pool.connect as jest.Mock).mockImplementation(() => ({
                query: jest.fn().mockResolvedValue({
                    rows: [
                        {
                            total_matches: 10,
                            win_pvp: 5,
                            loose_pvp: 3,
                            tie_pvp: 2,
                            win_bot: 7,
                            loose_bot: 2,
                            tie_bot: 1,
                        },
                    ],
                }),
                release: jest.fn(),
            }));

            const response = await request(app)
                .get("/game/stats/testplayer")
                .expect(c.HTTP_STATUS_OK);

            expect(response.body.status).toEqual(200);
            expect(response.body.data.player).toEqual("testplayer");
            expect(response.body.data.stats).toBeDefined();
            expect(response.body.data.stats.pvp).toEqual({
                win: 5,
                loose: 3,
                tie: 2,
            });
            expect(response.body.data.stats.bot).toEqual({
                win: 7,
                loose: 2,
                tie: 1,
            });
        });

        it("should handle player not found", async () => {
            (pool.connect as jest.Mock).mockImplementation(() => ({
                query: jest.fn().mockResolvedValue({
                    rows: [],
                }),
                release: jest.fn(),
            }));

            const response = await request(app)
                .get("/game/stats/nonexistentplayer")
                .expect(c.HTTP_STATUS_NOT_FOUND);

            expect(response.body.status).toEqual(404);
            expect(response.body.error.message).toEqual("Player not found");
        });
    });
});
