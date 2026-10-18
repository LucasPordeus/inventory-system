# Component Development Skill

Workflow para criar novos componentes Angular no frontend do StoCat.

## Fluxo de Trabalho

### 1. Gerar o Componente

```bash
ng generate component components/nome-do-componente --standalone
```

Ou criar manualmente com a estrutura:
```
components/nome-do-componente/
  nome-do-componente.ts
  nome-do-componente.html
  nome-do-componente.scss
```

### 2. Criar o Componente (TypeScript)

```typescript
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatModule } from '../../mat.module';

@Component({
  selector: 'app-nome-do-componente',
  standalone: true,
  imports: [CommonModule, FormsModule, MatModule],
  templateUrl: './nome-do-componente.html',
  styleUrl: './nome-do-componente.scss',
})
export class NomeDoComponente {
  items = signal<Item[]>([]);
  loading = signal(false);

  filteredItems = computed(() => {
    return this.items().filter(item => item.active);
  });
}
```

### 3. Criar o Template (HTML)

Usar sintaxe nova do Angular:
```html
@if (loading()) {
  <mat-spinner diameter="40"></mat-spinner>
} @else {
  @for (item of filteredItems(); track item.id) {
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ item.name }}</mat-card-title>
      </mat-card-header>
    </mat-card>
  } @empty {
    <p>Nenhum item encontrado</p>
  }
}
```

### 4. Criar os Estilos (SCSS)

Seguir padrão BEM:
```scss
.nome-do-componente {
  &__header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__title {
    font-family: 'Red Hat Display', sans-serif;
    font-size: 1.5rem;
    color: #333;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
}
```

### 5. Criar o Serviço (se necessário)

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private items$ = new BehaviorSubject<Item[]>([]);

  constructor(private http: HttpClient) {}

  loadItems() {
    this.http.get<Item[]>('/api/items').subscribe(items => {
      this.items$.next(items);
    });
  }
}
```

### 6. Adicionar Rota (se necessário)

Em `app.routes.ts`:
```typescript
{
  path: 'items',
  component: ItemsComponent,
  canActivate: [authGuard],
}
```

### 7. Adicionar Tradução

Em `public/translation/pt.json` e `public/translation/en.json`:
```json
{
  "ITEMS": {
    "TITLE": "Itens",
    "EMPTY": "Nenhum item encontrado"
  }
}
```

No template:
```html
<h1>{{ 'ITEMS.TITLE' | translate }}</h1>
```

## Convenções

- Componentes devem ser sempre standalone
- Usar `signal()` para estado local reativo
- Usar `computed()` para valores derivados
- Usar `@for`/`@if` (não `*ngFor`/`*ngIf`)
- Dados de entrada via `input()`, saída via `output()`
- Serviços com `providedIn: 'root'`
- Estilos com BEM-like naming
- Usar Angular Material para UI
- Traduzir todos os textos visíveis
