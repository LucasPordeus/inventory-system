import { Component, input } from "@angular/core";

export interface ProductItem {
  name: string;
  image: string;
  category: string;
}

@Component({
  selector: "app-product",
  templateUrl: "./product.html",
  styleUrl: "./product.scss",
})
export class Product {
  readonly items = input<ProductItem[]>([]);
  readonly layout = input<"grid" | "list">("grid");
}
