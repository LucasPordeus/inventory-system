# 10 — Guia: nova tela no front-end

Exemplo: tela de **Fornecedores** (`/suppliers`). Referência real: `components/products` + `components/product` (branch `products/frontend`).

## Checklist

1. [ ] Interface + serviço HTTP em `src/app/services/`
2. [ ] Componente da página em `src/app/components/<nome>/`
3. [ ] Componentes de apresentação (card/linha, modal, filtros) se necessário
4. [ ] Rota como filha de `Layout` em `app.routes.ts`
5. [ ] Chaves de tradução em `public/translation/pt.json` e `en.json`
6. [ ] Estilos seguindo `frontend/design-e-telas.md`
7. [ ] `.spec.ts` básico (criação do componente)
8. [ ] Garantir que a tela existe em `screens` com o mesmo `redirect`

## 1. Gerar o componente

```bash
cd front-end
ng generate component components/suppliers
```

Gera `suppliers.ts`, `suppliers.html`, `suppliers.scss`, `suppliers.spec.ts` (classe `Suppliers`, seletor `app-suppliers`).

## 2. Serviço — `src/app/services/supplier-service.ts`

```ts
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface Supplier {
  supplier_id: number;
  name: string;
  contact: string;
  cnpj: string;
  category: string;
}

@Injectable({
  providedIn: "root",
})
export class SupplierService {

  private apiUrl = "http://localhost:3000/api/suppliers";

  constructor(private http: HttpClient) {}

  list(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl);
  }

  create(payload: Omit<Supplier, "supplier_id">): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, payload);
  }
}
```

- Interfaces de resposta em **snake_case** (como a API devolve); payloads de envio em **camelCase** quando o campo tiver mais de uma palavra (`unitPrice`, `expirationDate`).
- O endpoint exige token: enquanto não existir interceptor, crie um `HttpInterceptorFn` (`src/app/interceptors/auth-interceptor.ts`) que adicione `Authorization: Bearer ${localStorage.getItem('token')}` e registre em `app.config.ts` com `provideHttpClient(withInterceptors([authInterceptor]))`. Não repita o header manualmente em cada serviço.

## 3. Componente — `suppliers.ts`

```ts
import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { TranslatePipe } from "@ngx-translate/core";
import { SupplierService, Supplier } from "../../services/supplier-service";

@Component({
  selector: "app-suppliers",
  imports: [MatIconModule, TranslatePipe],
  templateUrl: "./suppliers.html",
  styleUrl: "./suppliers.scss",
})
export class Suppliers implements OnInit {
  private supplierService = inject(SupplierService);

  readonly items = signal<Supplier[]>([]);
  readonly sortOrder = signal<"az" | "za">("az");

  protected readonly sortedItems = computed(() => {
    const sorted = [...this.items()].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    return this.sortOrder() === "za" ? sorted.reverse() : sorted;
  });

  ngOnInit(): void {
    this.supplierService.list().subscribe({
      next: (suppliers) => this.items.set(suppliers),
      error: (err) => console.error("Suppliers error:", err),
    });
  }
}
```

## 4. Template — `suppliers.html`

```html
<main>
  <h2>{{ 'suppliers.title' | translate }}</h2>

  <div class="suppliers_container">
    @for (item of sortedItems(); track item.supplier_id) {
      <div class="supplier_row">
        <span>{{ item.name }}</span>
        <span>{{ item.category }}</span>
      </div>
    } @empty {
      <p>{{ 'suppliers.empty' | translate }}</p>
    }
  </div>
</main>
```

- `@if` / `@for` com `track` / `@empty`.
- Botões só com ícone precisam de `aria-label` e `title`.

## 5. Rota — `app.routes.ts`

```ts
import { Suppliers } from './components/suppliers/suppliers';

children: [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: Products },
  { path: 'suppliers', component: Suppliers },
]
```

O `path` deve bater com o `redirect` da tela em `screens` (`/suppliers`).

## 6. Traduções

`public/translation/pt.json`:

```json
"suppliers": {
  "title": "Fornecedores",
  "empty": "Nenhum fornecedor encontrado"
}
```

`public/translation/en.json`:

```json
"suppliers": {
  "title": "Suppliers",
  "empty": "No suppliers found"
}
```

## 7. Estilo — `suppliers.scss`

Reaproveite o padrão de `products.scss`: container com `border-radius: 10px` e sombra, media query em `1194px`, classes em snake_case. Cores e fontes em `frontend/design-e-telas.md`.

## Componentes de apresentação

Siga o modelo de `Product`: recebem dados por `input()` e não chamam serviços.

```ts
export class Product {
  readonly items = input<ProductItem[]>([]);
  readonly layout = input<"grid" | "list">("grid");
}
```

Para eventos para o pai use `output()`.
