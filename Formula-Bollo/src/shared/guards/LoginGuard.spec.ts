import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { AuthJWTService } from "../services/authJWT.service";
import { LoginGuard } from "./LoginGuard";

describe("LoginGuard", () => {
  let guard: LoginGuard;
  let authJWTService: jasmine.SpyObj<AuthJWTService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj("AuthJWTService", ["isLogged"]);
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    TestBed.configureTestingModule({
      providers: [
        LoginGuard,
        { provide: AuthJWTService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(LoginGuard);
    authJWTService = TestBed.inject(AuthJWTService) as jasmine.SpyObj<AuthJWTService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it("should be created", () => {
    expect(guard).toBeTruthy();
  });

  it("should return false and navigate to / if the user is logged in", () => {
    authJWTService.isLogged.and.returnValue(true);

    const result = guard.canActivate();

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(["/"]);
  });

  it("should return true if the user is not logged in", () => {
    authJWTService.isLogged.and.returnValue(false);

    const result = guard.canActivate();

    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
