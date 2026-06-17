import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { Menu } from "../menu/menu";
import { Home } from "../home/home";

@Component({
  selector: "app-layout",
  standalone: true,
  imports: [RouterOutlet, Menu, Home],
  templateUrl: "./layout.html",
  styleUrl: "./layout.scss",
})
export class Layout {

  
}
