import { Injectable } from "@angular/core";
import { Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthJWTService } from "../services/authJWT.service";

@Injectable()
export class LoginGuard {

  constructor(private router: Router, private authJWTService: AuthJWTService) {}

  canActivate():Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authJWTService.isLogged()) {
      this.router.navigate(['/home']);
      return false;
    } else {
      return true;
    }
  }
}
