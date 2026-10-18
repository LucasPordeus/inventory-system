CREATE TABLE IF NOT EXISTS products (
    product_id       SERIAL PRIMARY KEY,
    name              VARCHAR(150) NOT NULL,
    quantity          INTEGER NOT NULL,
    unit              VARCHAR(20),
    unit_price        DECIMAL(10,2),
    category          VARCHAR(100),
    expiration_date   DATE,
    product_image     TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
