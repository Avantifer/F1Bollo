import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FantasyRegisterComponent } from "./fantasy-register.component";
import { Subject, of, throwError } from "rxjs";
import { AccountApiService } from "src/shared/services/api/account-api.service";
import { DriverApiService } from "src/shared/services/api/driver-api.service";
import { AuthJWTService } from "src/shared/services/authJWT.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { Router } from "@angular/router";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { PasswordModule } from "primeng/password";
import { ButtonModule } from "primeng/button";
import { ERROR_DRIVER_FETCH, ERROR_FORM_NOT_VALID, SUCCESS_REGISTER } from "src/app/constants";
import { Driver } from "src/shared/models/driver";
import { Team } from "src/shared/models/team";
import { Season } from "src/shared/models/season";

describe("FantasyRegisterComponent", () =>  {
  let component: FantasyRegisterComponent;
  let fixture: ComponentFixture<FantasyRegisterComponent>;
  const routerSpy = { url: "/fantasy/register", navigate: jasmine.createSpy("navigate"), events: new Subject() };
  let accountApiServiceSpy: jasmine.SpyObj<AccountApiService>;
  let messageInfoServiceSpy: jasmine.SpyObj<MessageInfoService>;
  let authJWTServiceSpy: jasmine.SpyObj<AuthJWTService>;
  let driverApiServiceSpy: jasmine.SpyObj<DriverApiService>;

  beforeEach(async () => {
    accountApiServiceSpy = jasmine.createSpyObj("AccountApiService", ["register"]);
    messageInfoServiceSpy = jasmine.createSpyObj("MessageInfoService", ["showSuccess", "showError"]);
    authJWTServiceSpy = jasmine.createSpyObj("AuthJWTService", ["isLogged"]);
    driverApiServiceSpy = jasmine.createSpyObj("DriverApiService", ["getAllDrivers"]);

    await TestBed.configureTestingModule({
      declarations: [FantasyRegisterComponent],
      imports: [
        InputGroupModule,
        InputGroupAddonModule,
        PasswordModule,
        ButtonModule
      ],
      providers: [
        { provide: AccountApiService, useValue: accountApiServiceSpy},
        { provide: MessageInfoService, useValue: messageInfoServiceSpy},
        { provide: AuthJWTService, useValue: authJWTServiceSpy},
        { provide: DriverApiService, useValue: driverApiServiceSpy},
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FantasyRegisterComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call getAllDrivers on ngOnInit", () => {
    spyOn(component, "getAllDrivers");

    component.ngOnInit();

    expect(component.getAllDrivers).toHaveBeenCalled();
  });

  it("should initialize the form with empty controls", () => {
    expect(component.registerForm.get("password")?.value).toBe("");
    expect(component.registerForm.get("passwordRepeated")?.value).toBe("");
  });

  it("should have invalid form when passwords do not match", () => {
    component.registerForm.get("password")?.setValue("password1");
    component.registerForm.get("passwordRepeated")?.setValue("password2");
    expect(component.registerForm.invalid).toBeTruthy();
  });

  it("should have valid form when passwords match", () => {
    component.registerForm.get("username")?.setValue("Avantifer");
    component.registerForm.get("email")?.setValue("email@gmail.com");
    component.registerForm.get("password")?.setValue("password1");
    component.registerForm.get("passwordRepeated")?.setValue("password1");
    expect(component.registerForm.valid).toBeTruthy();
  });

  it("should not registr if registerForm is not valid", () => {
    component.register();

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_FORM_NOT_VALID);
  });

  it("should register correctly", () => {
    component.registerForm.get("username")?.setValue("Avantifer");
    component.registerForm.get("email")?.setValue("email@gmail.com");
    component.registerForm.get("password")?.setValue("password1");
    component.registerForm.get("passwordRepeated")?.setValue("password1");
    accountApiServiceSpy.register.and.returnValue(of("token"));

    component.register();

    expect(messageInfoServiceSpy.showSuccess).toHaveBeenCalledWith(SUCCESS_REGISTER);
  });

  it("should thrown an error when register", () => {
    component.registerForm.get("username")?.setValue("Avantifer");
    component.registerForm.get("email")?.setValue("email@gmail.com");
    component.registerForm.get("password")?.setValue("password1");
    component.registerForm.get("passwordRepeated")?.setValue("password1");
    const errorResponse = { error: "Error" };

    accountApiServiceSpy.register.and.returnValue(throwError(() => errorResponse));

    component.register();

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith("Error");
  });

  it("should get all drivers correctly", () => {
    const drivers = [
      new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1))
    ];
    driverApiServiceSpy.getAllDrivers.and.returnValue(of(drivers));

    component.getAllDrivers();

    expect(component.drivers).toBe(drivers);
  });

  it("should thrown an error getting all drivers", () => {
    driverApiServiceSpy.getAllDrivers.and.returnValue(throwError(() => ERROR_DRIVER_FETCH));

    component.getAllDrivers();

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_DRIVER_FETCH);
  });
});
