import { Component } from "@angular/core";
import { Filters } from "../filters/filters";
import { Product } from "../product/product";
import { Menu } from "../menu/menu";

@Component({
  selector: "app-products",
  imports: [Filters, Product, Menu],
  templateUrl: "./products.html",
  styleUrl: "./products.scss",
})
export class Products {}
