import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Layout } from './components/layout/layout';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { 
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: Home }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
