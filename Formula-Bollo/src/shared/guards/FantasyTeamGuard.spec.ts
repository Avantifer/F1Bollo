import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { AuthJWTService } from "../services/authJWT.service";
import { MessageInfoService } from "../services/messageinfo.service";
import { WARNING_NO_LOGIN } from "src/app/constants";
import { FantasyTeamGuard } from "./FantasyTeamGuard";

describe("FantasyTeamGuard", () => {
  let guard: FantasyTeamGuard;
  let authJWTService: jasmine.SpyObj<AuthJWTService>;
  let router: jasmine.SpyObj<Router>;
  let messageInfoService: jasmine.SpyObj<MessageInfoService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj("AuthJWTService", ["isLogged"]);
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
    const messageInfoSpy = jasmine.createSpyObj("MessageInfoService", ["showWarn"]);

    TestBed.configureTestingModule({
      providers: [
        FantasyTeamGuard,
        { provide: AuthJWTService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MessageInfoService, useValue: messageInfoSpy },
      ],
    });

    guard = TestBed.inject(FantasyTeamGuard);
    authJWTService = TestBed.inject(AuthJWTService) as jasmine.SpyObj<AuthJWTService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    messageInfoService = TestBed.inject(MessageInfoService) as jasmine.SpyObj<MessageInfoService>;
  });

  it("should be created", () => {
    expect(guard).toBeTruthy();
  });

  it("should return true if the user is logged in", () => {
    authJWTService.isLogged.and.returnValue(true);

    const result = guard.canActivate();

    expect(result).toBeTrue();
    expect(messageInfoService.showWarn).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it("should return false, show warning, and navigate to \"/fantasy/login\" if the user is not logged in", () => {
    authJWTService.isLogged.and.returnValue(false);

    const result = guard.canActivate();

    expect(result).toBeFalse();
    expect(messageInfoService.showWarn).toHaveBeenCalledWith(WARNING_NO_LOGIN);
    expect(router.navigate).toHaveBeenCalledWith(["/fantasy/login"]);
  });
});
