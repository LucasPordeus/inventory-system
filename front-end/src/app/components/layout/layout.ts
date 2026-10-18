import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { Menu } from "../menu/menu";
import { TranslationSelector } from "../translation-selector/translation-selector";

@Component({
  selector: "app-layout",
  standalone: true,
  imports: [RouterOutlet, Menu, TranslationSelector],
  templateUrl: "./layout.html",
  styleUrl: "./layout.scss",
})
export class Layout {

  
}
