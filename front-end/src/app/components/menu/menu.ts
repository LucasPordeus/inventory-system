import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { forkJoin } from 'rxjs';

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
          console.log(this.menuItems);
          this.errorMessageMenu = 'Erro ao carregar os itens do menu';
        }
      });

      this.userService.getUsers().subscribe({
        next: (users) => {
          this.allowedMenuItems = users;
          this.allowedMenuItems.forEach(user => {
            this.menuItems = this.menuItems.filter(menu => user.allowedMenus.includes(menu.label));
          });
        },
        error: (err) => {
          console.error('Error fetching users:', err);
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
