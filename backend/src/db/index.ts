import { Pool } from "pg";

/**
 * @dev if your not using docker change host value
 * from `postgres` to `localhost`
 */
export const pool = new Pool({
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    host: "postgres"
    // host: "localhost"
});

export async function createTable() {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const userTable = `
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE,
                password VARCHAR(255),
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT NULL
            );

            CREATE INDEX IF NOT EXISTS idx_username ON users(username);

            CREATE TABLE IF NOT EXISTS user_stats (
                id SERIAL PRIMARY KEY,
                user_id SERIAL REFERENCES users(id) ON DELETE CASCADE,
                total_matches INTEGER DEFAULT 0,
                win_pvp INTEGER DEFAULT 0,
                loose_pvp INTEGER DEFAULT 0,
                tie_pvp INTEGER DEFAULT 0,
                win_streak_pvp INTEGER DEFAULT 0,
                win_bot INTEGER DEFAULT 0,
                loose_bot INTEGER DEFAULT 0,
                tie_bot INTEGER DEFAULT 0,
                win_streak_bot INTEGER DEFAULT 0,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT NULL
            );

            CREATE TABLE IF NOT EXISTS match (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                user_id SERIAL REFERENCES users(id) ON DELETE CASCADE,
                enemy_id SERIAL REFERENCES users(id) ON DELETE CASCADE,
                game_type VARCHAR(10) CHECK (game_type IN('pvp', 'bot')),
                player_symbol BOOLEAN,
                enemy_symbol BOOLEAN,
                player_turn BOOLEAN,
                win_state VARCHAR(10) CHECK (win_state IN('win', 'loose', 'tie')),
                board_state INTEGER ARRAY[9],
                pending BOOLEAN DEFAULT true,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT NULL,
                CONSTRAINT check_symbols_diff CHECK (player_symbol <> enemy_symbol)
            );

            CREATE INDEX IF NOT EXISTS idx_user_id ON match(user_id);

            CREATE INDEX IF NOT EXISTS idx_enemy_id ON match(enemy_id);

            CREATE TABLE IF NOT EXISTS match_history (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                match_id UUID REFERENCES match(id) ON DELETE CASCADE,
                move_details JSONB,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT NULL
            );
        `;

        await client.query(userTable);
        await client.query("COMMIT");
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("error creating table");
    } finally {
        client.release();
    }
}
