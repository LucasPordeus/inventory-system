# 04 — API REST (endpoints)

Base: `http://localhost:3000/api`. Todas as respostas são JSON. Endpoints protegidos exigem:

```
Authorization: Bearer <token>
```

Formato de erro (qualquer endpoint):

```json
{ "status": "error", "message": "Product not found" }
```

Códigos usados: `200`, `201`, `204`, `401` (sem token / token inválido / credenciais), `403` (sem permissão), `404`, `409` (duplicado), `422` (validação Joi), `429` (rate limit), `500`.

Corpo das requisições em **camelCase**; respostas em **snake_case** (colunas do banco).

## Health

| Método | Rota | Auth | Resposta |
|---|---|---|---|
| GET | `/health` | — | `{ "status": "ok" }` |

## Auth — `/auth` (branch `users/backend` em diante)

| Método | Rota | Auth | Body |
|---|---|---|---|
| POST | `/auth/login` | — | `{ email, password }` |

Resposta `200`:

```json
{
  "token": "<jwt>",
  "user": { "user_id": 1, "name": "Admin", "email": "admin@admin.com" },
  "screens": [
    { "screen_id": 1, "name": "Dashboard", "icon": "dashboard", "redirect": "/dashboard" }
  ]
}
```

Grava uma linha em `logs_login`. Credenciais erradas → `401 Invalid credentials`. Observação: `role` **não** vem no objeto `user` (só dentro do JWT).

## Usuários — `/users`

Todas exigem token.

| Método | Rota | Permissão | Body |
|---|---|---|---|
| GET | `/users/me` | autenticado | — → `{ user, screens }` |
| GET | `/users` | admin | — |
| POST | `/users` | admin | `{ name, email, password, role?, screenIds? }` |
| GET | `/users/:id` | admin ou o próprio | — |
| PUT | `/users/:id` | admin ou o próprio | `{ name?, email? }` (mín. 1) |
| DELETE | `/users/:id` | admin | — → `204` |
| GET | `/users/:id/screens` | admin | — |
| PUT | `/users/:id/screens` | admin | `{ screenIds: number[] }` (substitui todas) |

Regras: `name` 2–150; `email` válido ≤255 e único (`409 Email already registered`); `password` 8–72 com maiúscula, minúscula e número; `role` ∈ `admin|user` (padrão `user`).

> O README antigo diz que `POST /users` é público — no código ele exige **admin**.

## Telas — `/screens`

| Método | Rota | Permissão | Body |
|---|---|---|---|
| GET | `/screens` | autenticado | — |
| GET | `/screens/:id` | autenticado | — |
| POST | `/screens` | admin | `{ name, icon, redirect }` |
| PUT | `/screens/:id` | admin | `{ name?, icon?, redirect? }` |
| DELETE | `/screens/:id` | admin | — |

`name` único (`409 Screen name already exists`). `icon` é nome de ícone Material; `redirect` é a rota do front (ex.: `/products`).

## Produtos — `/products` (branch `products/backend` em diante)

Qualquer usuário autenticado.

| Método | Rota | Body |
|---|---|---|
| GET | `/products` | — |
| GET | `/products/:id` | — |
| POST | `/products` | ver abaixo |
| PUT | `/products/:id` | mesmos campos, todos opcionais (mín. 1) |
| DELETE | `/products/:id` | — |

Body de criação:

| Campo | Regra |
|---|---|
| `name` | string 1–150, obrigatório |
| `quantity` | inteiro ≥ 0, obrigatório |
| `unit` | string ≤ 20, opcional (`kg`, `un`, `pct`...) |
| `unitPrice` | número ≥ 0, 2 casas, opcional |
| `category` | string ≤ 100, opcional |
| `expirationDate` | data ISO, opcional |
| `productImage` | string (URL/base64), opcional |

Resposta: `product_id, name, quantity, unit, unit_price, category, expiration_date, product_image`.

## Fornecedores — `/suppliers` (branch `suppliers/backend`)

Qualquer usuário autenticado. Mesmo padrão CRUD de produtos.

| Campo (create) | Regra |
|---|---|
| `name` | string 1–150, obrigatório |
| `contact` | string ≤ 20, obrigatório (telefone, ex.: `(92)98123-4567`) |
| `cnpj` | string ≤ 20, obrigatório (ex.: `12.345.678/0001-90`) |
| `category` | string ≤ 100, obrigatório |

Resposta: `supplier_id, name, contact, cnpj, category`.

## Movimentações — `/movements` (branch `movements/backend`)

Qualquer usuário autenticado. Mesmo padrão CRUD.

| Campo (create) | Regra |
|---|---|
| `quantity` | inteiro ≥ 1, obrigatório |
| `direction` | `in` (entrada) ou `out` (saída), obrigatório |
| `status` | string ≤ 50, opcional |
| `userId` | inteiro positivo, obrigatório (deve existir → senão `404 User not found`) |
| `productId` | inteiro positivo, obrigatório (deve existir → senão `404 Product not found`) |

Update aceita só `quantity`, `direction`, `status`.
Resposta: `movement_id, quantity, direction, status, user_id, product_id, created_at`.

> Hoje a movimentação **não altera** `products.quantity` nem valida estoque insuficiente. Ver `geral/status-e-pendencias.md`.

## Documentação interativa

Swagger em `http://localhost:3000/api/docs` (fora de produção), definido manualmente em `src/config/swagger.js`.
