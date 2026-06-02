# Inventory System — Back-end

API REST para gerenciamento de estoque, desenvolvida com Node.js, Express 5 e PostgreSQL.

## Tecnologias

- **Node.js 20** + **Express 5**
- **PostgreSQL 16**
- **JWT** para autenticação
- **bcrypt** para hash de senhas
- **Joi** para validação de entrada
- **Swagger UI** para documentação interativa

---

## Pré-requisitos

| Opção | Requisitos |
|---|---|
| Docker | Docker + Docker Compose |
| Local | Node.js 20+, npm, PostgreSQL 16+ |

---

## Variáveis de ambiente

Copie o arquivo `.env` e ajuste os valores antes de subir o projeto:

```env
# Aplicação
NODE_ENV=development
PORT=3000

# Banco de dados
DB_HOST=localhost        # usar "postgres" no Docker
DB_PORT=5432
DB_NAME=inventory_db
DB_USER=inventory_user
DB_PASSWORD=sua_senha_aqui

# JWT
JWT_SECRET=uma_string_longa_e_aleatoria
JWT_EXPIRATION=1h

# Segurança
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Usuário admin padrão (criado automaticamente na primeira inicialização)
ADMIN_EMAIL=admin@admin.com
ADMIN_PASSWORD=Admin@123
```

> **Atenção:** troque `DB_PASSWORD`, `JWT_SECRET` e `ADMIN_PASSWORD` por valores seguros antes de usar em produção.

---

## Rodando com Docker

A forma mais simples. Sobe a API e o banco juntos, sem precisar instalar nada além do Docker.

**1. Configure o `.env`**

Edite o arquivo `.env` na raiz do projeto e troque os valores de placeholder:

```bash
DB_PASSWORD=sua_senha_forte
JWT_SECRET=sua_chave_jwt_longa
```

**2. Suba os containers**

```bash
docker-compose up --build
```

**3. Aguarde os logs de inicialização**

```
inventory_postgres  | database system is ready to accept connections
inventory_api       | Running migration: 001_init.sql
inventory_api       | Migrations executed successfully
inventory_api       | Seed: admin user created — email: admin@admin.com
inventory_api       | Server running on port 3000 [development]
```

**4. Acesse a API**

- Base URL: `http://localhost:3000/api`
- Documentação: `http://localhost:3000/api/docs`

**Para parar:**

```bash
docker-compose down
```

**Para parar e remover os dados do banco:**

```bash
docker-compose down -v
```

---

## Rodando localmente

Requer PostgreSQL rodando na sua máquina.

**1. Instale as dependências**

```bash
npm install
```

**2. Configure o banco de dados**

Crie o banco e o usuário no PostgreSQL:

```bash
psql -U postgres -c "CREATE DATABASE inventory_db;"
psql -U postgres -c "CREATE USER inventory_user WITH PASSWORD 'sua_senha';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE inventory_db TO inventory_user;"
```

**3. Configure o `.env`**

Edite o arquivo `.env` e certifique-se de que `DB_HOST=localhost`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory_db
DB_USER=inventory_user
DB_PASSWORD=sua_senha
JWT_SECRET=sua_chave_jwt_longa
```

**4. Suba o servidor**

```bash
npm start
```

Na primeira execução, as migrations e o seed rodam automaticamente:

```
Running migration: 001_init.sql
Migrations executed successfully
Seed: admin user created — email: admin@admin.com
Server running on port 3000 [development]
```

**5. Acesse a API**

- Base URL: `http://localhost:3000/api`
- Documentação: `http://localhost:3000/api/docs`

---

## Usuário admin padrão

Na primeira inicialização, um usuário administrador é criado automaticamente com acesso a todas as telas do sistema.

| Campo | Valor padrão |
|---|---|
| E-mail | `admin@admin.com` |
| Senha | `Admin@123` |

As credenciais podem ser alteradas nas variáveis `ADMIN_EMAIL` e `ADMIN_PASSWORD` do `.env` antes da primeira execução.

---

## Endpoints

Todos os endpoints retornam JSON. Os protegidos exigem o header:

```
Authorization: Bearer <token>
```

O token é obtido no endpoint de login.

### Health

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/api/health` | — | Status da API |

### Auth

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/api/auth/login` | — | Login — retorna token, usuário e telas |

### Usuários

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/api/users` | — | Criar usuário |
| GET | `/api/users/me` | Sim | Usuário autenticado + suas telas |
| GET | `/api/users` | Sim | Listar todos os usuários |
| GET | `/api/users/:id` | Sim | Buscar usuário por ID |
| PUT | `/api/users/:id` | Sim | Atualizar nome/e-mail |
| DELETE | `/api/users/:id` | Sim | Deletar usuário |
| GET | `/api/users/:id/screens` | Sim | Listar telas do usuário |
| PUT | `/api/users/:id/screens` | Sim | Substituir telas do usuário |

### Telas

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/api/screens` | Sim | Listar todas as telas |
| POST | `/api/screens` | Sim | Criar tela |
| GET | `/api/screens/:id` | Sim | Buscar tela por ID |
| PUT | `/api/screens/:id` | Sim | Atualizar tela |
| DELETE | `/api/screens/:id` | Sim | Deletar tela |

---

## Documentação interativa

Acesse o Swagger UI para explorar e testar todos os endpoints:

```
http://localhost:3000/api/docs
```

---

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm start` | Sobe o servidor (roda migrations + seed automaticamente) |
| `npm run migrate` | Executa as migrations manualmente |
