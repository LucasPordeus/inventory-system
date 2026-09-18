# Frontend Agent

Agente especializado no desenvolvimento frontend do sistema de inventário StoCat.

## Tecnologias

- **Framework:** Angular 21.2 (standalone components)
- **Linguagem:** TypeScript 5.9
- **UI Library:** Angular Material 21 (Material 3)
- **HTTP:** Angular HttpClient
- **Routing:** Angular Router com route guards funcionais
- **i18n:** @ngx-translate/core (PT/EN)
- **Reativo:** RxJS 7.8 + Angular signals
- **Estilo:** SCSS com naming BEM-like
- **Testes:** Vitest

## Arquitetura

Componentes standalone (sem NgModules), usando Angular signals para estado reativo, sintaxe de controle `@for`/`@if`, e arquitetura baseada em serviços com `providedIn: 'root'`.

## Convenções

- **Componentes:** Standalone, sem NgModules
- **Estado:** Angular signals + RxJS BehaviorSubjects
- **Estilo:** SCSS com classes BEM-like
- **Temas:** Angular Material theming (Indigo-Pink)
- **Fontes:** Google Fonts (Press Start 2P, Red Hat Display)
- **Ícones:** Material Icons + Font Awesome
- **Rotas:** Guards funcionais (`CanActivateFn`)
- **Tradução:** Chaves de tradução nos arquivos JSON em `/public/translation/`

## Estrutura de Pastas

```
front-end/src/app/
  app.ts, app.html, app.scss       -- Root component
  app.config.ts                    -- Config (router, HttpClient, ngx-translate)
  app.routes.ts                    -- Rotas
  components/
    login/                         -- Página de login
    layout/                        -- Shell principal (sidebar + conteúdo)
    menu/                          -- Menu lateral (Material sidenav)
    products/                      -- Listagem de produtos
    product/                       -- Card de produto
    filters/                       -- Barra de filtros
    error/                         -- Página de erro
    translation-selector/          -- Seletor de idioma
  services/
    auth.ts                        -- Estado de autenticação
    user-service.ts                -- Chamadas HTTP ao backend
    menu-service.ts                -- Estado do menu
  guards/
    auth-guard.ts                  -- Guard de autenticação
```

## Rotas

| Rota | Componente | Guard | Descrição |
|------|-----------|-------|-----------|
| `/` | Layout | authGuard | Redirect para `/products` |
| `/products` | Products | authGuard | Listagem de produtos |
| `/login` | Login | -- | Formulário de login |
| `/error/:code` | Error | -- | Exibição de erro |
| `/**` | -- | -- | Redirect para `/error/404` |

## Regras

1. Componentes devem ser standalone (sem NgModules)
2. Usar signals para estado reativo quando possível
3. Usar sintaxe `@for`/`@if` (não `*ngFor`/`*ngIf`)
4. Seguir padrão BEM para classes CSS
5. Traduzir textos usando chaves ngx-translate
6. Componentes de apresentação devem receber dados via `input()`
7. Serviços devem usar `providedIn: 'root'`
8. Guards devem ser funcionais (`CanActivateFn`)
