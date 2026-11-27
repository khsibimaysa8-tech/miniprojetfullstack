import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '../api';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html'
})
export class Login {
  api = inject(Api);
  router = inject(Router);
  route = inject(ActivatedRoute);

  // /login?mode=inscription → ykhabbi tab Inscription direct
  mode = this.route.snapshot.queryParams['mode'] === 'inscription' ? 'inscription' : 'connexion';

  // champs du formulaire
  nom = '';
  email = '';
  salaire: number | null = null;
  password = '';
  confirmation = '';
  erreur = '';

  changer(m: string) {
    this.mode = m;
    this.erreur = '';
  }

  seConnecter() {
    this.api.connexion(this.email, this.password).subscribe({
      next: (user) => {
        this.api.sauverUser(user);               // nخزّnou l user
        this.router.navigate(['/dashboard']);
      },
      error: (e) => this.erreur = e.error?.message || 'Serveur inaccessible'
    });
  }

  creerCompte() {
    // vérifications simples
    if (!this.nom || !this.email || !this.salaire) {
      this.erreur = 'Remplissez tous les champs'; return;
    }
    if (this.password.length < 8) {
      this.erreur = 'Mot de passe : 8 caractères minimum'; return;
    }
    if (this.password !== this.confirmation) {
      this.erreur = 'Les mots de passe ne sont pas identiques'; return;
    }
    this.api.inscription({
      nom: this.nom, email: this.email, password: this.password, salaire: this.salaire
    }).subscribe({
      next: (user) => {
        this.api.sauverUser(user);
        this.router.navigate(['/dashboard']);
      },
      error: (e) => this.erreur = e.error?.message || 'Serveur inaccessible'
    });
  }
}
