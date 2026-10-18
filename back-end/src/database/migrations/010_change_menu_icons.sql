BEGIN;

UPDATE screens SET icon = 'bar_chart_4_bars', updated_at = NOW() WHERE name = 'Dashboard';
UPDATE screens SET icon = 'inventory_2',      updated_at = NOW() WHERE name = 'Produtos';
UPDATE screens SET icon = 'warehouse',        updated_at = NOW() WHERE name = 'Fornecedores';
UPDATE screens SET icon = 'compare_arrows',   updated_at = NOW() WHERE name = 'Movimentações';
UPDATE screens SET icon = 'groups',           updated_at = NOW() WHERE name = 'Usuários';

COMMIT;