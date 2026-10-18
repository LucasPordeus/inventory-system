# 07 — Design e telas

Protótipos em `assets/design/`. Use-os como referência visual ao criar ou estilizar telas.

| Arquivo | Tela |
|---|---|
| `assets/design/9.png` | Guia de estilo: paleta, tipografia, ícones |
| `assets/design/dashboard geral.png` | Dashboard (parte superior) |
| `assets/design/dashboard geral continuacao.png` | Dashboard (parte inferior) |
| `assets/design/produtos grid.png` | Produtos em grade |
| `assets/design/produtos lista.png` | Produtos em lista |
| `assets/design/modal visualizar produto.png` | Modal "Novo Produto" |

## Identidade visual

**Nome:** StoCat. **Ícone do sistema:** gato em caixa de papelão (pixel art) — `assets/images/logo.png`. **Ícone do chatbot:** gato-robô branco com fones (pixel art), botão flutuante redondo no canto inferior direito.

### Paleta

| Cor | Hex | Uso |
|---|---|---|
| Roxo escuro | `#1E104E` | Fundo do menu lateral, botões primários (Salvar), página ativa da paginação |
| Roxo médio | `#452E5A` | Tons secundários, overlay do modal |
| Laranja coral | `#FF653F` | Faixa inferior dos cards de produto |
| Amarelo | `#FFC85C` | Botão de ação principal no topo ("Cadastrar") |

Fundos de cards/painéis em cinza claro (~`#EEEEEE`), conteúdo em fundo branco com sombra suave e cantos arredondados (~10px).

### Tipografia

| Elemento | Fonte |
|---|---|
| `h1` (títulos, marca "StoCat") | **Press Start 2P** (pixel) |
| `h2` (subtítulos) | **Red Hat Display**, bold |
| `p`, `span`, `label`, `button` | **Red Hat Display**, 500 |

Já configuradas globalmente em `src/styles.scss`. Ícones: Material Icons (principal) e Font Awesome 6.5.

## Layout padrão (todas as telas autenticadas)

- **Menu lateral** roxo escuro, com logo + "StoCat" no topo e itens: Dashboard, Produtos, Fornecedores, Movimentação, Usuários (ícone + texto; item ativo em negrito). Colapsável; em mobile vira overlay.
- **Topo da área de conteúdo**: título da página à esquerda (grande); à direita, seletor de idioma (bandeira + seta), ícone de exportar/relatório e botão amarelo de ação ("Cadastrar").
- **Chatbot**: botão flutuante circular roxo com o ícone do gato-robô, canto inferior direito.

## Telas

### Dashboard
- 4 cards de indicadores: **Total Produtos**, **Produtos Ativos**, **Total em reais** (R$), **Próx. da validade** (ao clicar/hover mostra lista Nome × Validade).
- **Estoque de produtos por mês** — gráfico de barras.
- **Fluxo de estoque (saída vs entrada)** — barras de progresso horizontais.
- **Valor por Categoria** — barras de progresso, com paginação por bolinhas.
- **Itens próximos da validade** — tabela Nome | Validade.

Fontes de dados: `products` (quantidade, `unit_price`, `category`, `expiration_date`) e `movements` (`direction`, `created_at`). Pode exigir endpoints de agregação novos.

### Produtos (implementada parcialmente em `products/frontend`)
- **Barra de filtros** (card branco com sombra): busca por texto (ícone de lupa), selects **Categoria**, **Fornecedor**, **Status**, e campo de data **Validade**.
- **Barra de opções** (fundo cinza): ordenar A→Z / Z→A, alternar **grade** / **lista**, paginação à direita (`< 1 2 [3] … 500 >`, página ativa em círculo roxo).
- **Grade**: 4 colunas de cards com imagem do produto e faixa laranja embaixo com nome (esq.) e categoria (dir.).
- **Lista**: linhas com imagem à esquerda e colunas **Nome**, **Categoria**, **Validade**.
- Botão **Cadastrar** abre o modal.

### Modal "Novo Produto"
Overlay escurecido, card branco arredondado, botão fechar (X vermelho circular). Campos:
- Nome · Quant. Inicial · Unidade (select)
- Preço Unit. (com select de moeda "R$") · Categoria (select) · Validade (date picker)
- Fornecedor
- Botão **Salvar** (roxo escuro, canto inferior direito).

Mapeia para `POST /api/products` (`name`, `quantity`, `unit`, `unitPrice`, `category`, `expirationDate`). O campo Fornecedor depende de `products.supplier_id`, ainda não existente no banco.

### Telas sem design ainda
Fornecedores, Movimentações e Usuários: siga o mesmo padrão da tela de Produtos (título + filtros + listagem + botão Cadastrar abrindo modal).
