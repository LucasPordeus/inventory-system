# Status e pendências

Situação em **18/10/2026**. Atualize este arquivo quando algo mudar.

## Pronto

**Back-end**
- Estrutura em camadas, Docker, migrations automáticas, seeds (admin e teste).
- Auth com JWT, logs de login.
- CRUD de usuários, telas, atribuição de telas a usuários.
- CRUD de produtos (`products/backend`).
- CRUD de fornecedores (`suppliers/backend`).
- CRUD de movimentações (`movements/backend`).
- Swagger.

**Front-end**
- Login, guard, layout, menu lateral dinâmico a partir das telas do usuário, logout.
- Página de erro, seletor de idioma pt/en com bandeiras.
- Tela de Produtos: grade/lista, ordenação A-Z/Z-A, paginação (dados **mockados** no componente).

## A fazer

**Integração**
- [ ] Juntar as branches `*/backend` em `dev` (resolver conflitos da migration `003` e de `validationSchemas.js`, `routes/index.js`, `swagger.js`).
- [ ] Juntar as branches `*/frontend` em `dev`.

**Back-end**
- [ ] Autorização por tela: a API deve checar `users_screens` em cada módulo; ter a tela libera o CRUD completo (ver `geral/autenticacao-e-permissoes.md`).
- [ ] `products.supplier_id` (FK para `suppliers`) — previsto no diagrama e no modal de produto.
- [ ] Movimentação atualizar `products.quantity` em transação e impedir saída maior que o estoque.
- [ ] Usar `req.user.userId` como autor da movimentação em vez de receber `userId` no body.
- [ ] Tabela de log de ações (`logsAcaoUsuario` no diagrama).
- [ ] Formas de pagamento e relação fornecedor × forma de pagamento.
- [ ] Endpoints de agregação para o Dashboard (totais, valor por categoria, fluxo entrada/saída, itens perto da validade).
- [ ] Filtros/paginação/busca no servidor para `GET /products` (categoria, fornecedor, status, validade).
- [ ] Testes automatizados (`npm test` ainda é placeholder).
- [ ] Controle de migrations executadas (hoje todas rodam a cada boot).

**Front-end**
- [ ] Interceptor HTTP com token e tratamento de 401.
- [ ] Centralizar URL da API (environment).
- [ ] Produtos: consumir `GET /api/products`, implementar filtros, modal "Novo Produto", visualizar/editar/excluir.
- [ ] Telas: Dashboard, Fornecedores, Movimentações, Usuários.
- [ ] Botão "Cadastrar", ícone de exportar e chatbot do layout.
- [ ] Redirecionar após login para a primeira tela permitida.
- [ ] Menu usar `routerLink` em vez de `href` (hoje recarrega a página).
- [ ] Traduzir textos ainda fixos (títulos da tela de produtos, mensagens de erro do menu, página de erro).

## Problemas conhecidos

| Problema | Onde |
|---|---|
| Duas migrations `003_*` (`003_seed_test_user` × `003_change_menu_icons`) | branches `*/backend` × `products/frontend` |
| Diferenças entre o diagrama ER e as tabelas (tamanhos, obrigatoriedade, `products.supplier_id` ausente) | ver `backend/banco-de-dados.md` |
| Typo no nome do arquivo `007_create_supliers.sql` | `suppliers/backend` |
| Usuário de teste criado duas vezes (migration 003 e `seed.js`) — sem erro, mas redundante | back-end |
| `CORS_ORIGIN` padrão `5173`, front roda em `4200` | `config/env.js` |
| Body limitado a 10kb — imagem base64 em `product_image` vai falhar | `app.js` |
| README antigo diz que `POST /users` é público; no código exige admin | `back-end/README.md` |
| Chave de tradução `errorr` (typo) | `public/translation/*.json` |
| `README.md` do back-end na `dev` é o README do Express, não do projeto | `dev` |
| Docs em `AI/` (branch `products/frontend`) descrevem `try/catch` em controllers e registro de rotas em `app.js` — incorreto | `products/frontend` |
