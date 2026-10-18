# 08 — Autenticação e permissões

O sistema tem **dois níveis** de controle de acesso:

1. **Role** (`admin` / `user`), no JWT — decide o que a **API** permite.
2. **Telas (screens)** atribuídas ao usuário em `users_screens` — decidem o que aparece no **menu** do front.

## Login (ponta a ponta)

```
Login.login()  (front)
  → UserService.login() → POST /api/auth/login { email, password }
      → validationMiddleware(loginSchema)
      → authService.authenticate()
          - userRepository.findByEmail
          - PasswordHelper.compare (bcrypt)
          - JwtHelper.sign({ userId, email, role })  HS256, expira em JWT_EXPIRATION
          - userScreenRepository.findScreensByUserId
          - loginLogRepository.insert(user_id)
      ← { token, user, screens }
  → localStorage.token = token
  → localStorage.menuItems = JSON(screens); MenuService.setMenuItems(screens)
  → AuthService.setLoggedIn(true)
  → router.navigate(['/products'])
```

## Back-end

### JWT
- Payload: `{ userId, email, role }`. Algoritmo `HS256`, segredo `JWT_SECRET`.
- `JwtHelper.verify` lança `AppError('Token expired', 401)` ou `AppError('Invalid token', 401)`.

### Middlewares de autorização

| Middleware | Comportamento | Erro |
|---|---|---|
| `authMiddleware` | Exige `Authorization: Bearer <token>`; popula `req.user = { userId, email, role }` | 401 |
| `adminMiddleware` | Exige `req.user.role === 'admin'` | 403 `Forbidden` |
| `selfOrAdminMiddleware` | Libera admin ou `req.user.userId === Number(req.params.id)` | 403 `Forbidden` |

Composição na rota:

```js
router.use(authMiddleware);                                    // todo o router exige login
router.get('/', adminMiddleware, asyncHandler(...));           // só admin
router.get('/:id', selfOrAdminMiddleware, asyncHandler(...));  // admin ou o próprio
```

Hoje `products`, `suppliers` e `movements` exigem apenas login (qualquer role pode fazer CRUD). `users` e escrita em `screens` exigem admin.

### Senhas
- bcrypt com `BCRYPT_SALT_ROUNDS` (padrão 12); salt guardado em coluna separada.
- Regra: 8–72 caracteres, com maiúscula, minúscula e número.
- Nunca retornar `password`/`salt` em respostas nem logar tokens/senhas.

### Rate limit
`/api/auth`: 20 requisições / 15 min. Resto de `/api`: `RATE_LIMIT_MAX_REQUESTS` / `RATE_LIMIT_WINDOW_MS`.

## Front-end

- **`authGuard`** (`CanActivateFn`): se `AuthService.isAuthenticated()` (existe `token` no `localStorage`) libera; senão `createUrlTree(['/login'])`. Não valida expiração do token.
- **Menu**: `Menu` assina `MenuService.getMenuItems()`; se vazio mostra "Erro ao carregar os itens do menu" + gif `banana-cat-crying`.
- **Logout** (`Menu.logout()`, hoje acionado ao clicar na foto de perfil): remove `token`, `MenuService.clearMenuItems()` e navega para `/login`.
- **Página de erro** `/error/:code` (401, 403, 404, 500): mostra mensagem e redireciona para `/login` após alguns segundos.

## Usuários padrão

| E-mail | Senha | Role | Telas |
|---|---|---|---|
| `admin@admin.com` (ou `ADMIN_EMAIL`) | `Admin@123` (ou `ADMIN_PASSWORD`) | admin | todas |
| `teste@teste.com` | `Teste@123` | user | Dashboard |

## Lacunas conhecidas

- Não há interceptor HTTP enviando o token nem tratamento global de `401` (redirecionar para login ao expirar).
- O guard não verifica se o usuário tem a tela da rota acessada (só se está logado).
- Após o login sempre vai para `/products` (há `//mudar depois` no código: deveria ir para a primeira tela permitida).
- `role` não é devolvida no objeto `user` do login; para o front saber se é admin, use `GET /users/me` ou inclua `role` na resposta.
