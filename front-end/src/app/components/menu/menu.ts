import { Component, ViewChild, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectChange } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

import { MenuService, MenuItem } from '../../services/menu-service';
import { UserService, User } from '../../services/user-service';


interface Lang {
  value: string;
  viewValue: string;
}


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
    MatSelectModule,
    FormsModule
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

  constructor(
    private observer: BreakpointObserver, 
    private menuService: MenuService, 
    private userService: UserService, 
    private router: Router, 
    private translate: TranslateService,) {}

  selectedValue!: string;

  langs: Lang[] = [
    {value: 'pt', viewValue: 'Portuguese'},
    {value: 'en', viewValue: 'English'},
  ];

  ngOnInit() {
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
          // Limpa a mensagem de erro se items forem carregados
          if (items && items.length > 0) {
            this.errorMessageMenu = '';
          } else {
            this.errorMessageMenu = 'Erro ao carregar os itens do menu';
          }
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

  logout(){
    localStorage.removeItem('token');
    this.menuService.clearMenuItems();
    this.router.navigate(['/login']);
  }

  selectedLanguage(event: MatSelectChange) {
    this.translate.use(event.value)
  }
}
