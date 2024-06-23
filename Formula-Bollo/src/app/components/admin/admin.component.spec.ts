/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminComponent } from "./admin.component";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { MatSidenavModule } from "@angular/material/sidenav";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Subject } from "rxjs";

describe("AdminComponent", () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  const routerSpy = { url: "/admin/results", navigate: jasmine.createSpy("navigate"), events: new Subject() };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [AdminComponent],
      imports: [
        MatSidenavModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call searchNavItemSelected on ngOnInit", () => {
    spyOn(component, "searchNavItemSelected");

    component.ngOnInit();

    expect(component.searchNavItemSelected).toHaveBeenCalled();
  });

  it("should subscribe to router events in drawerCanBeOpened and set activeNavItem", () => {
    spyOn(component, "drawerCanBeOpened").and.callThrough();
    fixture.detectChanges();

    routerSpy.url = "/admin/results";
    component.drawerCanBeOpened();

    let event = new NavigationEnd(1, "/admin/results", "/admin/results");
    routerSpy.events.next(event);

    event = new NavigationEnd(1, "/admin", "/admin");
    routerSpy.events.next(event);

    expect(component.activeNavItem).toBe("");

  });

  it("should set the active navigation item correctly in selectNavItem", () => {
    spyOn(component, "drawerCanBeOpened");
    fixture.detectChanges();

    const sideNavItemElement = document.createElement("div");
    sideNavItemElement.classList.add("admin-leftSide-item");

    component.selectNavItem(sideNavItemElement);

    expect(sideNavItemElement.classList).toContain("active");

    component.selectNavItem(sideNavItemElement);

    component.selectNavItem(null);

    const sideNavItemSon = document.createElement("p");
    sideNavItemElement.appendChild(sideNavItemSon);

    component.selectNavItem(sideNavItemSon);
  });

  it("should find and set the correct active navigation item in searchNavItemSelected", () => {
    component.searchNavItemSelected();
    expect(component.activeNavItem).toBe("Resultados");

    routerSpy.url = "/admin/penalties";
    component.searchNavItemSelected();
    expect(component.activeNavItem).toBe("Penalizaciones");

    routerSpy.url = "/admin/prueba";
    component.searchNavItemSelected();
  });
});
