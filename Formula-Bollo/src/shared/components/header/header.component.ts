import { Component } from '@angular/core';
import HeaderLinks from 'src/shared/models/headerLinks';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  links: HeaderLinks[] = [
    new HeaderLinks("Pilotos", "/drivers"),
    new HeaderLinks("Escuderias", "/teams"),
    new HeaderLinks("Calendario", "/schedule"),
    new HeaderLinks("Resultados", "/results"),
    new HeaderLinks("Estatuto", "/statute"),
  ]

}
