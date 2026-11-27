import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html'
})
export class Home {
  // scroll doucement vers la section "Kifech temchi"
  defiler() {
    document.getElementById('etapes')?.scrollIntoView({ behavior: 'smooth' });
  }
}
