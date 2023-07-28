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
    new HeaderLinks("Resultados", "/results"),
    new HeaderLinks("Estatuto", "/statute"),
    new HeaderLinks("Admin", "/admin")
  ];
  activeNavItem: string = '';
  isNavOpen: boolean = false;

  ngOnInit(): void {
    this.searchNavItemSelected();
  }

  /**
   * Reset the active navItem from Header.
   * @memberof HomeComponent
  */
  selectNavItem(navItem: string): void {
    this.activeNavItem = navItem;
    this.collapseNavWhenSelectNavItem();
  }

  /**
   * Set the active navItem for Header.
   * @memberof HomeComponent
  */
  resetSelectedNavItem(): void {
    this.activeNavItem = '';
    this.collapseNavWhenSelectNavItem();
  }

  /**
   * Collapse navBar on Mobile when click navItem.
   * @memberof HomeComponent
  */
  collapseNavWhenSelectNavItem(): void {
    if (document.getElementsByClassName("in")[0]) {
      document.getElementsByClassName("in")[0].classList.remove("in");
    };
  }

  /**
   * Remove navBar of lateral on AdminComponent.
   * @memberof HomeComponent
   * @memberof AdminComponent
  */
  resetNavItemAdmin(): void {
    let navItemSelected: NodeListOf<Element> = document.querySelectorAll('.admin-leftSide-item.active');

    if (navItemSelected.length === 0) return;

    navItemSelected.forEach((navItemSelected: Element) => {
      navItemSelected.classList.remove('active');
    });
  }

  /**
   * Know in what component he is when refresh application
   * @memberof HomeComponent
  */
  searchNavItemSelected(): void {
    // Get the current URL
    let allurl: string = window.location.href;
    // Find the index of the first "/" after the domain name
    let startIndex: number = allurl.indexOf("/", 8);
    // Find the index of the second "/" after the domain name
    let endIndex: number = allurl.indexOf("/", startIndex + 1);
    // Extract the selected URL from the full URL
    let urlSelected: string = endIndex !== -1 ? allurl.substring(startIndex, endIndex) : allurl.substring(startIndex);
    // Find the corresponding navigation item using the selected URL
    let actualNavItem: HeaderLinks | undefined = this.links.find((link: HeaderLinks) => link.url === urlSelected);
    // If no matching navigation item is found, return
    if (actualNavItem === undefined) return;
    // Set the active navigation item
    this.activeNavItem = actualNavItem.name;
  }
}
