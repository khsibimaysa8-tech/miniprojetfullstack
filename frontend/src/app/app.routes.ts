import { Routes } from '@angular/router';

import { Home } from './home/home';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { Depenses } from './depenses/depenses';
import { Rapport } from './rapport/rapport';

import { authGuard } from './api';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },

  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'depenses', component: Depenses, canActivate: [authGuard] },
  { path: 'rapport', component: Rapport, canActivate: [authGuard] },

  { path: '**', redirectTo: '' }
];
