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
