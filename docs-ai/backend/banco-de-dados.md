# 05 — Banco de dados

PostgreSQL 16, acessado por `pg` com SQL puro. Schema evolui por **migrations SQL numeradas** em `back-end/src/database/migrations/`.

## Tabelas implementadas

### `users`
| Coluna | Tipo | Notas |
|---|---|---|
| `user_id` | SERIAL PK | |
| `name` | VARCHAR(150) NOT NULL | |
| `email` | VARCHAR(255) NOT NULL UNIQUE | índice `idx_users_email`; normalizado `LOWER(TRIM())` no seed |
| `password` | VARCHAR(255) NOT NULL | hash bcrypt |
| `salt` | VARCHAR(255) NOT NULL | |
| `role` | VARCHAR(20) NOT NULL DEFAULT `'user'` | `admin` ou `user` (migration 002) |
| `created_at`, `updated_at` | TIMESTAMPTZ DEFAULT NOW() | |

### `screens` — telas/itens de menu
| Coluna | Tipo |
|---|---|
| `screen_id` | SERIAL PK |
| `name` | VARCHAR(150) NOT NULL UNIQUE |
| `icon` | VARCHAR(100) NOT NULL (nome do Material Icon) |
| `redirect` | VARCHAR(255) NOT NULL (rota do front) |
| `created_at`, `updated_at` | TIMESTAMPTZ |

Telas iniciais (migration 001): `Dashboard` (`/dashboard`), `Produtos` (`/products`), `Fornecedores` (`/suppliers`), `Movimentações` (`/movements`), `Usuários` (`/users`).

### `users_screens` — N:N usuário ↔ tela
`user_id` FK → users (CASCADE), `screen_id` FK → screens (CASCADE), `created_at`, PK composta `(user_id, screen_id)`.

### `logs_login`
`log_id` SERIAL PK, `user_id` FK → users (CASCADE), `date_time_login` TIMESTAMPTZ DEFAULT NOW().

### `products`
| Coluna | Tipo |
|---|---|
| `product_id` | SERIAL PK |
| `name` | VARCHAR(150) NOT NULL |
| `quantity` | INTEGER NOT NULL |
| `unit` | VARCHAR(20) |
| `unit_price` | DECIMAL(10,2) |
| `category` | VARCHAR(100) (índice) |
| `expiration_date` | DATE |
| `product_image` | TEXT |
| `created_at`, `updated_at` | TIMESTAMPTZ |

### `suppliers` (branch `suppliers/backend`)
`supplier_id` SERIAL PK, `name` VARCHAR(150), `contact` VARCHAR(20), `cnpj` VARCHAR(20), `category` VARCHAR(100) (índice) — todos NOT NULL — + timestamps.

### `movements` (branch `movements/backend`)
`movement_id` SERIAL PK, `quantity` INTEGER NOT NULL, `direction` VARCHAR(20) NOT NULL (`in`/`out`), `status` VARCHAR(50), `user_id` FK → users (CASCADE), `product_id` FK → products (CASCADE), timestamps. Índices em `user_id` e `product_id`.

## Migrations existentes

| Arquivo | Branch | O que faz |
|---|---|---|
| `001_init.sql` | users/backend | users, screens, users_screens + telas iniciais |
| `002_add_user_role.sql` | users/backend | coluna `role`; promove `ADMIN_EMAIL` a admin |
| `003_seed_test_user.sql` | users/backend | usuário `teste@teste.com` com tela Dashboard |
| `004_create_logs_login.sql` | users/backend | tabela `logs_login` |
| `005_create_products.sql` | products/backend | tabela `products` |
| `006_seed_products.sql` | products/backend | 8 produtos de exemplo |
| `007_create_supliers.sql` | suppliers/backend | tabela `suppliers` (nome do arquivo com typo "supliers") |
| `008_seed_suppliers.sql` | suppliers/backend | 3 fornecedores de exemplo |
| `007_create_movements.sql` | movements/backend | tabela `movements` |

> ⚠️ **Conflito de numeração**: há dois `007`. Ao integrar as branches, renomeie `007_create_movements.sql` para o próximo número livre (ex.: `009_create_movements.sql`). Como as migrations rodam em ordem alfabética, a ordem importa quando houver FKs entre tabelas.

## Regras para novas migrations

1. Nome `NNN_descricao_em_ingles.sql`, com o **próximo número livre** considerando todas as branches.
2. **Nunca edite** uma migration já existente — crie outra.
3. **Devem ser idempotentes**: `runMigrations.js` não tem tabela de controle e roda **todos** os arquivos a cada boot. Use `CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`, `ON CONFLICT DO NOTHING` ou `WHERE NOT EXISTS` em seeds.
4. PK `SERIAL` com nome `<entidade>_id`; tabelas no plural, snake_case.
5. `created_at`/`updated_at` como `TIMESTAMPTZ NOT NULL DEFAULT NOW()`.
6. FKs com `ON DELETE` explícito e índice na coluna FK.
7. Sem dados sensíveis reais em seeds.
8. Execução manual: `npm run migrate` (`node src/database/runMigrations.js`).

> O `docker-compose.yml` também monta `migrations/` em `/docker-entrypoint-initdb.d`, então o Postgres executa os `.sql` na criação do volume — mais um motivo para manter tudo idempotente. A migration 002 depende de `app.admin_email`, definido apenas pelo `runMigrations.js`.

## Seeds (`seed.js`)

Rodam a cada boot, de forma idempotente:

- **Admin**: `ADMIN_EMAIL` / `ADMIN_PASSWORD` (padrão `admin@admin.com` / `Admin@123`), `role = admin`, acesso a **todas** as telas.
- **Usuário de teste**: `teste@teste.com` / `Teste@123`, `role = user`, acesso só ao Dashboard.

## Modelo planejado (diagrama `assets/estoque-diagram.drawio.png`)

O diagrama ER (com nomes em português) descreve o modelo-alvo. Mapeamento e itens **ainda não implementados**:

| Diagrama | Implementação | Situação |
|---|---|---|
| `usuario` | `users` | ok (+ `role`) |
| `telas` | `screens` | ok |
| `usuario_tela` | `users_screens` | ok |
| `logsLogin` | `logs_login` | ok |
| `produto` | `products` | falta `supplier_id` FK → `suppliers` |
| `fornecedor` | `suppliers` | ok |
| `movimentacao` (`entradaSaida`) | `movements` (`direction`) | ok |
| `logsAcaoUsuario` (acao, entidade, idEntidade, dataHora, idUsuario) | — | **não implementado** (auditoria) |
| `formaPagamento` (pix, boleto, crédito, débito) | — | **não implementado** |
| `fornecedor_forma_pagamento` (N:N) | — | **não implementado** |

Ao implementar essas tabelas, use os nomes em inglês e snake_case seguindo o padrão atual (ex.: `user_action_logs`, `payment_methods`, `suppliers_payment_methods`).
