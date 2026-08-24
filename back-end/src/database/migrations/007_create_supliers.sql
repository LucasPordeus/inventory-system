CREATE TABLE IF NOT EXISTS suppliers (
    supplier_id       SERIAL PRIMARY KEY,
    name              VARCHAR(150) NOT NULL,
    contact           VARCHAR(20) NOT NULL,  
    cnpj              VARCHAR(20) NOT NULL,
    category          VARCHAR(100) NOT NULL,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_suppliers_category ON suppliers (category); 