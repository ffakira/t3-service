import { Pool, PoolClient } from "pg";
import fs from "node:fs/promises";
import path from "node:path";

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

export class DatabaseManager {
    private pool: Pool;

    constructor () {
        this.pool = new Pool({
            user: process.env.POSTGRES_USER,
            database: process.env.POSTGRES_DB,
            password: process.env.POSTGRES_PASSWORD,
            host: "postgres",
            // host: "localhost"
        });
    }

    async initializeTable () {
        const client = await this.pool.connect();

        try {
            await client.query("BEGIN");

            await this.executeSqlFile(path.resolve(__dirname, "./sql/0001_users_table.sql"), client);
            await this.executeSqlFile(path.resolve(__dirname, "./sql/0002_user_stats_table.sql"), client);
            await this.executeSqlFile(path.resolve(__dirname, "./sql/0003_match_history_table.sql"), client);
            await this.executeSqlFile(path.resolve(__dirname, "./sql/0004_match_table.sql"), client);

            await client.query("COMMIT");
        } catch (err) {
            console.error(`Error initializing database: ${(err as Error).message}`);
            await client.query("ROLLBACK");
        } finally {
            client.release();
        }
    }

    /** @dev get the sql files convert to utf-8 */
    private async executeSqlFile(filePath: string, client: PoolClient) {
        try {
            /** @dev check if file exists and is readable */
            await fs.access(filePath, fs.constants.R_OK);

            if (path.extname(filePath) !== ".sql") {
                console.error("Invalid file type. Expected .sql file");
                await client.query("ROLLBACK");
                return;
            }
        } catch (accessError) {
            console.error(`Error accessing file: ${(accessError as Error).message}`);
            await client.query("ROLLBACK");
            await client.release();
            return;
        }

        try {
            const sqlFileContent = await fs.readFile(filePath, "utf-8");
            const sqlStatements = sqlFileContent.split(";").filter((stmt: string) => stmt.trim() !== "");

            await client.query("BEGIN");

            for (const stmt of sqlStatements) {
                try {
                    await client.query(stmt);
                } catch (queryError) {
                    console.error(`Error execute SQL stmt: ${(queryError as Error).message}`);
                    await client.query("ROLLBACK");
                    client.release();
                    return;
                }
            }

            await client.query("COMMIT");
        } catch (readFileError) {
            console.error(`Error reading file: ${(readFileError as Error).message}`);
            await client.query("ROLLBACK");
        } finally {
            client.release();
        }
    }

    get getPool () {
        return this.pool;
    }
}
