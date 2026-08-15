INSERT INTO products (name, quantity, unit, unit_price, category, expiration_date)
SELECT v.name, v.quantity, v.unit, v.unit_price, v.category, v.expiration_date
FROM (
    VALUES
        ('Arroz Branco',         100, 'kg',  25.90, 'Grãos',      '2027-06-30'::date),
        ('Feijão Carioca',        80, 'kg',  22.50, 'Grãos',      '2027-05-15'::date),
        ('Açúcar Refinado',       60, 'kg',  18.75, 'Mercearia',  '2027-08-20'::date),
        ('Óleo de Soja',          50, 'un',   9.99, 'Mercearia',  '2026-12-10'::date),
        ('Café Torrado e Moído',  40, 'kg',  32.00, 'Mercearia',  '2026-11-05'::date),
        ('Leite Integral',       120, 'un',   6.49, 'Laticínios', '2026-09-25'::date),
        ('Detergente Neutro',     70, 'un',   3.20, 'Limpeza',    NULL),
        ('Papel Higiênico',       90, 'pct', 15.90, 'Higiene',    NULL)
) AS v(name, quantity, unit, unit_price, category, expiration_date)
WHERE NOT EXISTS (
    SELECT 1 FROM products p WHERE p.name = v.name
);
