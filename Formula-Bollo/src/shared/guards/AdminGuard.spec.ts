import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { AuthJWTService } from "../services/authJWT.service";
import { MessageInfoService } from "../services/messageinfo.service";
import { WARNING_NO_ADMIN } from "src/app/constants";
import { AdminGuard } from "./AdminGuard";

describe("AdminGuard", () => {
  let guard: AdminGuard;
  let authJWTService: jasmine.SpyObj<AuthJWTService>;
  let router: jasmine.SpyObj<Router>;
  let messageInfoService: jasmine.SpyObj<MessageInfoService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj("AuthJWTService", ["checkAdmin"]);
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
    const messageInfoSpy = jasmine.createSpyObj("MessageInfoService", ["showError"]);

    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: AuthJWTService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MessageInfoService, useValue: messageInfoSpy },
      ],
    });

    guard = TestBed.inject(AdminGuard);
    authJWTService = TestBed.inject(AuthJWTService) as jasmine.SpyObj<AuthJWTService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    messageInfoService = TestBed.inject(MessageInfoService) as jasmine.SpyObj<MessageInfoService>;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should be created", () => {
    expect(guard).toBeTruthy();
  });

  it("should return true if there is an auth token and the user is an admin", () => {
    localStorage.setItem("auth", "validToken");
    authJWTService.checkAdmin.and.returnValue(true);

    const result = guard.canActivate();

    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(messageInfoService.showError).not.toHaveBeenCalled();
  });

  it("should return false and navigate to / with an error message if the user is not an admin", () => {
    localStorage.setItem("auth", "validToken");
    authJWTService.checkAdmin.and.returnValue(false);

    const result = guard.canActivate();

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(["/"]);
    expect(messageInfoService.showError).toHaveBeenCalledWith(WARNING_NO_ADMIN);
  });

  it("should return false and navigate to /login if there is no auth token", () => {
    const result = guard.canActivate();

    expect(result).toBeFalse();
  });
});
