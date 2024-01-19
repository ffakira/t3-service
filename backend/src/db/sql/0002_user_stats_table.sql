CREATE TABLE IF NOT EXISTS user_stats (
    id SERIAL PRIMARY KEY,
    user_id SERIAL REFERENCES users(id);
    total_matches INTEGER DEFAULT 0,
    win_pvp INTEGER DEFAULT 0,
    loose_pvp INTEGER DEFAULT 0,
    win_streak_pvp INTEGER DEFAULT 0,
    loose_bot INTEGER DEFAULT 0,
    tie_bot INTEGER DEFAULT 0,
    win_streak_bot INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT NULL
);
