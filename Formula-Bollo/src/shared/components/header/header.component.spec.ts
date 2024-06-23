/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeaderComponent } from "./header.component";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { ThemeService } from "src/shared/services/theme.service";
import { AuthJWTService } from "src/shared/services/authJWT.service";
import { Router, RouterModule, NavigationEnd, ActivatedRoute, UrlTree } from "@angular/router";
import { Subject } from "rxjs";
import { MenubarModule } from "primeng/menubar";
import { ButtonModule } from "primeng/button";

describe("HeaderComponent", () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authJWTServiceSpy: jasmine.SpyObj<AuthJWTService>;
  let themeServiceSpy: jasmine.SpyObj<ThemeService>;
  let messageInfoServiceSpy: jasmine.SpyObj<MessageInfoService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let routerEventsSubject: Subject<any>;

  beforeEach(async () => {
    routerEventsSubject = new Subject<any>();

    routerSpy = jasmine.createSpyObj("Router", ["navigate", "createUrlTree", "serializeUrl"], {
      events: routerEventsSubject.asObservable()
    });
    routerSpy.createUrlTree.and.returnValue(new UrlTree());

    authJWTServiceSpy = jasmine.createSpyObj("AuthJWTService", ["isLogged"]);
    themeServiceSpy = jasmine.createSpyObj("ThemeService", ["checkTheme"]);
    messageInfoServiceSpy = jasmine.createSpyObj("MessageInfoService", ["showSuccess"]);
    activatedRouteSpy = jasmine.createSpyObj("ActivatedRoute", ["snapshot"], { snapshot: { url: [] } });

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        RouterModule,
        MenubarModule,
        ButtonModule
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthJWTService, useValue: authJWTServiceSpy },
        { provide: ThemeService, useValue: themeServiceSpy },
        { provide: MessageInfoService, useValue: messageInfoServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call some methods on ngOnInit", () => {
    spyOn(component, "changeNavItems");

    component.ngOnInit();

    expect(component.changeNavItems).toHaveBeenCalled();
    expect(authJWTServiceSpy.isLogged).toHaveBeenCalled();
    expect(themeServiceSpy.checkTheme).toHaveBeenCalled();
  });

  it("should change navigation items on route change", () => {
    routerEventsSubject.next(new NavigationEnd(1, "/fantasy/team", "/fantasy/team"));
    fixture.detectChanges();

    expect(component.routerLink).toBe(component.routerFantasyLink);
    expect(component.isFantasy).toBe(true);

    routerEventsSubject.next(new NavigationEnd(1, "/drivers", "/drivers"));
    fixture.detectChanges();

    component.selectNavItem("Pilotos");
    const navItem = document.querySelector(".p-menuitem-text-selected");
    expect(navItem?.innerHTML).toBe("Pilotos");

    expect(component.routerLink).toBe(component.routerBolloLink);
    expect(component.isFantasy).toBe(false);
  });

  it("should reset selected nav item", () => {
    component.resetSelectedNavItem();
    expect(component.activeNavItem).toBe("");
  });

  it("should call logoutcommand and navigate to login", () => {
    spyOn(localStorage, "removeItem");
    spyOn(component, "searchNavItemSelected");

    component.logoutAction();

    expect(localStorage.removeItem).toHaveBeenCalledWith("auth");
    expect(authJWTServiceSpy.isLogged).toHaveBeenCalled();
    expect(messageInfoServiceSpy.showSuccess).toHaveBeenCalledWith("Has cerrado sesión correctamente");
    expect(routerSpy.navigate).toHaveBeenCalledWith(["fantasy/login"]);
    expect(component.searchNavItemSelected).toHaveBeenCalled();
  });

  it("should correctly handle the p-menuitem-text-selected class", () => {
    const navContainer = document.createElement("div");
    navContainer.innerHTML = `
      <span class="p-menuitem-text">Pilotos</span>
      <span class="p-menuitem-text p-menuitem-text-selected">Escuderias</span>
      <span class="p-menuitem-text">Resultados</span>
    `;
    document.body.appendChild(navContainer);

    component.selectNavItem("Pilotos");

    const allNavItems = document.querySelectorAll(".p-menuitem-text");
    allNavItems.forEach((item) => {
      if (item.innerHTML !== "Pilotos") {
        expect(item.classList.contains("p-menuitem-text-selected")).toBe(false);
      }
    });

    const selectedNavItem = document.querySelector(".p-menuitem-text-selected");
    expect(selectedNavItem?.innerHTML).toBe("Pilotos");

    document.body.removeChild(navContainer);
  });

  it("should initialize bolloLinks correctly", () => {
    const expectedLabels = ["Pilotos", "Escuderias", "Resultados", "Estatuto", "Estadísticas", "Admin"];
    const expectedRouterLinks = [
      ["/drivers"], ["/teams"], ["/results"], ["/statute"], ["/stats"], ["/admin"]
    ];

    component.bolloLinks.forEach((link, index) => {
      expect(link.label).toBe(expectedLabels[index]);
      expect(link.routerLink).toEqual(expectedRouterLinks[index]);
      expect(typeof link.command).toBe("function");
    });
  });

  it("should execute bolloLinks command functions correctly", () => {
    const expectedLabels = ["Pilotos", "Escuderias", "Resultados", "Estatuto", "Stats", "Admin"];
    spyOn(component, "selectNavItem");
    component.bolloLinks.forEach((link, index) => {
      link.command();
      expect(component.selectNavItem).toHaveBeenCalledWith(expectedLabels[index]);
    });
  });

  it("should initialize fantasyLinksLogIn correctly", () => {
    const expectedLabels = ["Mi Equipo", "Clasificación", "Iniciar Sesión"];
    const expectedRouterLinks = [
      ["/fantasy/team"], ["/fantasy/clasification"], ["/fantasy/login"]
    ];

    component.fantasyLinksLogIn.forEach((link, index) => {
      expect(link.label).toBe(expectedLabels[index]);
      expect(link.routerLink).toEqual(expectedRouterLinks[index]);
      expect(typeof link.command).toBe("function");
    });
  });

  it("should execute fantasyLinksLogIn command functions correctly", () => {
    const expectedLabels = ["Mi Equipo", "Clasificación", "Iniciar Sesión"];
    spyOn(component, "selectNavItem");
    component.fantasyLinksLogIn.forEach((link, index) => {
      link.command();
      expect(component.selectNavItem).toHaveBeenCalledWith(expectedLabels[index]);
    });
  });

  it("should initialize fantasyLinksClose correctly", () => {
    const expectedLabels = ["Mi Equipo", "Clasificación", "Cerrar Sesión"];
    const expectedRouterLinks = [
      ["/fantasy/team"], ["/fantasy/clasification"], ["/fantasy"]
    ];

    component.fantasyLinksClose.forEach((link, index) => {
      expect(link.label).toBe(expectedLabels[index]);
      expect(link.routerLink).toEqual(expectedRouterLinks[index]);
      expect(typeof link.command).toBe("function");
    });
  });

  it("should execute fantasyLinksClose command functions correctly", () => {
    const expectedLabels = ["Mi Equipo", "Clasificación", "Cerrar Sesión"];
    spyOn(component, "selectNavItem");
    spyOn(component, "logoutAction");
    component.fantasyLinksClose.forEach((link, index) => {
      link.command();
      if (link.label === "Cerrar Sesión") {
        expect(component.logoutAction).toHaveBeenCalled();
      } else {
        expect(component.selectNavItem).toHaveBeenCalledWith(expectedLabels[index]);
      }
    });
  });
});
