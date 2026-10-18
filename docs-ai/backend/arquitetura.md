# Arquitetura do back-end

API REST em **Node.js 20 + Express 5**, **CommonJS** (`require`/`module.exports`), arquitetura em camadas, PostgreSQL via `pg` com SQL puro.

## Fluxo de uma requisição

```
HTTP
 → app.js            middlewares globais (helmet, cors, compression, json, morgan, rate limit, swagger)
 → routes/index.js   monta tudo em /api
 → routes/xRoutes.js authMiddleware + adminMiddleware/selfOrAdmin + validationMiddleware + asyncHandler
 → controllers/      lê req, chama service, devolve res.status().json()
 → services/         regra de negócio, lança AppError
 → repositories/     única camada com SQL
 → PostgreSQL
```

Cada camada só conhece a camada logo abaixo. Controllers nunca acessam o banco; repositories nunca têm regra de negócio.

## Estrutura de pastas (`back-end/`)

```
back-end/
├── Dockerfile, docker-compose.yml, .dockerignore
├── .example.env              # template de variáveis
├── package.json              # scripts: start, migrate
└── src/
    ├── app.js                # configura o Express
    ├── server.js             # boot: migrations → seed → listen; graceful shutdown
    ├── config/
    │   ├── env.js            # lê .env, valida obrigatórias, exporta objeto congelado
    │   ├── database.js       # Pool pg; exporta { pool, query, getClient }
    │   └── swagger.js        # spec OpenAPI escrita à mão
    ├── routes/               # index.js + <recurso>Routes.js
    ├── controllers/          # <recurso>Controller.js
    ├── services/             # <recurso>Service.js
    ├── repositories/         # <recurso>Repository.js
    ├── middlewares/
    │   ├── authMiddleware.js
    │   ├── adminMiddleware.js
    │   ├── selfOrAdminMiddleware.js
    │   ├── validationMiddleware.js
    │   ├── validationSchemas.js   # todos os schemas Joi
    │   ├── asyncHandler.js
    │   └── errorMiddleware.js
    ├── errors/appError.js
    ├── utils/
    │   ├── jwtHelper.js       # sign/verify HS256
    │   └── passwordHelper.js  # bcrypt genSalt/hash/compare
    └── database/
        ├── migrations/        # NNN_descricao.sql
        ├── runMigrations.js
        └── seed.js            # admin + usuário de teste
```

## Padrões obrigatórios (como o código realmente é)

### Singletons de classe

Controllers, services e repositories são **classes exportadas como instância**:

```js
class ProductService { /* ... */ }
module.exports = new ProductService();
```

Helpers (`JwtHelper`, `PasswordHelper`) são classes com **métodos estáticos** exportadas sem `new`.

### Rotas

```js
const router = Router();
router.use(authMiddleware);               // protege o router inteiro

router.get('/', asyncHandler((req, res) => productController.list(req, res)));
router.post(
  '/',
  validationMiddleware(createProductSchema),
  asyncHandler((req, res) => productController.create(req, res))
);
```

- Handlers sempre embrulhados em `asyncHandler((req, res) => controller.metodo(req, res))` (arrow function para preservar o `this`).
- Novos routers são registrados em **`routes/index.js`** (`router.use('/products', productRoutes)`), não em `app.js`.

### Controllers

- **Sem `try/catch`** — o `asyncHandler` encaminha erros para o `errorMiddleware`.
- Convertem `req.params.id` com `Number(...)`.
- Nomes de métodos: `create`, `list`, `getById`, `update`, `remove`.
- Status: `201` no create, `200` em list/get/update, `204` (`res.status(204).send()`) no remove.

### Services

- Nomes de métodos: `create<Recurso>`, `list<Recurso>s`, `get<Recurso>ById`, `update<Recurso>`, `delete<Recurso>`.
- Lançam `new AppError('<Recurso> not found', 404)` quando o repository retorna `null`/`false`.
- Conflitos: `AppError('... already exists' | 'Email already registered', 409)`.
- Validam existência de entidades relacionadas (ex.: movimentação checa usuário e produto).

### Repositories

- Importam `{ query }` (ou `getClient` para transações) de `config/database`.
- SQL parametrizado (`$1, $2...`), nunca concatenação de valores.
- Listam colunas explicitamente (sem `SELECT *`), `ORDER BY <id> ASC` no `findAll`.
- Métodos: `create`, `findById`, `findAll`, `update`, `delete` (+ `findByEmail`, `findByName` quando necessário).
- Retorno: `rows[0] || null` em buscas únicas; `result.rowCount > 0` no `delete`.
- `update` parcial com `COALESCE($n, coluna)` e `updated_at = NOW()`.
- Entrada em **camelCase** (`unitPrice`), colunas e saída em **snake_case** (`unit_price`). A API responde em snake_case.
- Operações multi-query usam transação:

```js
const client = await getClient();
try {
  await client.query('BEGIN');
  // ...
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
}
```

### Validação

- Todos os schemas Joi ficam em `middlewares/validationSchemas.js` e são exportados por nome (`createXSchema`, `updateXSchema`).
- Schemas de update usam `.min(1)` (exige ao menos um campo).
- `validationMiddleware(schema, source = 'body')` usa `abortEarly: false`, `stripUnknown: true` e responde **422** com as mensagens juntadas por `; `.

### Erros

- `AppError(message, statusCode = 400)` para erros esperados.
- `errorMiddleware` responde `{ "status": "error", "message": "..." }`. Erros não-`AppError` viram `500 Internal server error` (log só fora de produção).
- Rota inexistente → `AppError('Route not found', 404)`.
- Mensagens de erro da API são **em inglês**.

## Configuração global (`app.js`)

- `helmet()`, `x-powered-by` desabilitado, `trust proxy = 1`.
- CORS: origem `env.corsOrigin` (padrão `http://localhost:5173`), métodos GET/POST/PUT/DELETE, headers `Content-Type` e `Authorization`.
- Body JSON e urlencoded limitados a **10kb** (atenção ao enviar imagens em base64 em `product_image`).
- Rate limit: geral em `/api` (padrão 100 req / 15 min) e `/api/auth` (20 req / 15 min).
- Swagger em `/api/docs` somente quando `NODE_ENV !== 'production'`. Ao criar endpoints, **atualize `config/swagger.js`**.

## Variáveis de ambiente

| Variável | Obrigatória | Padrão |
|---|---|---|
| `NODE_ENV` | não | `development` |
| `PORT` | não | `3000` |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | **sim** | — (`DB_HOST=postgres` no Docker) |
| `JWT_SECRET` | **sim** | — |
| `JWT_EXPIRATION` | não | `1h` |
| `BCRYPT_SALT_ROUNDS` | não | `12` |
| `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX_REQUESTS` | não | `900000` / `100` |
| `CORS_ORIGIN` | não | `http://localhost:5173` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | não | `admin@admin.com` / `Admin@123` |

`env.js` lança erro na inicialização se faltar variável obrigatória. Nunca acesse `process.env` fora de `config/env.js`.

## Boot (`server.js`)

1. `runMigrations()` — executa **todos** os `.sql` de `migrations/` em ordem alfabética a cada boot (por isso precisam ser idempotentes). Define `app.admin_email` na sessão para a migration 002.
2. `seed()` — cria admin (com todas as telas) e usuário de teste, se não existirem.
3. `app.listen(env.port)`.
4. `SIGTERM`/`SIGINT` → fecha o servidor e o pool.
