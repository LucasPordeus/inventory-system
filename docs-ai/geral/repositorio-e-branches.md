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
- `dev` — branch de integração. **Nesta branch ainda não há o back-end real** (só um `app.js` de exemplo) e o front-end só tem o menu.
- Branches de feature seguem o padrão **`<modulo>/<camada>`** (ex.: `products/backend`, `login/frontend`) e são criadas a partir de `dev`.

## O que existe em cada branch

| Branch | Conteúdo |
|---|---|
| `main` | Configuração inicial dos projetos Angular e Express. |
| `dev` | Menu lateral (Angular Material sidenav), `MenuService`, `UserService` lendo JSON mock em `assets/services/`. |
| `menu/frontend` | Variação "opção 1" do estilo do menu (grid de teste). |
| `menu/frontend-option2` | Menu "opção 2" + login inicial, logout, guard, página de erro, layout, i18n. |
| `login/frontend` | Tela de login completa, `AuthService`, `authGuard`, `Layout`, `Error`, `TranslationSelector` (com bandeiras). |
| `products/frontend` | **Front-end mais completo**: tudo de `login/frontend` + tela de Produtos (grid/lista, ordenação A-Z/Z-A, paginação), componentes `product` e `filters`, e a pasta `AI/` (agents/skills antigos). |
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
- `AI/agents/*.md` e `AI/skills/*.md` (branch `products/frontend`) — versão anterior de docs para IA. **Contém imprecisões** (ex.: diz que controllers usam `try/catch` e que rotas são registradas em `app.js`; no código real é `asyncHandler` e `routes/index.js`). Prefira esta pasta `docs-ai/`.

## Como pegar algo de outra branch

```bash
# trazer só uma pasta/arquivo de outra branch para a branch atual
git checkout <branch-origem> -- caminho/da/pasta
# exemplo: trazer o back-end completo de movimentações
git checkout origin/movements/backend -- back-end/
```

## Como rodar

**Back-end** (em uma branch `*/backend`):

```bash
cd back-end
cp .example.env .env      # ajuste DB_PASSWORD, JWT_SECRET, ADMIN_PASSWORD
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
