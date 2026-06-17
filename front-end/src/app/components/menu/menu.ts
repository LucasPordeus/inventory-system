import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';

import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';

import { MenuService, MenuItem } from '../../services/menu-service';
import { UserService, User } from '../../services/user-service';

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
  errorMessageMenu = '';
  menuItems: MenuItem[] = [];
  allowedMenuItems: User[] = [];
  email: string = '';
  password: string = '';

  constructor(private observer: BreakpointObserver, private menuService: MenuService, private userService: UserService) {}

  ngOnInit(): void{
    this.observer
      .observe(['(max-width: 800px)'])
      .subscribe((screenSize) => {

        if(screenSize.matches){
          this.isMobile = true;
        }else{
          this.isMobile = false;
        }
      });

      
      this.menuService.getMenuItems().subscribe({
        next: (items) => {
          this.menuItems = items;
        },
        error: (err) => {
          console.error('Error fetching menu items:', err);
          this.errorMessageMenu = 'Erro ao carregar os itens do menu';
        }
      });
      

  }

  toggleMenu() {
    if(this.isMobile){
      this.sidenav.toggle();
      this.isCollapsed = !this.isCollapsed;
    }else{
      this.sidenav.open();
      this.isCollapsed = !this.isCollapsed;
    }
  }

}
