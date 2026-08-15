CREATE TABLE IF NOT EXISTS movements (
    movement_id   SERIAL PRIMARY KEY,
    quantity       INTEGER NOT NULL,
    direction       VARCHAR(20) NOT NULL,
    status           VARCHAR(50),
    user_id           INTEGER NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    product_id        INTEGER NOT NULL REFERENCES products (product_id) ON DELETE CASCADE,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_movements_user_id ON movements (user_id);
CREATE INDEX IF NOT EXISTS idx_movements_product_id ON movements (product_id);
