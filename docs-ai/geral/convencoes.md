# Convenções

## Idioma

| Onde | Idioma |
|---|---|
| Nomes de código (variáveis, classes, arquivos, tabelas, colunas, rotas da API) | Inglês |
| Mensagens de erro da API | Inglês |
| Textos visíveis ao usuário | Via ngx-translate (pt padrão, en) |
| Documentação (`docs-ai/`, README, ARCHITECTURE) | Português |
| Comentários no código | Português (padrão atual) |
| Mensagens de commit | Inglês (curtas) |
| Respostas da IA ao time | Português |

## Nomenclatura

### Back-end
- Arquivos em camelCase com sufixo da camada: `productController.js`, `productService.js`, `productRepository.js`, `productRoutes.js`.
- Classes em PascalCase exportadas como instância (`module.exports = new ProductService()`).
- Tabelas no plural snake_case (`products`, `users_screens`); PK `<singular>_id`.
- Rotas REST no plural (`/api/products`, `/api/products/:id`).
- Schemas Joi: `create<Recurso>Schema`, `update<Recurso>Schema`.

### Front-end
- Pastas/arquivos em kebab-case, **sem** sufixo `.component`: `components/translation-selector/translation-selector.ts`.
- Serviços: `services/<nome>-service.ts` com classe `<Nome>Service` (exceção existente: `services/auth.ts` → `AuthService`).
- Guards: `guards/<nome>-guard.ts`, exportando `<nome>Guard`.
- Classes de componente em PascalCase simples (`Products`, `Login`), seletor `app-<nome>`.
- Classes CSS em snake_case (`products_container`, `page_btn`).

## Commits

Prefixo + descrição curta em minúsculas:

| Prefixo | Uso |
|---|---|
| `feature:` | nova funcionalidade (`feature: adding supplier swagger`) |
| `fix:` | correção (`fix: validation schema suppliers`) |
| `style:` / `styles:` | mudanças visuais/CSS (`style: toggle menu`) |

## Branches

- Feature: `<modulo>/<camada>` — ex.: `suppliers/frontend`, `dashboard/backend`.
- Criar a partir de `dev`; abrir PR para `dev`; `dev` → `main` por PR.
- Uma variação experimental pode usar sufixo (`menu/frontend-option2`).

## Código

- Back-end: CommonJS, `async/await`, aspas simples, ponto e vírgula, 2 espaços.
- Front-end: TypeScript, aspas duplas na maioria dos arquivos novos (`products.ts`, `services/*`), 2 espaços; Prettier está nas devDependencies.
- Não deixar `console.log` de dados sensíveis.
- Não commitar `node_modules`, `.env` com segredos reais, nem `desktop.ini` (já houve commit removendo esses arquivos).

## Ao finalizar uma mudança

1. Back-end: `npm start` sobe sem erro; testar endpoint pelo Swagger.
2. Front-end: `ng build` sem erros; `ng test` passando.
3. Atualizar o arquivo correspondente em `docs-ai/` se mudou API, banco, rotas ou convenções.
