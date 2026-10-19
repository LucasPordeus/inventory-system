# Arquitetura do front-end

Angular **21** com **standalone components** (sem NgModules), TypeScript 5.9, Angular Material 21, SCSS, `@ngx-translate`, testes com Vitest. Código integrado na `dev` (vindo da `products/frontend`, com o menu opção 2).

## Estrutura (`front-end/`)

```
front-end/
├── angular.json, package.json, tsconfig*.json
├── public/
│   ├── icon-web.png
│   └── translation/{pt,en}.json     # arquivos de i18n
└── src/
    ├── index.html                   # fontes, Font Awesome, Material Icons, VLibras, Elfsight
    ├── main.ts
    ├── styles.scss                  # tema Material indigo-pink + fontes + estilos globais
    ├── assets/
    │   ├── images/                  # logo.png, person-profile.png, bandeiras, product-placeholder.svg...
    │   ├── gifs/banana-cat-crying.gif   # exibido quando o menu falha ao carregar
    │   └── services/                # JSON mocks (menu-itens.json, users.json) — legado da dev
    └── app/
        ├── app.ts / app.html        # root: só <router-outlet />
        ├── app.config.ts            # provideRouter, provideHttpClient, provideTranslateService
        ├── app.routes.ts
        ├── guards/auth-guard.ts
        ├── services/
        │   ├── auth.ts              # AuthService
        │   ├── user-service.ts      # UserService (login HTTP)
        │   └── menu-service.ts      # MenuService (itens do menu)
        └── components/
            ├── layout/              # shell: <app-menu> + <router-outlet>
            ├── menu/                # toolbar + sidenav dinâmico + logout
            ├── login/
            ├── error/               # /error/:code com contagem regressiva → /login
            ├── translation-selector/
            ├── products/            # página de produtos
            ├── product/             # card/linha de produto (presentational)
            └── filters/             # barra de filtros (vazia por enquanto)
```

Cada componente fica em sua pasta com `nome.ts`, `nome.html`, `nome.scss`, `nome.spec.ts` (sem sufixo `.component`). A classe tem o nome simples (`Login`, `Menu`, `Products`), seletor `app-<nome>`.

## Rotas (`app.routes.ts`)

| Rota | Componente | Guard |
|---|---|---|
| `''` | `Layout` (com filhos) | `authGuard` |
| `''` → redirect | `products` | |
| `products` | `Products` | (herdado) |
| `login` | `Login` | — |
| `error/:code` | `Error` | — |
| `**` | redirect `error/404` | — |

Novas telas autenticadas entram como **children de `Layout`**, com `path` igual ao `redirect` da tela no banco (`/dashboard`, `/suppliers`, `/movements`, `/users`).

## Serviços

- **`AuthService`** — `BehaviorSubject<boolean>` `isLoggedIn`, `setLoggedIn()`, `isAuthenticated()` (verifica se há `token` no `localStorage`).
- **`UserService`** — `login(email, password)` → `POST http://localhost:3000/api/auth/login`. Interface `User { token, user, screens[] }`.
- **`MenuService`** — converte `Screen { screen_id, name, icon, redirect }` em `MenuItem { label, icon, route }`; carrega `menuItems` do `localStorage` no construtor; `setMenuItems`, `getMenuItems()` (Observable), `clearMenuItems()`.

## Estado e `localStorage`

| Chave | Conteúdo | Quem grava |
|---|---|---|
| `token` | JWT | `Login` |
| `menuItems` | array de screens da API | `Login` |
| `lang` | `pt` ou `en` | `TranslationSelector` |

## Padrões de código

- Componentes **standalone**, importando no array `imports` o que usam (Material modules, `TranslatePipe`, outros componentes).
- **Signals** para estado local (`signal`, `computed`) e `input()` para props de componentes de apresentação — ver `Products` e `Product`.
- **Control flow novo**: `@if`, `@for (...; track ...)`, `@empty`. Não use `*ngIf`/`*ngFor`.
- Serviços com `@Injectable({ providedIn: 'root' })`.
- Guards funcionais (`CanActivateFn`) usando `inject()`; redirecionam com `router.createUrlTree(['/login'])`.
- Injeção: componentes existentes usam injeção via construtor; `inject()` também é aceito (usado nos guards).
- Formulários: template-driven (`FormsModule`, `NgForm`) na tela de login.
- Responsividade: `BreakpointObserver` com `(max-width: 800px)` no menu; media queries em `1194px` nas páginas.
- Classes CSS em **snake_case** (`products_container`, `option_btn`, `error_message_menu`). Mantenha esse padrão.

## Internacionalização

- `provideTranslateService` com loader HTTP em `./translation/*.json`, `fallbackLang: 'pt'`.
- Uso no template: `{{ 'login.title' | translate }}`.
- Toda nova string visível precisa de chave em **`pt.json` e `en.json`**.
- Chaves existentes: `MENU.*` (maiúsculas), `login.*`, `errorr.*` (com typo), `WELCOME`. Para novas telas, use um bloco por tela (ex.: `products.title`, `suppliers.title`).

## Integração com a API

- URL da API está **hardcoded** em `UserService` (`http://localhost:3000/api/...`). Ao criar novos serviços, prefira centralizar a base URL (ex.: um arquivo de `environment` ou constante `API_URL`) em vez de repetir.
- Hoje **não há interceptor HTTP** que envie o token. Toda chamada a endpoint protegido precisa do header `Authorization: Bearer <token>` — o ideal é criar um `HttpInterceptorFn` e registrá-lo com `provideHttpClient(withInterceptors([...]))`.
- Respostas da API vêm em **snake_case** (`product_id`, `unit_price`); modele as interfaces TypeScript assim ou converta no serviço.
- CORS do back-end aponta por padrão para `http://localhost:5173`; para rodar com `ng serve` (4200) ajuste `CORS_ORIGIN=http://localhost:4200` no `.env` do back-end.

## Acessibilidade

`index.html` carrega o widget **VLibras** (Libras) e um widget de acessibilidade **Elfsight**. Use `aria-label` em botões só com ícone (padrão já seguido em `products.html` e `menu.html`).
