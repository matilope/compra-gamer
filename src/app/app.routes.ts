import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('@views/home/home.component').then((m) => m.HomeComponent), title: 'Compra Gamer' },
  { path: 'carrito', pathMatch: 'full', loadComponent: () => import('@views/shopping-cart/shopping-cart.component').then((m) => m.ShoppingCartComponent), title: 'Carrito' },
  { path: '**', redirectTo: '' }
];
