import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { App } from './app';
import { Menu } from './components/menu/menu';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'app', component: App },
  { path: 'menu', component: Menu },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
