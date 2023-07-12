import { Injectable } from "@angular/core";
import { Router, UrlTree } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable } from "rxjs";

@Injectable()
export class AdminGuard {

  constructor(private router: Router, private jwt: JwtHelperService) {}

  canActivate():Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    try {
      let token = this.jwt.decodeToken(localStorage.getItem('auth')!);
      if (token.sub == token.userId) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      localStorage.removeItem('auth');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
