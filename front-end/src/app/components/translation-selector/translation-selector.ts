import { Component, OnInit } from "@angular/core";

import { TranslateService } from "@ngx-translate/core";


interface Lang {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-translation-selector",
  standalone: true,
  templateUrl: "./translation-selector.html",
  styleUrl: "./translation-selector.scss",
})

export class TranslationSelector implements OnInit {
  constructor(private translate: TranslateService) {}

  selectedValue!: string;
  isOpen = false;

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


  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  selectedLanguage(language: string): void {
    this.selectedValue = language;
    this.translate.use(language);
    localStorage.setItem('lang', language);
    this.isOpen = false;
  }

  getViewValue(value: string): string {
    return this.langs.find(l => l.value === value)?.viewValue ?? '';
  }
}
