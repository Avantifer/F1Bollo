import { Component } from '@angular/core';
import HeaderLinks from 'src/shared/models/headerLinks';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  activeNavItem: string = '';
  isNavOpen: boolean = false;

  /**
   * Reset the active navItem from Header.
   * @memberof HomeComponent
  */
  selectNavItem(navItem: string): void {
    this.activeNavItem = navItem;
    if (document.getElementsByClassName("in")[0]) {
      document.getElementsByClassName("in")[0].classList.remove("in");
    };
  }

  /**
   * Set the active navItem for Header.
   * @memberof HomeComponent
  */
  resetSelectedNavItem(): void {
    this.activeNavItem = '';
  }

  links: HeaderLinks[] = [
    new HeaderLinks("Pilotos", "/drivers"),
    new HeaderLinks("Escuderias", "/teams"),
    new HeaderLinks("Calendario", "/schedule"),
    new HeaderLinks("Resultados", "/results"),
    new HeaderLinks("Estatuto", "/statute"),
    new HeaderLinks("Admin", "/admin")
  ]
}
