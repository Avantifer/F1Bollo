import { Component } from "@angular/core";
import { User } from "src/shared/models/user";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { takeUntil } from "rxjs/operators";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { UserApiService } from "src/shared/services/api/user-api.service";
import { AuthJWTService } from "src/shared/services/authJWT.service";
import { INFO_CREDENTIALS_NEED, WARNING_NO_ADMIN } from "src/app/constants";

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

  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private userApiService: UserApiService,
    private messageInfoService: MessageInfoService,
    private router: Router,
    private authJWTService: AuthJWTService,
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
            throw error;
          },
        });
    } else {
      this.messageInfoService.showInfo(INFO_CREDENTIALS_NEED);
    }
  }
}
