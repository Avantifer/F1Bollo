import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthJWTService } from "../services/authJWT.service";

@Injectable()
export class LoginGuard {
  constructor(
    private router: Router,
    private authJWTService: AuthJWTService,
  ) {}

  canActivate(): boolean {
    if (this.authJWTService.isLogged()) {
      this.router.navigate(["/"]);
      return false;
    } else {
      return true;
    }
  }
}
