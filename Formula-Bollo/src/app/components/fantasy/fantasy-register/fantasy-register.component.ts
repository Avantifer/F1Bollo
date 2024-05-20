import { Component } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { ERROR_DRIVER_FETCH, ERROR_FORM_NOT_VALID, SUCCESS_REGISTER } from "src/app/constants";
import { Driver } from "src/shared/models/driver";
import { Account } from "src/shared/models/account";
import { DriverApiService } from "src/shared/services/api/driver-api.service";
import { AccountApiService } from "src/shared/services/api/account-api.service";
import { AuthJWTService } from "src/shared/services/authJWT.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";

@Component({
  selector: "app-fantasy-register",
  templateUrl: "./fantasy-register.component.html",
  styleUrls: ["./fantasy-register.component.scss"],
})
export class FantasyRegisterComponent {
  registerForm: FormGroup = new FormGroup({
    username: new FormControl("", Validators.required),
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", Validators.required),
    passwordRepeated: new FormControl("", [
      Validators.required,
      this.passwordMatchValidator(),
    ]),
  });

  drivers: Driver[] = [];
  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private accountApiService: AccountApiService,
    private messageInfoService: MessageInfoService,
    private authJWTService: AuthJWTService,
    private router: Router,
    private driverApiService: DriverApiService,
  ) {}

  ngOnInit(): void {
    this.getAllDrivers();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Returns a validator function that checks if the password and passwordRepeated fields match.
   * @returns A validator function that returns null if the passwords match, or an object with the 'passwordMismatch' property if they don't.
   */
  private passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: unknown } | null => {
      const password = control.parent?.get("password")?.value;
      const passwordRepeated = control.value;
      return password === passwordRepeated ? null : { passwordMismatch: true };
    };
  }

  /**
   * Handle user login.
   */
  register(): void {
    if (this.registerForm.valid) {
      const account: Account = new Account(
        0,
        this.registerForm.get("username")!.value,
        this.registerForm.get("password")!.value,
        this.registerForm.get("email")!.value,
        0,
      );
      this.accountApiService
        .register(account)
        .pipe(takeUntil(this._unsubscribe))
        .subscribe({
          next: (token: string) => {
            localStorage.setItem("auth", token);
            this.authJWTService.isLogged();
            this.router.navigate(["/fantasy"]);
            this.messageInfoService.showSuccess(SUCCESS_REGISTER);
          },
          error: (error) => {
            this.messageInfoService.showError(error.error);
            console.log(error);
            throw error;
          },
          complete: () => {

          }
        });
    } else {
      this.messageInfoService.showError(ERROR_FORM_NOT_VALID);
    }
  }

  /**
   * Fetches all drivers from the driver API service and assigns them to the `drivers` property.
   */
  getAllDrivers(): void {
    this.driverApiService
      .getAllDrivers()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (drivers) => {
          this.drivers = drivers;
        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_DRIVER_FETCH);
          console.log(error);
          throw error;
        },
      });
  }
}
