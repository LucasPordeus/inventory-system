INSERT INTO supplier (name, contact, cnpj, category)
SELECT v.name, v.contact, v.cnpj, v.category
FROM (
    VALUES
        ('Atack', '(92)98123-4567', '12.345.678/0001-90', 'Alimentício'),
        ('Infostore', '(92)99234-5678', '98.765.432/0001-12', 'Eletrônicos'),
        ('Concorde', '(92)98345-6789', '55.555.555/0001-55', 'Papelaria'),
) AS v(name, contact, cnpj, category)
WHERE NOT EXISTS (
    SELECT 1 FROM supplier p WHERE p.name = v.name
);