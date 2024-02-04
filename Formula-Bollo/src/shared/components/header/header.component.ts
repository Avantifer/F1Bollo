import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import HeaderLinks from 'src/shared/models/headerLinks';
import { AuthJWTService } from 'src/shared/services/authJWT.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  links: HeaderLinks[] = [];
  bolloLinks: HeaderLinks[] = [
    new HeaderLinks("Pilotos", "/drivers"),
    new HeaderLinks("Escuderias", "/teams"),
    new HeaderLinks("Resultados", "/results"),
    new HeaderLinks("Estatuto", "/statute"),
    new HeaderLinks("Admin", "/admin")
  ];
  fantasyLinks: HeaderLinks[] = [
    new HeaderLinks("Mi Equipo", "/fantasy/team"),
    new HeaderLinks("Clasificación", "/fantasy/clasification"),
    new HeaderLinks("Iniciar Sesión", "/fantasy/login"),
  ];

  routerLink: string = '';
  routerBolloLink: string = '/';
  routerFantasyLink: string = '/fantasy';

  activeNavItem: string = '';

  isNavOpen: boolean = false;
  isFantasy: boolean = false;

  private _unsubscribe= new Subject<void>();

  constructor(private router: Router, public authJWTService: AuthJWTService) { }

  ngOnInit(): void {
    this.changeNavItems();
    this.searchNavItemSelected();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Reset the active navItem from Header.
  */
  selectNavItem(navItem: string): void {
    this.activeNavItem = navItem;
    this.collapseNavWhenSelectNavItem();
  }

  /**
   * Set the active navItem for Header.
  */
  resetSelectedNavItem(): void {
    this.activeNavItem = '';
    this.collapseNavWhenSelectNavItem();
  }

  /**
   * Collapse navBar on Mobile when click navItem.
  */
  collapseNavWhenSelectNavItem(): void {
    if (document.querySelector('.navbar-collapse')?.classList.contains('show')){
      document.querySelector('.navbar-collapse')?.classList.remove('show');
    }
  }

  /**
   * Resets the 'active' class from elements with the class 'admin-leftSide-item'.
  */
  resetNavItemAdmin(): void {
    let navItemSelected: NodeListOf<Element> = document.querySelectorAll('.admin-leftSide-item.active');

    if (navItemSelected.length === 0) return;

    navItemSelected.forEach((navItemSelected: Element) => {
      navItemSelected.classList.remove('active');
    });
  }

  /**
   * Search and set the currently selected navigation item based on the current URL.
  */
  searchNavItemSelected(): void {
    let allurl: string = window.location.href;
    // Find the index of the first forward slash after the domain part of the URL.
    let startIndex: number = allurl.indexOf("/", 8);

    let urlSelected: string = '';
    if (!allurl.includes('fantasy')) {
      // Find the index of the second forward slash after the domain part of the URL.
      let endIndex: number = allurl.indexOf("/", startIndex + 1);
      urlSelected = endIndex !== -1 ? allurl.substring(startIndex, endIndex) : allurl.substring(startIndex);
    } else {
      urlSelected = allurl.substring(startIndex);
    }

    let actualNavItem: HeaderLinks | undefined = this.links.find((link: HeaderLinks) => link.url === urlSelected);

    if (actualNavItem === undefined) return;
    this.activeNavItem = actualNavItem.name;
  }

  /**
   * Changes navigation items based on the current route.
  */
  changeNavItems(): void {
    this.router.events.pipe(
      takeUntil(this._unsubscribe)
    )
    .subscribe({
      next: (event) => {
        if (event instanceof NavigationEnd) {
          if (event.url.includes('fantasy')) {
            this.links = this.fantasyLinks;
            this.routerLink = this.routerFantasyLink;
            this.isFantasy = true;
          } else {
            this.links = this.bolloLinks;
            this.routerLink = this.routerBolloLink;
            this.isFantasy = false;
          }
          this.searchNavItemSelected();
        }
      }
    });
  }

  /**
   * Delete the activeItem switching between fantasy and bollo
  */
  deleteSelected(): void {
    let navItemSelected: Element | null = document.querySelector('.navlink.active');

    if (navItemSelected == null) return;
    navItemSelected.classList.remove('active');
    this.activeNavItem = '';
  }
}
