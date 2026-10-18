# docs-ai — Documentação do StoCat para IA

Esta pasta é a **fonte de verdade** para qualquer IA (ou pessoa) que vá ler, responder perguntas ou escrever código neste projeto. Antes de propor mudanças, leia os arquivos relevantes abaixo e siga as convenções descritas.

## Estrutura

```
docs-ai/
├── README.md                        # este índice
├── geral/                           # vale para o projeto todo
│   ├── visao-geral.md
│   ├── repositorio-e-branches.md
│   ├── autenticacao-e-permissoes.md
│   ├── convencoes.md
│   └── status-e-pendencias.md
├── backend/                         # back-end/ (Express + PostgreSQL)
│   ├── arquitetura.md
│   ├── api.md
│   ├── banco-de-dados.md
│   └── guia-novo-modulo.md
├── frontend/                        # front-end/ (Angular)
│   ├── arquitetura.md
│   ├── design-e-telas.md
│   └── guia-nova-tela.md
└── assets/
    ├── estoque-diagram.drawio.png   # diagrama ER planejado (inclui tabelas ainda não implementadas)
    └── design/                      # protótipos das telas e guia de estilo
```

Todos os caminhos citados nos arquivos são relativos a `docs-ai/`.

## Índice

### geral/

| Arquivo | Quando ler |
|---|---|
| [visao-geral.md](geral/visao-geral.md) | Sempre. O que é o sistema, stack, módulos. |
| [repositorio-e-branches.md](geral/repositorio-e-branches.md) | Trabalho com git ou para saber em qual branch está cada módulo. |
| [autenticacao-e-permissoes.md](geral/autenticacao-e-permissoes.md) | Login, JWT, roles, telas por usuário, guards. |
| [convencoes.md](geral/convencoes.md) | Commits, nomes, idioma, estilo de código. |
| [status-e-pendencias.md](geral/status-e-pendencias.md) | O que já existe, o que falta e problemas conhecidos. |

### backend/

| Arquivo | Quando ler |
|---|---|
| [arquitetura.md](backend/arquitetura.md) | Qualquer mudança no `back-end/`. |
| [api.md](backend/api.md) | Consumir ou criar endpoints. |
| [banco-de-dados.md](backend/banco-de-dados.md) | Schema, migrations, seeds. |
| [guia-novo-modulo.md](backend/guia-novo-modulo.md) | Passo a passo para criar um CRUD novo na API. |

### frontend/

| Arquivo | Quando ler |
|---|---|
| [arquitetura.md](frontend/arquitetura.md) | Qualquer mudança no `front-end/`. |
| [design-e-telas.md](frontend/design-e-telas.md) | Criar/estilizar telas (referência visual em `assets/design/`). |
| [guia-nova-tela.md](frontend/guia-nova-tela.md) | Passo a passo para criar uma tela/componente Angular. |

## Regras para a IA

1. **Siga o código existente, não suposições.** Se esta documentação e o código divergirem, o código da branch correspondente vence — e avise a divergência.
2. **Respeite as camadas** do back-end (`routes → controllers → services → repositories`) e o padrão de componentes standalone + signals do front-end.
3. **Não invente endpoints, tabelas ou campos.** Consulte `backend/api.md` e `backend/banco-de-dados.md`.
4. **Nunca edite migrations já existentes**; crie uma nova com o próximo número livre (veja o alerta de numeração em `backend/banco-de-dados.md`).
5. **Textos visíveis no front-end** devem passar pelo `ngx-translate` (pt e en).
6. **Responda em português** e mantenha os nomes de código em inglês (ver `geral/convencoes.md`).
7. Os módulos estão espalhados em **branches de feature** — confira em `geral/repositorio-e-branches.md` qual branch contém o que você precisa antes de afirmar que algo "não existe".
