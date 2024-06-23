import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LoginComponent } from "./login.component";
import { AccountApiService } from "src/shared/services/api/account-api.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { Router } from "@angular/router";
import { AuthJWTService } from "src/shared/services/authJWT.service";
import { ReactiveFormsModule } from "@angular/forms";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { DialogModule } from "primeng/dialog";
import { ERROR_EMAIL_NOT_VALID, INFO_CREDENTIALS_NEED, WARNING_NO_ADMIN } from "src/app/constants";
import { of, throwError } from "rxjs";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let accountApiServiceSpy: jasmine.SpyObj<AccountApiService>;
  let messageInfoServiceSpy: jasmine.SpyObj<MessageInfoService>;
  let authJWTServiceSpy: jasmine.SpyObj<AuthJWTService>;
  const routerSpy = { url: "/fantasy", navigate: jasmine.createSpy("navigate") };

  beforeEach(async () => {
    accountApiServiceSpy = jasmine.createSpyObj("AccountApiService", ["login", "recoverPassword"]);
    messageInfoServiceSpy = jasmine.createSpyObj("MessageInfoService", ["showError", "showInfo", "showWarn", "showSuccess"]);
    authJWTServiceSpy = jasmine.createSpyObj("AuthJWTService", ["isLogged", "checkAdmin"]);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        InputGroupModule,
        InputGroupAddonModule,
        DialogModule
      ],
      providers: [
        { provide: AccountApiService, useValue: accountApiServiceSpy},
        { provide: MessageInfoService, useValue: messageInfoServiceSpy},
        { provide: Router, useValue: routerSpy},
        { provide: AuthJWTService, useValue: authJWTServiceSpy}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call checkIsFantasy on ngOnInit", () => {
    spyOn(component, "checkIsFantasy");
    component.ngOnInit();
    expect(component.checkIsFantasy).toHaveBeenCalled();
  });

  it("should need login credentials", () => {
    component.loginForm.setValue({ username: "", password: "" });
    component.login();
    expect(accountApiServiceSpy.login).not.toHaveBeenCalled();
    expect(messageInfoServiceSpy.showInfo).toHaveBeenCalledWith(INFO_CREDENTIALS_NEED);
  });

  it("should login and show warning if user is not admin", () => {
    localStorage.clear();

    const token = "user-token";
    component.loginForm.setValue({ username: "user", password: "password" });
    accountApiServiceSpy.login.and.returnValue(of(token));
    authJWTServiceSpy.checkAdmin.and.returnValue(false);

    component.login();

    expect(accountApiServiceSpy.login).toHaveBeenCalled();
    expect(authJWTServiceSpy.checkAdmin).toHaveBeenCalledWith(token);
    expect(localStorage.getItem("auth")).toBeNull();
    expect(messageInfoServiceSpy.showWarn).toHaveBeenCalledWith(WARNING_NO_ADMIN);
  });

  it("should login and navigate to admin if user is admin", () => {
    const token = "admin-token";
    component.loginForm.setValue({ username: "admin", password: "password" });
    accountApiServiceSpy.login.and.returnValue(of(token));
    authJWTServiceSpy.checkAdmin.and.returnValue(true);

    component.login();

    expect(accountApiServiceSpy.login).toHaveBeenCalled();
    expect(authJWTServiceSpy.checkAdmin).toHaveBeenCalledWith(token);
    expect(localStorage.getItem("auth")).toBe(token);
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/admin"]);
  });

  it("should handle error when login fails", () => {
    const errorResponse = {
      error: "Login failed"
    };
    component.loginForm.setValue({ username: "user", password: "password" });
    accountApiServiceSpy.login.and.returnValue(throwError(errorResponse));

    component.login();

    expect(accountApiServiceSpy.login).toHaveBeenCalled();
    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(errorResponse.error);
  });

  it("should need login fantasy credentials", () => {
    component.loginForm.setValue({ username: "", password: "" });
    component.loginFantasy();
    expect(accountApiServiceSpy.login).not.toHaveBeenCalled();
    expect(messageInfoServiceSpy.showWarn).toHaveBeenCalledWith(INFO_CREDENTIALS_NEED);
  });

  it("should login fantasy and navigate to fantasy", () => {
    const token = "admin-token";
    component.loginForm.setValue({ username: "admin", password: "password" });
    accountApiServiceSpy.login.and.returnValue(of(token));
    authJWTServiceSpy.checkAdmin.and.returnValue(true);

    component.loginFantasy();

    expect(accountApiServiceSpy.login).toHaveBeenCalled();
    expect(localStorage.getItem("auth")).toBe(token);
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/fantasy"]);
  });

  it("should handle error when login fantasy fails", () => {
    const errorResponse = {
      error: "Login failed"
    };
    component.loginForm.setValue({ username: "user", password: "password" });
    accountApiServiceSpy.login.and.returnValue(throwError(errorResponse));

    component.loginFantasy();

    expect(accountApiServiceSpy.login).toHaveBeenCalled();
    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(errorResponse.error);
  });

  it("should check if url is fantasy or not", () => {
    routerSpy.url = "/fantasy";
    component.checkIsFantasy();
    expect(component.isFantasy).toBeTrue;

    routerSpy.url = "/admin";
    component.checkIsFantasy();
    expect(component.isFantasy).toBeFalse;
  });

  it("should openRecoverypassword dialog", () => {
    component.openRecoveryPasswordDialog();
    expect(component.showDialog).toBeTrue;
  });

  it("should show error email not valid with send recovery password email", () => {
    component.emailForm.setValue({ email: "" });

    component.sendRecoveryPasswordEmail();

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_EMAIL_NOT_VALID);
  });

  it("should call recoverPassword and show success on successful recovery", () => {
    component.emailForm.controls["email"].setValue("test@example.com");
    accountApiServiceSpy.recoverPassword.and.returnValue(of("Password recovery email sent"));

    component.sendRecoveryPasswordEmail();

    expect(accountApiServiceSpy.recoverPassword).toHaveBeenCalledWith("test@example.com");
    expect(messageInfoServiceSpy.showSuccess).toHaveBeenCalledWith("Password recovery email sent");
  });

  it("should call recoverPassword and show error on failed recovery", () => {
    component.emailForm.controls["email"].setValue("test@example.com");
    accountApiServiceSpy.recoverPassword.and.returnValue(throwError({ error: "Recovery email failed" }));

    component.sendRecoveryPasswordEmail();

    expect(accountApiServiceSpy.recoverPassword).toHaveBeenCalledWith("test@example.com");
    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith("Recovery email failed");
  });

  it("should close the dialog after sending the email", () => {
    component.showDialog = true;
    component.emailForm.controls["email"].setValue("test@example.com");
    accountApiServiceSpy.recoverPassword.and.returnValue(of("Password recovery email sent"));

    component.sendRecoveryPasswordEmail();

    expect(component.showDialog).toBeFalse();
  });
});
