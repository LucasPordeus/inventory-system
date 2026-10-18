# 01 — Visão geral

## O que é

**StoCat** é um sistema web de **gestão de estoque** (inventory system). Permite cadastrar produtos, fornecedores, registrar movimentações de entrada/saída e controlar quais telas cada usuário pode acessar. O mascote/identidade visual é um gato numa caixa (estilo pixel art).

Autores: Lucas & Milena.

## Stack

| Camada | Tecnologia |
|---|---|
| Front-end | Angular 21 (standalone components, signals), TypeScript 5.9, Angular Material 21, SCSS, `@ngx-translate` (pt/en), Vitest |
| Back-end | Node.js 20, Express 5 (CommonJS), Joi, JWT (`jsonwebtoken`), bcrypt, helmet, cors, compression, morgan, express-rate-limit, Swagger UI |
| Banco | PostgreSQL 16 via `pg` (SQL puro, **sem ORM**) |
| Infra | Docker + Docker Compose (serviços `postgres` e `api`) |

## Módulos do sistema

| Módulo | Back-end | Front-end |
|---|---|---|
| Autenticação (login) | Pronto | Tela de login pronta |
| Usuários | CRUD pronto | Não iniciado (só item de menu) |
| Telas (screens) / permissões de menu | CRUD pronto | Menu lateral dinâmico pronto |
| Produtos | CRUD pronto | Listagem (grid/lista, ordenação, paginação) com **dados mockados** |
| Fornecedores | CRUD pronto | Não iniciado |
| Movimentações | CRUD básico pronto | Não iniciado |
| Dashboard | — | Não iniciado (só design) |
| Logs de login | Gravado no login | — |
| Internacionalização | — | Seletor pt/en pronto |

Detalhes do que existe em cada branch: `geral/repositorio-e-branches.md`. Pendências: `geral/status-e-pendencias.md`.

## Fluxo principal do usuário

1. Usuário acessa `/login`, informa e-mail e senha.
2. API devolve `token` JWT + dados do usuário + lista de **telas (screens)** que ele pode acessar.
3. Front salva token e telas no `localStorage`, monta o menu lateral com essas telas e navega para `/products`.
4. Cada tela consome a API (`/api/...`) enviando `Authorization: Bearer <token>`.
5. Logout limpa o `localStorage` e volta para `/login`.

## Portas padrão

- API: `http://localhost:3000/api` (Swagger em `http://localhost:3000/api/docs`, fora de produção)
- Front: `http://localhost:4200` (`ng serve`)
- PostgreSQL: `5432`
