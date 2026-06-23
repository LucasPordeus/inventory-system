import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

export interface Screen {
  screen_id: number;
  name: string;
  icon: string;
  redirect: string;
}

@Injectable({
  providedIn: "root",
})
export class MenuService {
  private menuItems = new BehaviorSubject<MenuItem[]>([]);

  constructor() {
    // Carrega os items do localStorage ao inicializar
    const stored = localStorage.getItem('menuItems');
    if (stored) {
      try {
        const screens = JSON.parse(stored);
        this.setMenuItems(screens);
      } catch (error) {
        console.error('Erro ao carregar itens do menu:', error);
        // Remove dados corrompidos do localStorage
        localStorage.removeItem('menuItems');
      }
    }
  }

  /**
   * Define os itens do menu a partir dos screens do backend
   * Chamado após o usuário fazer login
   */
  setMenuItems(screens: Screen[]): void {
    const menuItems = screens.map(screen => ({
      label: screen.name,
      icon: screen.icon,
      route: screen.redirect
    }));
    this.menuItems.next(menuItems);
  }

  getMenuItems(): Observable<MenuItem[]> {
    return this.menuItems.asObservable();
  }

  clearMenuItems(): void {
    this.menuItems.next([]);
    localStorage.removeItem('menuItems');
  }
}
