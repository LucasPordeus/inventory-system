CREATE TABLE IF NOT EXISTS logs_login (
    log_id            SERIAL PRIMARY KEY,
    user_id           INTEGER NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    date_time_login   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_logs_login_user_id ON logs_login (user_id);
