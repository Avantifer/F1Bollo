import { Component } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import HeaderLinks from "src/shared/models/headerLinks";
import { ThemeService } from "src/shared/services/theme.service";
import { AuthJWTService } from "src/shared/services/authJWT.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  bolloLinks: HeaderLinks[] = [
    new HeaderLinks("Pilotos", ["/drivers"], () => this.selectNavItem("Pilotos")),
    new HeaderLinks("Escuderias", ["/teams"], () => this.selectNavItem("Escuderias")),
    new HeaderLinks("Resultados", ["/results"], () => this.selectNavItem("Resultados")),
    new HeaderLinks("Estatuto", ["/statute"], () => this.selectNavItem("Estatuto")),
    new HeaderLinks("Estadísticas", ["/stats"], () => this.selectNavItem("Stats")),
    new HeaderLinks("Admin", ["/admin"], () => this.selectNavItem("Admin"))
  ];

  fantasyLinksLogIn: HeaderLinks[] = [
    new HeaderLinks("Mi Equipo", ["/fantasy/team"], () => this.selectNavItem("Mi Equipo")),
    new HeaderLinks("Clasificación", ["/fantasy/clasification"], () => this.selectNavItem("Clasificación")),
    new HeaderLinks("Iniciar Sesión", ["/fantasy/login"], () => this.selectNavItem("Iniciar Sesión"))
  ];

  fantasyLinksClose: HeaderLinks[] = [
    new HeaderLinks("Mi Equipo", ["/fantasy/team"], () => this.selectNavItem("Mi Equipo")),
    new HeaderLinks("Clasificación", ["/fantasy/clasification"], () => this.selectNavItem("Clasificación")),
    new HeaderLinks("Cerrar Sesión", ["/fantasy"], () => this.logoutAction())
  ];

  urlMappings: { [key: string]: string } = {
    "/drivers": "Pilotos",
    "/teams": "Escuderias",
    "/results": "Resultados",
    "/statute": "Estatuto",
    "/stats": "Estadísticas",
    "/admin": "Admin",
    "/login": "Admin",
    "/fantasy/team": "Mi Equipo",
    "/fantasy/clasification": "Clasificación",
    "/fantasy/login": "Iniciar Sesión"
  };

  routerLink: string = "";
  routerBolloLink: string = "/";
  routerFantasyLink: string = "/fantasy";
  activeNavItem: string = "";

  isDarkTheme: boolean = false;
  isFantasy: boolean = false;

  private _unsubscribe = new Subject<void>();

  constructor(
    private router: Router,
    public authJWTService: AuthJWTService,
    public themeService: ThemeService,
    private messageInfoService: MessageInfoService
  ) { }

  ngOnInit(): void {
    this.isDarkTheme = this.themeService.checkTheme();
    this.authJWTService.isLogged();
    this.changeNavItems();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Reset the active navItem from Header.
   */
  selectNavItem(navItemSelected: string): void {
    const allNavItem: NodeListOf<Element> = document.querySelectorAll(
      "span.p-menuitem-text",
    );

    allNavItem.forEach((navItem: Element) => {
      if (navItem.classList.contains("p-menuitem-text-selected")) {
        navItem.classList.remove("p-menuitem-text-selected");
      }

      if (navItem.innerHTML === navItemSelected) {
        navItem.classList.add("p-menuitem-text-selected");
      }
    });
  }

  /**
   * Delete the previous selected nav item (occurs when logo is clicked).
   */
  resetSelectedNavItem(): void {
    this.activeNavItem = "";
    this.authJWTService.isLogged();
  }

  /**
   * Search and set the currently selected navigation item based on the current URL.
   */
  searchNavItemSelected(): void {
    const allurl: string = window.location.href;

    const startIndex: number = allurl.indexOf("/", 8);
    const urlSelected: string = allurl.substring(startIndex);

    this.activeNavItem = this.urlMappings[urlSelected];

    this.selectNavItem(this.activeNavItem);
  }

  /**
   * Changes navigation items based on the current route.
   */
  changeNavItems(): void {
    this.router.events
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (event) => {
          if (event instanceof NavigationEnd) {
            if (event.url.includes("fantasy")) {
              this.routerLink = this.routerFantasyLink;
              this.isFantasy = true;
            } else {
              this.routerLink = this.routerBolloLink;
              this.isFantasy = false;
            }

            // Gives time to check what links are show.
            setTimeout(() => {
              this.searchNavItemSelected();
            }, 0);
          }
        },
      });
  }

  /**
   * Log out the user removing the item auth of localStorage and refreshing to show "Iniciar sesión".
   */
  logoutAction(): void {
    localStorage.removeItem("auth");
    this.authJWTService.isLogged();
    this.messageInfoService.showSuccess("Has cerrado sesión correctamente");
    this.router.navigate(["fantasy/login"]);
    this.searchNavItemSelected();
  }
}
