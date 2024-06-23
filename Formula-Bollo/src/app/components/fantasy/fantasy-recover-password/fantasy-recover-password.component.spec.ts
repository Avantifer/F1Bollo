import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FantasyRecoverPasswordComponent } from "./fantasy-recover-password.component";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { AccountApiService } from "src/shared/services/api/account-api.service";
import { AuthJWTService } from "src/shared/services/authJWT.service";
import { Router } from "@angular/router";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { PasswordModule } from "primeng/password";
import { ButtonModule } from "primeng/button";
import { of, throwError } from "rxjs";
import { ERROR_FORM_NOT_VALID } from "src/app/constants";

describe("FantasyRecoverPasswordComponent", () => {
  let component: FantasyRecoverPasswordComponent;
  let fixture: ComponentFixture<FantasyRecoverPasswordComponent>;
  const routerSpy = { url: "/fantasy/recoverPassword/eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBdmFudGlmZXIiLCJ1c2VySWQiOjIsImFkbWluIjoxLCJpYXQiOjE3MTM3MzIzOTEsImV4cCI6MTcxNjMyNDM5MX0.GrnIdQugE_D0RnWYs_U12ItrmVgploMk0B5SXzECdGw", navigate: jasmine.createSpy("navigate") };
  let messageInfoServiceSpy: jasmine.SpyObj<MessageInfoService>;
  let accountApiServiceSpy: jasmine.SpyObj<AccountApiService>;
  let authJWTServiceSpy: jasmine.SpyObj<AuthJWTService>;

  beforeEach(async () => {
    messageInfoServiceSpy = jasmine.createSpyObj("MessageInfoService", ["showSuccess", "showError"]);
    accountApiServiceSpy = jasmine.createSpyObj("AccountApiService", ["changePassword"]);
    authJWTServiceSpy = jasmine.createSpyObj("AuthJWTService", ["getUsernameFromToken"]);

    await TestBed.configureTestingModule({
      declarations: [FantasyRecoverPasswordComponent],
      imports: [
        InputGroupModule,
        InputGroupAddonModule,
        PasswordModule,
        ButtonModule
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: MessageInfoService, useValue: messageInfoServiceSpy },
        { provide: AccountApiService, useValue: accountApiServiceSpy },
        { provide: AuthJWTService, useValue: authJWTServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FantasyRecoverPasswordComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should get token calling ngOnInit", () => {
    component.ngOnInit();
    expect(component.token).toBe("eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBdmFudGlmZXIiLCJ1c2VySWQiOjIsImFkbWluIjoxLCJpYXQiOjE3MTM3MzIzOTEsImV4cCI6MTcxNjMyNDM5MX0.GrnIdQugE_D0RnWYs_U12ItrmVgploMk0B5SXzECdGw");
  });

  it("should initialize the form with empty controls", () => {
    expect(component.recoverPasswordForm.get("password")?.value).toBe("");
    expect(component.recoverPasswordForm.get("passwordRepeated")?.value).toBe("");
  });

  it("should have invalid form when passwords do not match", () => {
    component.recoverPasswordForm.get("password")?.setValue("password1");
    component.recoverPasswordForm.get("passwordRepeated")?.setValue("password2");
    expect(component.recoverPasswordForm.invalid).toBeTruthy();
  });

  it("should have valid form when passwords match", () => {
    component.recoverPasswordForm.get("password")?.setValue("password1");
    component.recoverPasswordForm.get("passwordRepeated")?.setValue("password1");
    expect(component.recoverPasswordForm.valid).toBeTruthy();
  });

  it("should call changePassword and navigate on successful password change", () => {
    authJWTServiceSpy.getUsernameFromToken.and.returnValue("username");
    accountApiServiceSpy.changePassword.and.returnValue(of("Password changed successfully"));

    component.recoverPasswordForm.get("password")?.setValue("password1");
    component.recoverPasswordForm.get("passwordRepeated")?.setValue("password1");

    component.changePassword();

    expect(accountApiServiceSpy.changePassword).toHaveBeenCalledWith("password1", "username");
    expect(messageInfoServiceSpy.showSuccess).toHaveBeenCalledWith("Password changed successfully");
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/fantasy/login"]);
  });

  it("should call showError on unsuccessful password change", () => {
    authJWTServiceSpy.getUsernameFromToken.and.returnValue("username");
    accountApiServiceSpy.changePassword.and.returnValue(throwError(() => ERROR_FORM_NOT_VALID));

    component.recoverPasswordForm.get("password")?.setValue("password1");
    component.recoverPasswordForm.get("passwordRepeated")?.setValue("password1");

    component.changePassword();

    expect(accountApiServiceSpy.changePassword).toHaveBeenCalledWith("password1", "username");
  });

  it("should show form not valid error when form is invalid", () => {
    component.recoverPasswordForm.get("password")?.setValue("");
    component.recoverPasswordForm.get("passwordRepeated")?.setValue("");

    component.changePassword();

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_FORM_NOT_VALID);
  });
});
