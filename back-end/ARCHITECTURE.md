# Arquitetura do Back-end

API REST em Node.js/Express (v5) seguindo uma arquitetura em camadas (**Routes → Controllers → Services → Repositories**), com PostgreSQL como banco de dados via `pg`.

## Fluxo de uma requisição

```
Requisição HTTP
  → app.js (middlewares globais: helmet, cors, rate limit...)
  → routes/*        (define endpoint + middlewares específicos da rota)
  → middlewares/*    (autenticação, autorização, validação)
  → controllers/*    (extrai dados do request, chama o service, monta a resposta)
  → services/*        (regras de negócio, orquestra repositórios)
  → repositories/*     (única camada que fala SQL com o banco)
  → database (PostgreSQL)
```

Cada camada só conhece a camada imediatamente abaixo dela — controllers nunca acessam o banco diretamente, e repositories nunca contêm regra de negócio.

## Estrutura de pastas

```
src/
├── app.js                 # Configuração do Express (middlewares globais, rotas, error handler)
├── server.js               # Ponto de entrada: roda migrations, seed e sobe o servidor HTTP
├── config/
│   ├── env.js               # Carrega e valida variáveis de ambiente (.env)
│   ├── database.js           # Pool de conexões PostgreSQL (pg)
│   └── swagger.js             # Definição da documentação OpenAPI (/api/docs)
├── routes/
│   ├── index.js              # Router raiz, agrega as demais rotas em /api
│   ├── authRoutes.js          # /api/auth
│   ├── userRoutes.js           # /api/users
│   └── screenRoutes.js          # /api/screens
├── controllers/
│   ├── authController.js       # Login
│   ├── userController.js        # CRUD de usuários + telas do usuário
│   └── screenController.js       # CRUD de telas (screens)
├── services/
│   ├── authService.js           # Regra de autenticação (checagem de senha, geração de JWT)
│   ├── userService.js            # Regra de negócio de usuários
│   └── screenService.js           # Regra de negócio de telas
├── repositories/
│   ├── userRepository.js          # Queries SQL da tabela users
│   ├── screenRepository.js         # Queries SQL da tabela screens
│   ├── userScreenRepository.js      # Queries SQL da tabela de junção users_screens
│   └── loginLogRepository.js         # Queries SQL da tabela logs_login
├── middlewares/
│   ├── authMiddleware.js           # Valida o JWT e popula req.user
│   ├── adminMiddleware.js           # Exige req.user.role === 'admin'
│   ├── selfOrAdminMiddleware.js       # Libera se for admin OU o próprio usuário (:id)
│   ├── validationMiddleware.js         # Valida req.body/params com schemas Joi
│   ├── validationSchemas.js             # Schemas Joi (create/update de user, screen, login)
│   ├── errorMiddleware.js                # Handler de erro global (converte AppError em resposta)
│   └── asyncHandler.js                    # Wrapper para capturar erros de async/await e chamar next()
├── errors/
│   └── appError.js                 # Classe de erro customizada (statusCode + mensagem)
├── utils/
│   ├── jwtHelper.js                # Assina/verifica tokens JWT
│   └── passwordHelper.js            # Hash e verificação de senha (bcrypt)
└── database/
    ├── migrations/                 # Scripts SQL versionados (001, 002, 003...)
    ├── runMigrations.js             # Executa as migrations pendentes
    └── seed.js                       # Cria o usuário admin padrão a partir do .env
```

## O que significa cada camada

- **`app.js`**: monta a aplicação Express — segurança (`helmet`), CORS, compressão, parsing de JSON, logging (`morgan`), rate limiting global e específico para `/api/auth`, Swagger (fora de produção) e o error handler final. Não contém lógica de negócio.
- **`server.js`**: processo de boot. Roda as migrations e o seed do admin antes de abrir a porta HTTP, e trata `SIGTERM`/`SIGINT` para desligamento gracioso (fecha o pool do banco antes de sair).
- **`config/`**: tudo que é configuração de ambiente/infraestrutura, sem lógica de domínio. `env.js` falha rápido (`throw`) se faltar variável obrigatória.
- **`routes/`**: só declara o mapeamento `verbo + path → middlewares + controller`. Cada arquivo de rota aplica `authMiddleware` (quando o recurso exige login) e os middlewares de autorização/validação específicos antes do controller.
- **`controllers/`**: tradutores entre HTTP e domínio. Pegam dados de `req`, chamam o service correspondente e devolvem `res.status(...).json(...)`. Não têm `try/catch` porque `asyncHandler` já encaminha exceções para o `errorMiddleware`.
- **`services/`**: onde vive a regra de negócio (ex.: impedir e-mail duplicado, verificar se usuário existe antes de listar telas, orquestrar hash de senha). É a única camada que decide "isso é um erro de negócio" lançando `AppError`.
- **`repositories/`**: acesso direto ao banco via SQL parametrizado (`pg`). Não sabem nada sobre HTTP nem sobre regra de negócio — apenas executam queries e retornam linhas.
- **`middlewares/`**: comportamentos transversais reutilizáveis entre rotas:
  - `authMiddleware` — exige `Authorization: Bearer <token>` válido e popula `req.user`.
  - `adminMiddleware` — exige papel `admin`.
  - `selfOrAdminMiddleware` — libera se `req.user` for admin ou for o dono do recurso (`:id`).
  - `validationMiddleware` — valida `body`/`params` contra um schema Joi (`validationSchemas.js`) antes de chegar no controller.
  - `asyncHandler` — evita repetir `try/catch` em cada controller async.
  - `errorMiddleware` — converte `AppError` em resposta JSON padronizada; qualquer outro erro vira `500` genérico (detalhes só logados fora de produção).
- **`errors/appError.js`**: erro de domínio com `statusCode` (ex.: 404, 409, 422), usado pelos services para sinalizar falhas esperadas (não é bug, é regra de negócio sendo respeitada).
- **`utils/`**: helpers puros e sem estado — geração/verificação de JWT e hash de senha (bcrypt).
- **`database/`**: schema evolutivo via migrations SQL numeradas (executadas em ordem no boot) e um seed idempotente que garante a existência do usuário admin.

## Modelo de dados (resumo)

- **`users`**: `user_id`, `name`, `email` (único), `password`/`salt` (hash), `role` (`user`/`admin`).
- **`screens`**: telas do sistema disponíveis (`name`, `icon`, `redirect`).
- **`users_screens`**: tabela de junção N:N — quais telas cada usuário pode acessar.
- **`logs_login`**: histórico de logins por usuário.

## Autenticação e autorização

1. `POST /api/auth/login` valida credenciais (`authService`) e retorna um JWT.
2. Rotas protegidas usam `authMiddleware`, que valida o token e injeta `req.user = { userId, email, role }`.
3. Autorização é decidida por composição de middlewares na própria rota: `adminMiddleware` (só admin), `selfOrAdminMiddleware` (admin ou dono do recurso), ou nenhum (qualquer usuário autenticado).

## Convenções gerais

- Toda rota autenticada aplica `authMiddleware` no topo do router (`router.use(authMiddleware)`), e autorização/validação são adicionadas por rota conforme necessário.
- Toda query SQL fica isolada em `repositories/`; nenhuma outra camada importa `config/database.js` diretamente.
- Erros de negócio sempre usam `AppError` — nunca `throw new Error(...)` cru dentro de `services/`.
