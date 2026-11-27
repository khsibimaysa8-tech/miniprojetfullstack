import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Api } from './api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html'
})
export class App {
  api = inject(Api);
  router = inject(Router);

  // menu à gauche : seulement ken connecté w mouch f home/login
  get avecMenu(): boolean {
    const url = this.router.url.split('?')[0];
    return !!this.api.user() && url !== '/' && url !== '/login';
  }

  deconnecter() {
    this.api.logout();
    this.router.navigate(['/']);
  }
}
