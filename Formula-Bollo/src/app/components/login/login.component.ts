import { Component } from "@angular/core";
import { Account } from "src/shared/models/account";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { takeUntil } from "rxjs/operators";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AccountApiService } from "src/shared/services/api/account-api.service";
import { AuthJWTService } from "src/shared/services/authJWT.service";
import { ERROR_EMAIL_NOT_VALID, INFO_CREDENTIALS_NEED, SUCCESS_LOGIN, WARNING_NO_ADMIN } from "src/app/constants";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {

  loginForm: FormGroup = new FormGroup({
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required),
  });
  emailForm: FormGroup = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
  });

  isFantasy: boolean = false;
  showDialog: boolean = false;

  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private accountApiService: AccountApiService,
    private messageInfoService: MessageInfoService,
    private router: Router,
    private authJWTService: AuthJWTService,
  ) {}

  ngOnInit(): void {
    this.checkIsFantasy();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Handle user login.
   */
  login(): void {
    const username: string = this.loginForm.get("username")!.value;
    const password: string = this.loginForm.get("password")!.value;

    if (username && password) {
      const account: Account = new Account(0, username, password);

      this.accountApiService
        .login(account)
        .pipe(takeUntil(this._unsubscribe))
        .subscribe({
          next: (token: string) => {
            if (this.authJWTService.checkAdmin(token)) {
              localStorage.setItem("auth", token);
              this.router.navigate(["/admin"]);
            } else {
              this.messageInfoService.showWarn(WARNING_NO_ADMIN);
            }
          },
          error: (error) => {
            this.messageInfoService.showError(error.error);
            console.log(error);
          },
        });
    } else {
      this.messageInfoService.showInfo(INFO_CREDENTIALS_NEED);
    }
  }

  /**
   * Handle user fantasy login.
   */
  loginFantasy(): void {
    const username: string = this.loginForm.get("username")!.value;
    const password: string = this.loginForm.get("password")!.value;

    if (username && password) {
      const account: Account = new Account(0, username, password);

      this.accountApiService
        .login(account)
        .pipe(takeUntil(this._unsubscribe))
        .subscribe({
          next: (token: string) => {
            localStorage.setItem("auth", token);
            this.authJWTService.isLogged();
            this.router.navigate(["/fantasy"]);
            this.messageInfoService.showSuccess(SUCCESS_LOGIN);
          },
          error: (error) => {
            this.messageInfoService.showError(error.error);
            console.log(error);
          },
        });
    } else {
      this.messageInfoService.showWarn(INFO_CREDENTIALS_NEED);
    }
  }

  /**
   * Check the current url to set if its fantasy or not.
   */
  checkIsFantasy(): void {
    if (this.router.url.includes("fantasy")) {
      this.isFantasy = true;
    } else {
      this.isFantasy = false;
    }
  }

  /**
   * Opens the recovery password dialog.
   */
  openRecoveryPasswordDialog(): void {
    this.showDialog = true;
  }

  /**
   * Sends a recovery password email using the email form.
   */
  sendRecoveryPasswordEmail(): void {
    if (this.emailForm.invalid)
      return this.messageInfoService.showError(ERROR_EMAIL_NOT_VALID);

    this.accountApiService
      .recoverPassword(this.emailForm.get("email")!.value)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (response: string) => {
          this.messageInfoService.showSuccess(response);
        },
        error: (error) => {
          this.messageInfoService.showError(error.error);
          console.log(error);
        },
        complete: () => {
          this.showDialog = false;
        }
      });
  }
}
