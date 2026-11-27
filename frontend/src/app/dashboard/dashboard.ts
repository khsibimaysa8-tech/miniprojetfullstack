import { Component, OnInit, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Api, Depense } from '../api';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  api = inject(Api);
  user = this.api.user()!;

  jourNoms = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  dateTexte = '';

  total = 0;            // total dépensé ce mois
  restant = 0;          // salaire - total
  pourcent = 0;         // % du salaire dépensé
  joursRestants = 0;    // jours avant la fin du mois
  totalAujourdhui = 0;
  duJour: Depense[] = [];                              // dépenses d'aujourd'hui
  jours: { label: string, valeur: number }[] = [];     // 6 derniers jours (graphique)
  totalJours = 0;
  maxJour = 1;
  categories: { nom: string, montant: number }[] = []; // top catégories

  ngOnInit() {
    this.api.getDepenses(this.user.id!).subscribe(liste => this.calculer(liste));
  }

  calculer(liste: Depense[]) {
    const now = new Date();
    const auj = this.api.aujourdhui();
    const moisCourant = auj.substring(0, 7);     // "2026-11"

    // texte de la date : "Vendredi 27 novembre 2026"
    this.dateTexte = now.toLocaleDateString('fr-FR',
      { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    // --- dépenses du mois ---
    const duMois = liste.filter(d => d.date.startsWith(moisCourant));
    this.total = duMois.reduce((s, d) => s + d.montant, 0);
    this.restant = this.user.salaire - this.total;
    this.pourcent = this.user.salaire ? this.total / this.user.salaire * 100 : 0;
    this.joursRestants = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate();

    // --- aujourd'hui ---
    this.duJour = liste.filter(d => d.date === auj);
    this.totalAujourdhui = this.duJour.reduce((s, d) => s + d.montant, 0);

    // --- 6 derniers jours ---
    this.jours = [];
    for (let i = 5; i >= 0; i--) {
      const dt = new Date();
      dt.setDate(dt.getDate() - i);
      const iso = this.api.formatDate(dt);
      const somme = liste.filter(d => d.date === iso).reduce((s, d) => s + d.montant, 0);
      this.jours.push({ label: this.jourNoms[dt.getDay()], valeur: somme });
    }
    this.totalJours = this.jours.reduce((s, j) => s + j.valeur, 0);
    this.maxJour = Math.max(...this.jours.map(j => j.valeur), 1);   // 1 bch ma n9assmouch 3la 0

    // --- top catégories du mois ---
    const groupes: { [cat: string]: number } = {};
    for (const d of duMois) {
      groupes[d.categorie] = (groupes[d.categorie] || 0) + d.montant;
    }
    this.categories = Object.keys(groupes)
      .map(nom => ({ nom, montant: groupes[nom] }))
      .sort((a, b) => b.montant - a.montant)    // du plus grand au plus petit
      .slice(0, 5);
  }

  // largeur de la barre (en %) par rapport à la plus grande catégorie
  largeur(montant: number): number {
    return this.categories.length ? montant / this.categories[0].montant * 100 : 0;
  }
}
