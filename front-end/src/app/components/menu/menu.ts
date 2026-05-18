import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { BreakpointObserver } from '@angular/cdk/layout';

import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule, 
    MatSidenavModule, 
    MatIconModule, 
    MatButtonModule,  
    MatListModule,
  ],
  templateUrl: './menu.html',
  styleUrls: ['./menu.scss']
})

export class Menu implements OnInit {

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  isMobile = true;
  isCollapsed = true;

  constructor(
    private observer: BreakpointObserver
  ) {}

  ngOnInit(): void {

    this.observer
      .observe(['(max-width: 800px)'])
      .subscribe((screenSize) => {

        if (screenSize.matches) {

          this.isMobile = true;

        } else {

          this.isMobile = false;

        }

      });

  }

  toggleMenu() {

    if (this.isMobile) {

      this.sidenav.toggle();
      this.isCollapsed = false;

    } else {

      this.sidenav.open();
      this.isCollapsed = !this.isCollapsed;

    }

  }

}
