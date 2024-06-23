import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthJWTService } from "../services/authJWT.service";
import { RecoverPasswordGuard } from "./RecoverPasswordGuard";

describe("RecoverPasswordGuard", () => {
  let guard: RecoverPasswordGuard;
  let authJWTService: jasmine.SpyObj<AuthJWTService>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj("AuthJWTService", ["checkTokenValid", "isLogged"]);
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    TestBed.configureTestingModule({
      providers: [
        RecoverPasswordGuard,
        { provide: AuthJWTService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(RecoverPasswordGuard);
    authJWTService = TestBed.inject(AuthJWTService) as jasmine.SpyObj<AuthJWTService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = new ActivatedRouteSnapshot();
    state = {
      url: "/recover-password/token123",
      root: route,
    } as RouterStateSnapshot;
  });

  it("should be created", () => {
    expect(guard).toBeTruthy();
  });

  it("should return true if token is valid and user is not logged in", () => {
    authJWTService.checkTokenValid.and.returnValue(true);
    authJWTService.isLogged.and.returnValue(false);

    const result = guard.canActivate(route, state);

    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it("should return false and navigate to /fantasy if token is invalid", () => {
    authJWTService.checkTokenValid.and.returnValue(false);
    authJWTService.isLogged.and.returnValue(false);

    const result = guard.canActivate(route, state);

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(["/fantasy"]);
  });

  it("should return false and navigate to /fantasy if user is logged in", () => {
    authJWTService.checkTokenValid.and.returnValue(true);
    authJWTService.isLogged.and.returnValue(true);

    const result = guard.canActivate(route, state);

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(["/fantasy"]);
  });
});
