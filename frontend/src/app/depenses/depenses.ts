import { Component, OnInit, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api, Depense } from '../api';

@Component({
  selector: 'app-depenses',
  imports: [FormsModule, DecimalPipe],
  templateUrl: './depenses.html'
})
export class Depenses implements OnInit {
  api = inject(Api);
  user = this.api.user()!;

  liste: Depense[] = [];       // kol dépenses mte3 user

  // filtres
  recherche = '';
  filtreCat = '';
  filtrePeriode = 'mois';

  // formulaire (idEdition = null → ajout, sinon modification)
  idEdition: number | null = null;
  montant: number | null = null;
  description = '';
  categorie = 'Alimentation';
  date = this.api.aujourdhui();
  erreur = '';

  ngOnInit() {
    this.charger();
  }

  charger() {
    this.api.getDepenses(this.user.id!).subscribe(l => this.liste = l);
  }

  // date de début selon la période choisie
  debutPeriode(): string {
    const j = new Date();
    if (this.filtrePeriode === 'tout') return '0000-00-00';
    if (this.filtrePeriode === 'aujourdhui') return this.api.formatDate(j);
    if (this.filtrePeriode === 'deux') j.setDate(j.getDate() - 1);
    else if (this.filtrePeriode === 'semaine') j.setDate(j.getDate() - 6);
    else return this.api.aujourdhui().substring(0, 8) + '01';   // début du mois
    return this.api.formatDate(j);
  }

  // liste filtrée (recherche + catégorie + période)
  get filtrees(): Depense[] {
    const debut = this.debutPeriode();
    return this.liste.filter(d =>
      d.description.toLowerCase().includes(this.recherche.toLowerCase()) &&
      (this.filtreCat === '' || d.categorie === this.filtreCat) &&
      d.date >= debut
    );
  }

  get total(): number {
    return this.filtrees.reduce((s, d) => s + d.montant, 0);
  }

  // Ajouter ou Modifier
  enregistrer() {
    if (!this.montant || this.montant <= 0 || !this.description) {
      this.erreur = 'Montant et description obligatoires';
      return;
    }
    const d: Depense = {
      id: this.idEdition ?? undefined,
      montant: this.montant,
      description: this.description,
      categorie: this.categorie,
      date: this.date,
      userId: this.user.id!
    };
    const requete = this.idEdition ? this.api.updateDepense(d) : this.api.addDepense(d);
    requete.subscribe(() => {
      this.annuler();     // vider le formulaire
      this.charger();     // recharger la liste
    });
  }

  // remplir le formulaire avec la dépense à modifier
  modifier(d: Depense) {
    this.idEdition = d.id!;
    this.montant = d.montant;
    this.description = d.description;
    this.categorie = d.categorie;
    this.date = d.date;
    this.erreur = '';
  }

  supprimer(d: Depense) {
    if (confirm('Supprimer "' + d.description + '" ?')) {
      this.api.deleteDepense(d.id!).subscribe(() => this.charger());
    }
  }

  // vider le formulaire
  annuler() {
    this.idEdition = null;
    this.montant = null;
    this.description = '';
    this.categorie = 'Alimentation';
    this.date = this.api.aujourdhui();
    this.erreur = '';
  }
}
