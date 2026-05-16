CREATE TABLE IF NOT EXISTS users (
    user_id     SERIAL PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    salt        VARCHAR(255) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

CREATE TABLE IF NOT EXISTS screens (
    screen_id   SERIAL PRIMARY KEY,
    name        VARCHAR(150) NOT NULL UNIQUE,
    icon        VARCHAR(100) NOT NULL,
    redirect    VARCHAR(255) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users_screens (
    user_id     INTEGER NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    screen_id   INTEGER NOT NULL REFERENCES screens (screen_id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, screen_id)
);

CREATE INDEX IF NOT EXISTS idx_users_screens_user_id ON users_screens (user_id);
CREATE INDEX IF NOT EXISTS idx_users_screens_screen_id ON users_screens (screen_id);

INSERT INTO screens (name, icon, redirect) VALUES
    ('Dashboard', 'dashboard', '/dashboard'),
    ('Produtos',  'inventory', '/products'),
    ('Fornecedores', 'supplier', '/suppliers'),
    ('Movimentações', 'movements', '/movements'),
    ('Usuários',     'people',    '/users')
ON CONFLICT (name) DO NOTHING;