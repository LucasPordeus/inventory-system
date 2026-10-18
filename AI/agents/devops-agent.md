# DevOps Agent

Agente especializado em infraestrutura, containerização e deploy do sistema StoCat.

## Tecnologias

- **Containerização:** Docker + Docker Compose
- **Banco de Dados:** PostgreSQL 16 (Alpine)
- **Backend:** Node.js 20 (Alpine)
- **Frontend:** Angular (build estático)

## Serviços Docker Compose

| Serviço | Imagem | Porta | Descrição |
|---------|--------|-------|-----------|
| `postgres` | `postgres:16-alpine` | 5432 | Banco de dados PostgreSQL |
| `api` | `node:20-alpine` | 3000 | Backend Express |

## Variáveis de Ambiente

Arquivo `.env` (baseado em `.exemple.env`):

- `POSTGRES_USER` - Usuário do PostgreSQL
- `POSTGRES_PASSWORD` - Senha do PostgreSQL
- `POSTGRES_DB` - Nome do banco
- `DB_HOST` - Host do banco (default: postgres)
- `DB_PORT` - Porta do banco (default: 5432)
- `JWT_SECRET` - Segredo para JWT
- `JWT_EXPIRATION` - Tempo de expiração do JWT
- `PORT` - Porta do servidor (default: 3000)
- `NODE_ENV` - Ambiente (development/production)

## Convenções

- Health checks configurados para ambos serviços
- Volume nomeado para persistência do PostgreSQL
- Migrations executadas automaticamente na inicialização
- Seed cria usuário admin automaticamente
- Graceful shutdown com handler para SIGTERM/SIGINT
- `.dockerignore` para excluir node_modules e arquivos desnecessários

## Estrutura

```
back-end/
  Dockerfile              -- Build do container backend
  docker-compose.yml      -- Orquestração dos serviços
  .dockerignore           -- Arquivos excluídos do build
  .env                    -- Variáveis de ambiente
  .exemple.env            -- Template de variáveis
```

## Regras

1. Nunca expor credenciais em arquivos commitados
2. Usar variáveis de ambiente para configuração
3. Health checks devem estar configurados para todos serviços
4. Usar volumes nomeados para persistência de dados
5. Imagens devem basear em Alpine para menor tamanho
6. Rate limiting deve ser configurado para proteção da API
7. CORS deve ser configurado adequadamente
8. Logs devem ser estruturados (Morgan)
