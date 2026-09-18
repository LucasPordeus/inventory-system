# Database Migration Skill

Workflow para criar migrations no banco de dados do StoCat.

## Fluxo de Trabalho

### 1. Criar Arquivo de Migration

Criar arquivo em `back-end/src/database/migrations/` com formatação:

```
XXX_descricao.sql
```

Onde `XXX` é o próximo número na sequência (ex: `004_add_products_table.sql`).

### 2. Estrutura da Migration

```sql
-- UP: Migração para aplicar
BEGIN;

-- Criar tabela
CREATE TABLE IF NOT EXISTS products (
  product_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER DEFAULT 0,
  min_quantity INTEGER DEFAULT 0,
  supplier_id INTEGER REFERENCES suppliers(supplier_id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_supplier ON products(supplier_id);

-- Dados iniciais (se necessário)
INSERT INTO products (name, category, price, quantity) VALUES
  ('Produto Exemplo', 'Eletrônicos', 99.99, 100);

COMMIT;
```

### 3. Criar Rollback (Opcional mas Recomendado)

```sql
-- DOWN: Rollback
BEGIN;

DROP TABLE IF EXISTS products;

COMMIT;
```

### 4. Executar

As migrations são executadas automaticamente na inicialização do servidor (`runMigrations.js`).

Para executar manualmente:
```bash
node src/database/runMigrations.js
```

## Convenções

- Arquivos numerados em ordem crescente
- Usar transactions (BEGIN/COMMIT) para atomicidade
- PRIMARY keys devemSER SERIAL
- Foreign keys com ON DELETE apropriado (CASCADE, SET NULL, RESTRICT)
- Timestamps com DEFAULT NOW()
- Índices em colunas frequentemente consultadas
- IF NOT EXISTS para idempotência
- Rollback deve ser o inverso da migration

## Tipos de Migration

| Tipo | Exemplo |
|------|---------|
| Criar tabela | `CREATE TABLE IF NOT EXISTS ...` |
| Adicionar coluna | `ALTER TABLE ... ADD COLUMN ...` |
| Remover coluna | `ALTER TABLE ... DROP COLUMN ...` |
| Criar índice | `CREATE INDEX IF NOT EXISTS ...` |
| Inserir dados | `INSERT INTO ... VALUES ...` |
| Atualizar dados | `UPDATE ... SET ... WHERE ...` |
| Remover dados | `DELETE FROM ... WHERE ...` |

## Regras

1. Nunca modificar migrations já executadas
2. Criar nova migration para cada mudança
3. Usar transações para operações DDL
4. Testar rollback antes de produzir
5. Migrations devem ser idempotent (IF NOT EXISTS)
6. Dados sensíveis não devem ser inseridos em migrations
7. Usar tipos de dados apropriados do PostgreSQL
8. Documentar mudanças significativas em comments SQL
