import { Component, OnInit, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Api, Depense } from '../api';

@Component({
  selector: 'app-rapport',
  imports: [DecimalPipe],
  templateUrl: './rapport.html'
})
export class Rapport implements OnInit {
  api = inject(Api);
  user = this.api.user()!;

  depenses: Depense[] = [];
  mode = 'mois';                 // 'mois' wala 'semaine'

  titre = '';
  sousTitre = '';
  total = 0;
  pourcent = 0;
  restant = 0;
  moyenne = 0;
  barres: { label: string, valeur: number }[] = [];
  maxBarre = 1;
  categories: { nom: string, montant: number, part: number }[] = [];
  message = '';

  ngOnInit() {
    this.api.getDepenses(this.user.id!).subscribe(l => {
      this.depenses = l;
      this.calculer();
    });
  }

  choisir(m: string) {
    this.mode = m;
    this.calculer();
  }

  calculer() {
    const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet',
                  'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    const jourNoms = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const now = new Date();
    const auj = this.api.aujourdhui();
    const prefixMois = auj.substring(0, 7);

    // restant = toujours calculé sur le mois
    const duMois = this.depenses.filter(d => d.date.startsWith(prefixMois));
    this.restant = this.user.salaire - duMois.reduce((s, d) => s + d.montant, 0);

    let liste: Depense[];
    let nbJours: number;
    this.barres = [];

    if (this.mode === 'mois') {
      liste = duMois;
      nbJours = now.getDate();
      this.titre = 'Rapport · ' + mois[now.getMonth()] + ' ' + now.getFullYear();
      this.sousTitre = 'Du 1 au ' + now.getDate() + ' ' + mois[now.getMonth()] + ' (mois en cours)';

      // 4 tranches : 1-7, 8-14, 15-21, 22-fin
      const tranches = [[1, 7], [8, 14], [15, 21], [22, 31]];
      for (const [a, b] of tranches) {
        const somme = liste
          .filter(d => { const j = Number(d.date.substring(8, 10)); return j >= a && j <= b; })
          .reduce((s, d) => s + d.montant, 0);
        this.barres.push({ label: a + '–' + (b === 31 ? 'fin' : b), valeur: somme });
      }
    } else {
      // 7 derniers jours
      const debut = new Date();
      debut.setDate(debut.getDate() - 6);
      const debutIso = this.api.formatDate(debut);
      liste = this.depenses.filter(d => d.date >= debutIso && d.date <= auj);
      nbJours = 7;
      this.titre = 'Rapport · 7 derniers jours';
      this.sousTitre = 'Du ' + debut.getDate() + ' au ' + now.getDate() + ' ' + mois[now.getMonth()];

      for (let i = 6; i >= 0; i--) {
        const dt = new Date();
        dt.setDate(dt.getDate() - i);
        const iso = this.api.formatDate(dt);
        const somme = liste.filter(d => d.date === iso).reduce((s, d) => s + d.montant, 0);
        this.barres.push({ label: jourNoms[dt.getDay()] + ' ' + dt.getDate(), valeur: somme });
      }
    }

    // totaux
    this.total = liste.reduce((s, d) => s + d.montant, 0);
    this.pourcent = this.user.salaire ? this.total / this.user.salaire * 100 : 0;
    this.moyenne = this.total / nbJours;
    this.maxBarre = Math.max(...this.barres.map(b => b.valeur), 1);

    // détail par catégorie
    const groupes: { [cat: string]: number } = {};
    for (const d of liste) {
      groupes[d.categorie] = (groupes[d.categorie] || 0) + d.montant;
    }
    this.categories = Object.keys(groupes)
      .map(nom => ({ nom, montant: groupes[nom], part: this.total ? groupes[nom] / this.total * 100 : 0 }))
      .sort((a, b) => b.montant - a.montant);

    // phrase d'analyse
    if (this.total === 0) {
      this.message = 'Aucune dépense sur cette période.';
    } else {
      const top = this.barres.reduce((m, b) => b.valeur > m.valeur ? b : m);
      this.message = 'La période la plus élevée est ' + top.label + '. '
        + this.categories[0].nom + ' (' + this.categories[0].montant.toFixed(3)
        + ' DT) est le premier poste.';
    }
  }

  // Exporter en PDF = imprimer la page (choisir "Enregistrer en PDF")
  exporter() {
    window.print();
  }
}
