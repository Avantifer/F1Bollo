import { Injectable } from "@angular/core";
import { Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthJWTService } from "../services/authJWT.service";

@Injectable()
export class AdminGuard {

  constructor(private router: Router, private authJWTService: AuthJWTService) {}

  canActivate():Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (localStorage.getItem('auth')) {
      if (this.authJWTService.checkAdmin(localStorage.getItem('auth')!)) {

        return true;
      } else {
        this.router.navigate(['/home']);
        return false;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
