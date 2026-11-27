import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

// Les modèles (même champs que les entités Java)
export interface User {
  id?: number;
  nom: string;
  email: string;
  password: string;
  salaire: number;
}
export interface Depense {
  id?: number;
  montant: number;
  description: string;
  categorie: string;
  date: string;      // "2026-11-27"
  userId: number;
}

@Injectable({ providedIn: 'root' })
export class Api {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080/api';

  categories = ['Alimentation', 'Transport', 'Café', 'Logement', 'Factures', 'Loisirs', 'Autres'];

  // ---------- appels HTTP ----------
  inscription(user: User): Observable<User> {
    return this.http.post<User>(`${this.url}/users/inscription`, user);
  }
  connexion(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.url}/users/connexion`, { email, password });
  }
  getDepenses(userId: number): Observable<Depense[]> {
    return this.http.get<Depense[]>(`${this.url}/depenses/user/${userId}`);
  }
  addDepense(d: Depense): Observable<Depense> {
    return this.http.post<Depense>(`${this.url}/depenses`, d);
  }
  updateDepense(d: Depense): Observable<Depense> {
    return this.http.put<Depense>(`${this.url}/depenses/${d.id}`, d);
  }
  deleteDepense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/depenses/${id}`);
  }

  // ---------- session (l user connecté yetخزّen f localStorage) ----------
  user(): User | null {
    const s = localStorage.getItem('user');
    return s ? JSON.parse(s) : null;
  }
  sauverUser(u: User) {
    localStorage.setItem('user', JSON.stringify(u));
  }
  logout() {
    localStorage.removeItem('user');
  }

  // ---------- dates ----------
  // Date → "YYYY-MM-DD" (b l wa9t local)
  formatDate(d: Date): string {
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const j = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${j}`;
  }
  aujourdhui(): string {
    return this.formatDate(new Date());
  }
}

// Guard : ken ma fammech user connecté → nرجّعou lel login (kif AuthGuard atelier 6)
export const authGuard = () => {
  return inject(Api).user() ? true : inject(Router).createUrlTree(['/login']);
};
