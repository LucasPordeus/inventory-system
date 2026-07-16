import { Component, OnInit } from "@angular/core";

import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { FormsModule } from "@angular/forms";

import { TranslateService } from "@ngx-translate/core";


interface Lang {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-translation-selector",
  standalone: true,
  imports: [MatIconModule, MatFormFieldModule, MatSelectModule, FormsModule],
  templateUrl: "./translation-selector.html",
  styleUrl: "./translation-selector.scss",
})

export class TranslationSelector implements OnInit {
  constructor(private translate: TranslateService) {}

  selectedValue!: string;

  langs: Lang[] = [
    {value: 'pt', viewValue: 'Portuguese'},
    {value: 'en', viewValue: 'English'},
  ];

  ngOnInit() {
    const saved = localStorage.getItem('lang');
    const lang = saved || 'pt';
    this.translate.use(lang);
    this.selectedValue = lang;
  }


  selectedLanguage(event: MatSelectChange) {
    this.translate.use(event.value);
    localStorage.setItem('lang', event.value);
  }

  getViewValue(value: string): string {
    return this.langs.find(l => l.value === value)?.viewValue ?? '';
  }
}
