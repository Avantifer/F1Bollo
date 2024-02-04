import { Injectable } from "@angular/core";
import { Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthJWTService } from "../services/authJWT.service";
import { MessageService } from "../services/message.service";

@Injectable()
export class AdminGuard {

  constructor(
    private router: Router,
    private authJWTService: AuthJWTService,
    private messageService: MessageService
  ) {}

  canActivate():Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (localStorage.getItem('auth')) {
      if (this.authJWTService.checkAdmin(localStorage.getItem('auth')!)) {
        return true;
      } else {
        this.router.navigate(['/']);
        this.messageService.showInformation('No tienes permisos para acceder a esta página');
        return false;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
