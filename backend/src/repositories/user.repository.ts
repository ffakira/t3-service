import { Pool, PoolClient } from "pg";
import { DatabaseManager } from "../db";
import User from "../models/user.model";

class UserRepository {
    private pool: Pool;

    constructor (databaseManager: DatabaseManager) {
        this.pool = databaseManager.getPool;
    }

    async getUserById(userId: string): Promise<Partial<User> | null> {
        const client: PoolClient = await this.pool.connect();

        try {
            const sqlGetUser = "SELECT id, username FROM users WHERE id = $1;";
            const result = await client.query(sqlGetUser, [userId]);

            if (result.rows.length === 0) return null;
            return result.rows[0] as Partial<User>;

        } catch (err) {
            console.error(`Error getting user id: ${(err as Error).message}`);
            await client.query("ROLLBACK");
            throw err;

        } finally {
            client.release();
        }
    }

    async getUserByUsername(username: string): Promise<Partial<User> | null> {
        const client: PoolClient = await this.pool.connect();

        try {
            const sqlGetUser = "SELECT id, username FROM users WHERE id = $1;";
            const result = await client.query(sqlGetUser, [username]);

            if (result.rows.length === 0) return null;
            return result.rows[0] as Partial<User>;

        } catch (err) {
            console.error(`Error getting username: ${(err as Error).message}`);
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    }

    async insertUser(user: Partial<User>): Promise<Partial<User>> {
        const client: PoolClient = await this.pool.connect();

        try {
            const sqlInsertUser = "INSERT INTO users (username password) VALUES ($1, $2) RETURNING id, username, created_at";
            const result = await client.query(sqlInsertUser, [user.username, user.password]);
            return {
                id: result.rows[0].id,
                username: result.rows[0].username,
                createdAt: result.rows[0].createdAt
            };
        } catch (err) {
            console.error(`Error inserting user: ${(err as Error).message}`);
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    }
}

export default UserRepository;
