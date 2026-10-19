# Repositório e branches

## Estrutura do repositório (monorepo)

```
inventory-system/
├── README.md
├── back-end/          # API Express (ver backend/arquitetura.md)
├── front-end/         # App Angular (ver frontend/arquitetura.md)
└── docs-ai/           # Esta documentação
```

Front e back são projetos independentes, cada um com seu `package.json` e `node_modules`.

## Estratégia de branches

- `main` — branch estável, recebe merges via Pull Request vindos de `dev`.
- `dev` — branch de integração. **Contém o sistema integrado**: back-end completo (auth, usuários, telas, produtos, fornecedores, movimentações) e front-end da `products/frontend` (menu opção 2, login, produtos).
- Branches de feature seguem o padrão **`<modulo>/<camada>`** (ex.: `products/backend`, `login/frontend`) e são criadas a partir de `dev`.

## O que existe em cada branch

| Branch | Conteúdo |
|---|---|
| `main` | Configuração inicial dos projetos Angular e Express. |
| `dev` | **Integração de tudo** (18/10/2026): merge de `products/frontend`, `suppliers/backend` e `movements/backend`. Migrations 001–010. Use esta branch como base para novas features. |
| `menu/frontend` | Variação "opção 1" do estilo do menu (grid de teste). **Descartada** — não foi integrada à `dev`. |
| `menu/frontend-option2` | Menu "opção 2" (**menu oficial**) + login inicial, logout, guard, página de erro, layout, i18n. |
| `login/frontend` | Tela de login completa, `AuthService`, `authGuard`, `Layout`, `Error`, `TranslationSelector` (com bandeiras). |
| `products/frontend` | **Front-end mais completo**: tudo de `login/frontend` + tela de Produtos (grid/lista, ordenação A-Z/Z-A, paginação), componentes `product` e `filters`. Contém a pasta `AI/` (docs antigas), que foi removida na `dev`. |
| `users/backend` | Back-end base: Express em camadas, Docker, migrations 001–004, auth, usuários, telas, logs de login, Swagger, `ARCHITECTURE.md`. |
| `products/backend` | `users/backend` + CRUD de produtos (migrations 005–006). |
| `suppliers/backend` | `products/backend` + CRUD de fornecedores (migrations `007_create_supliers.sql`, `008_seed_suppliers.sql`). |
| `movements/backend` | `products/backend` + CRUD de movimentações (migration `009_create_movements.sql`, renumerada de `007` para não conflitar com a de fornecedores). |

Hierarquia de origem do back-end:

```
users/backend
   └── products/backend
          ├── suppliers/backend
          └── movements/backend
```

> Conflitos de numeração resolvidos: a migration de movimentações agora é `009_create_movements.sql` (era `007`, igual à de fornecedores) e a de ícones do menu na `products/frontend` agora é `010_change_menu_icons.sql` (era `003`, igual à `003_seed_test_user.sql`). Ver `backend/banco-de-dados.md`.

## Documentação legada em outras branches

- `back-end/README.md` e `back-end/ARCHITECTURE.md` (branches `*/backend`) — instruções de execução e arquitetura da API. O conteúdo foi incorporado aqui.
- `AI/agents/*.md` e `AI/skills/*.md` (só na branch `products/frontend`; **removida da `dev`**) — versão anterior de docs para IA, com imprecisões (ex.: diz que controllers usam `try/catch` e que rotas são registradas em `app.js`; no código real é `asyncHandler` e `routes/index.js`). Use apenas esta pasta `docs-ai/`.

## Como pegar algo de outra branch

```bash
# trazer só uma pasta/arquivo de outra branch para a branch atual
git checkout <branch-origem> -- caminho/da/pasta
# exemplo: trazer o back-end completo de movimentações
git checkout origin/movements/backend -- back-end/
```

## Como rodar

**Back-end** (na `dev` ou em uma branch `*/backend`):

```bash
cd back-end
cp .example.env .env      # ajuste DB_PASSWORD, JWT_SECRET, ADMIN_PASSWORD (o antigo .exemple.env foi removido)
docker-compose up --build # sobe postgres + api
# ou localmente, com PostgreSQL rodando e DB_HOST=localhost:
npm install && npm start
```

Na subida, `server.js` roda as migrations e o seed automaticamente.

**Front-end**:

```bash
cd front-end
npm install
npm start   # ng serve → http://localhost:4200
npm test    # Vitest
```
