import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

import { Login } from './components/login/login';
import { Layout } from './components/layout/layout';
import { Products } from './components/products/products';

import { Error } from './components/error/error';

export const routes: Routes = [
  { 
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: 'products', component: Products }
    ]
  },
  { path: 'login', component: Login },

  { path: 'error/:code', component: Error },
  { path: '**', redirectTo: 'error/404' }
];
