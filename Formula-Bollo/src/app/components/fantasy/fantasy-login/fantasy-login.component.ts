import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { User } from "src/shared/models/user";
import { UserApiService } from "src/shared/services/api/user-api.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { ERROR_EMAIL_NOT_VALID, INFO_CREDENTIALS_NEED, SUCCESS_LOGIN } from "src/app/constants";
import { AuthJWTService } from "src/shared/services/authJWT.service";

@Component({
  selector: "app-login",
  templateUrl: "./fantasy-login.component.html",
  styleUrls: ["./fantasy-login.component.scss"],
})
export class FantasyLoginComponent {
  showDialog: boolean = false;

  loginForm: FormGroup = new FormGroup({
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required),
  });
  emailForm: FormGroup = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
  });

  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private userApiService: UserApiService,
    private messageInfoService: MessageInfoService,
    public authJWTService: AuthJWTService,
    private router: Router
  ) {}

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
      const user: User = new User(0, username, password);

      this.userApiService
        .login(user)
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
            throw error;
          },
        });
    } else {
      this.messageInfoService.showWarn(INFO_CREDENTIALS_NEED);
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

    this.userApiService
      .recoverPassword(this.emailForm.get("email")!.value)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (response: string) => {
          this.messageInfoService.showSuccess(response);
        },
        error: (error) => {
          this.messageInfoService.showError(error.error);
          console.log(error);
          throw error;
        },
        complete: () => {
          this.showDialog = false;
        }
      });
  }
}
