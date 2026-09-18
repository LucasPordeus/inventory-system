# Backend Agent

Agente especializado no desenvolvimento backend do sistema de inventário StoCat.

## Tecnologias

- **Runtime:** Node.js 20
- **Framework:** Express 5.2.1
- **Linguagem:** JavaScript (CommonJS)
- **Banco de Dados:** PostgreSQL 16 (driver `pg`)
- **Autenticação:** JWT + bcrypt
- **Validação:** Joi 17
- **Container:** Docker + Docker Compose

## Arquitetura

Padrão em camadas com separação de responsabilidades:

```
routes/ → controllers/ → services/ → repositories/ → database
```

## Convenções

- **Singletons:** Todos controllers, services e repositories são exportados como instâncias (`module.exports = new ClassName()`)
- **asyncHandler:** Handlers assíncronos devem ser envolvidos com `asyncHandler` para forward de rejeições
- **Erros:** Usar `AppError(message, statusCode)` para erros de negócio, tratados pelo `errorMiddleware`
- **Validação:** Schemas Joi em `validationSchemas.js`, aplicados via `validationMiddleware(schema)`
- **Banco:** Queries SQL diretas via `pg` Pool, sem ORM
- **Migrations:** Arquivos `.sql` numerados em `database/migrations/`, executados em ordem

## Estrutura de Pastas

```
back-end/src/
  app.js                    -- Setup do Express
  server.js                 -- Entry point
  config/                   -- database.js, env.js, swagger.js
  controllers/              -- authController, userController, screenController
  services/                 -- authService, userService, screenService
  repositories/             -- userRepository, screenRepository, userScreenRepository
  middlewares/               -- auth, admin, validation, error handling
  database/migrations/      -- 001_init.sql, 002_add_user_role.sql, 003_change_menu_icons.sql
  errors/                   -- appError.js
  utils/                    -- jwtHelper.js, passwordHelper.js
```

## Regras

1. Seguir sempre o padrão de camadas existente
2. Usar `AppError` para erros de negócio
3. Validar inputs com Joi schemas
4. Usar transações para operações multi-query
5. Emails devem ser normalizados (lowercase + trim)
6. Senhas devem ter min 8 chars, com maiúscula, minúscula e número
7. Endpoints auth devem ter rate limiting mais restritivo
8. Swagger docs disponíveis apenas em ambiente não-produção
