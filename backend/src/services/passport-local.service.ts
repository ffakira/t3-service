/**
 * @dev handles passport local strategy
 * implementation logic
 */

import {
    IStrategyOptionsWithRequest,
    Strategy as LocalStrategy
} from "passport-local";
import passport from "passport";
import bcrypt from "bcrypt";
import { pool } from "../db";

passport.use("local-login", new LocalStrategy(
    async function verify(username, password, cb) {
        const client = await pool.connect();

        try {
            const sqlCheckUser = "SELECT id, password FROM users WHERE username = $1 LIMIT 1";
            const resultCheckUser = await client.query(sqlCheckUser, [username]);

            if (resultCheckUser.rows.length === 0) {
                return cb(null, false, { message: "Invalid username or password" });
            } else {
                const comparePassword = await bcrypt.compare(password, resultCheckUser.rows[0].password);
                if (comparePassword) {
                    return cb(null, {id: resultCheckUser.rows[0].id});
                } else {
                    return cb(null, false, { message: "Invalid username or password" });
                }
            }
        } catch (err) {
            return cb(err);
        } finally {
            client.release();
        }
    }
));

const opts: IStrategyOptionsWithRequest = {
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
};

passport.use("local-register", new LocalStrategy(opts, async (req, username: string, password: string, cb) => {
    const client = await pool.connect();
    username = username.trim().toLowerCase();

    try {
        await client.query("BEGIN");

        const sqlCheckUser = "SELECT username FROM users WHERE username = $1 LIMIT 1";
        const resultCheckUser = await client.query(sqlCheckUser, [username]);

        if (resultCheckUser.rows.length > 0) {
            return cb(null, false, { message: "Username already taken" });
        }

        /** @dev Create new user */
        const sqlInsertUser = "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, created_at;";

        const hashPassword = await bcrypt.hash(password, 10);
        if (!hashPassword) {
            return cb(new Error("Error hashing password"));
        }

        const insertUserResult = await client.query(sqlInsertUser, [username, hashPassword]);
        const newUser = insertUserResult.rows[0];

        /** @dev Create new user stats */
        const sqlInsertUserStats = "INSERT INTO user_stats (user_id) VALUES ($1);";
        await client.query(sqlInsertUserStats, [newUser.id]);
        await client.query("COMMIT");

        return cb(null, {
            id: newUser.id,
            username: newUser.username,
            created_at: newUser.created_at
        });

    } catch (err) {
        await client.query("ROLLBACK");
        return cb(err);
    } finally {
        client.release();
    }
}));

passport.serializeUser((user, cb) => {
    process.nextTick(function() {
        //@ts-ignore
        return cb(null, user.id);
    });
});

passport.deserializeUser(async (id: string, done) => {
    const client = await pool.connect();
    try {
        const sqlCheckUserId = "SELECT id, username FROM users WHERE id = $1";
        const resultCheckUserId = await client.query(sqlCheckUserId, [id]);

        if (resultCheckUserId.rows.length === 0) {
            return done(new Error("User not found"));
        } else {
            const user = resultCheckUserId.rows[0];
            return done(null, user);
        }
    } catch (err) {
        return done(err);
    } finally {
        client.release();
    }
});

export default passport;
