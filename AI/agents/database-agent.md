# Database Agent

Agente especializado no design e gerenciamento do banco de dados PostgreSQL do sistema StoCat.

## Tecnologias

- **Banco:** PostgreSQL 16
- **Driver:** node-postgres (`pg`)
- **Padrão:** SQL direto (sem ORM)

## Schema Atual

### Tabela `users`
| Coluna | Tipo | Constraints |
|--------|------|-------------|
| `user_id` | SERIAL | PRIMARY KEY |
| `name` | VARCHAR | NOT NULL |
| `email` | VARCHAR | UNIQUE, INDEX |
| `password` | VARCHAR | NOT NULL |
| `salt` | VARCHAR | NOT NULL |
| `role` | VARCHAR | DEFAULT 'user' |
| `created_at` | TIMESTAMP | DEFAULT NOW() |
| `updated_at` | TIMESTAMP | DEFAULT NOW() |

### Tabela `screens`
| Coluna | Tipo | Constraints |
|--------|------|-------------|
| `screen_id` | SERIAL | PRIMARY KEY |
| `name` | VARCHAR | UNIQUE |
| `icon` | VARCHAR | Material icon name |
| `redirect` | VARCHAR | URL path |
| `created_at` | TIMESTAMP | DEFAULT NOW() |
| `updated_at` | TIMESTAMP | DEFAULT NOW() |

### Tabela `users_screens`
| Coluna | Tipo | Constraints |
|--------|------|-------------|
| `user_id` | INTEGER | FK → users, COMPOSITE PK |
| `screen_id` | INTEGER | FK → screens, COMPOSITE PK |
| `created_at` | TIMESTAMP | DEFAULT NOW() |

## Migrations

| Arquivo | Descrição |
|---------|-----------|
| `001_init.sql` | Cria tabelas users, screens, users_screens + seed screens |
| `002_add_user_role.sql` | Adiciona coluna role, define admin por email |
| `003_change_menu_icons.sql` | Atualiza nomes dos ícones Material |

## Convenções

- Migrations numeradas em ordem crescente
- Executadas automaticamente na inicialização (`runMigrations.js`)
- Seed cria admin com todas as telas atribuídas
- Transactions para operações multi-query (`BEGIN/COMMIT/ROLLBACK`)
- Emails normalizados via SQL: `LOWER(TRIM(email))`
- Foreign keys com `ON DELETE CASCADE`
- Índices em colunas frequentemente consultadas (email)

## Regras

1. Migrations devem ser reversíveis quando possível
2. Usar transações para operações que modificam múltiplas tabelas
3. Primary keys devem ser SERIAL (auto-increment)
4. Timestamps devem ter DEFAULT NOW()
5. Foreign keys devem ter ON DELETE apropriado
6. Índices devem ser criados para colunas em WHERE/JOIN
7. Senhas armazenadas com hash bcrypt + salt separado
8. Dados sensíveis nunca em logs
