import { Component, computed, signal } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { Filters } from "../filters/filters";
import { Product, ProductItem } from "../product/product";

@Component({
  selector: "app-products",
  imports: [MatIconModule, Filters, Product],
  templateUrl: "./products.html",
  styleUrl: "./products.scss",
})
export class Products {
  readonly layout = signal<"grid" | "list">("grid");
  readonly sortOrder = signal<"az" | "za">("az");
  readonly currentPage = signal(1);
  readonly pageSize = 8;

  protected readonly items: ProductItem[] = [
    { name: "Smartphone XYZ", image: "assets/images/product-placeholder.svg", category: "Eletrônicos" },
    { name: "Fone Bluetooth", image: "assets/images/product-placeholder.svg", category: "Eletrônicos" },
    { name: "Camiseta Premium", image: "assets/images/product-placeholder.svg", category: "Vestuário" },
    { name: "Tênis Runner", image: "assets/images/product-placeholder.svg", category: "Vestuário" },
    { name: "Café Torrado", image: "assets/images/product-placeholder.svg", category: "Alimentos" },
    { name: "Chocolate 70%", image: "assets/images/product-placeholder.svg", category: "Alimentos" },
    { name: "Notebook Pro", image: "assets/images/product-placeholder.svg", category: "Eletrônicos" },
    { name: "Jaqueta Corta-Vento", image: "assets/images/product-placeholder.svg", category: "Vestuário" },
    { name: "Tablet Mini", image: "assets/images/product-placeholder.svg", category: "Eletrônicos" },
    { name: "Teclado Mecânico", image: "assets/images/product-placeholder.svg", category: "Eletrônicos" },
    { name: "Calça Jeans", image: "assets/images/product-placeholder.svg", category: "Vestuário" },
    { name: "Boné Urban", image: "assets/images/product-placeholder.svg", category: "Vestuário" },
    { name: "Arroz Integral", image: "assets/images/product-placeholder.svg", category: "Alimentos" },
    { name: "Suco de Laranja", image: "assets/images/product-placeholder.svg", category: "Alimentos" },
    { name: "Bicicleta Aro 29", image: "assets/images/product-placeholder.svg", category: "Esportes" },
    { name: "Haltere 10kg", image: "assets/images/product-placeholder.svg", category: "Esportes" },
  ];

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.items.length / this.pageSize))
  );

  protected readonly pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  protected readonly sortedItems = computed(() => {
    const sorted = [...this.items].sort((a, b) =>
      a.name.localeCompare(b.name, "pt-BR")
    );
    return this.sortOrder() === "za" ? sorted.reverse() : sorted;
  });

  protected readonly visibleItems = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.sortedItems().slice(start, start + this.pageSize);
  });

  toggleSort(order: "az" | "za"): void {
    this.sortOrder.set(order);
    this.currentPage.set(1);
  }

  toggleLayout(): void {
    this.layout.set(this.layout() === "grid" ? "list" : "grid");
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }
    this.currentPage.set(page);
  }
}
