import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ChangeDetectorRef } from '@angular/core';

import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';

@Component({
  selector: "app-error",
  standalone: true,
  imports: [TranslatePipe, TranslateDirective],
  templateUrl: "./error.html",
  styleUrl: "./error.scss",
})
export class Error {

  code: string = '';

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.code = this.route.snapshot.paramMap.get('code') || '';

    this.redirectToLogin();
    this.counterDecrs();
  }

  errorMessages: any = {
    '401': `Unauthorized: You need to log in to access this page.`,
    '403': 'Forbidden: You do not have permission to access this page.',
    '404': 'Not Found: The page you are looking for does not exist.',
    '500': 'Internal Server Error: Something went wrong on our end. Please try again later.'
  };

  redirectToLogin(): void {
    if (this.code) {
      setTimeout(() =>{
        window.location.href = '/login';
      }, 12000)
    };
  };

  counter: number = 5;
  counterDecrs(): void {
    const interval = setInterval(() => {
      this.counter--;
      this.cdr.detectChanges();

      if (this.counter <= 0) {
        clearInterval(interval);
      }
    }, 2000);
  }
}
