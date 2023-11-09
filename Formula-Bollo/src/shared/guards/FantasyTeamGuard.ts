import { Injectable } from "@angular/core";
import { Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthJWTService } from "../services/authJWT.service";
import { MessageService } from "../services/message.service";

@Injectable()
export class FantasyTeamGuard {

  constructor(
    private router: Router,
    private authJWTService: AuthJWTService,
    private messageService: MessageService
  ) {}

  canActivate():Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authJWTService.isLogged()) {
      this.messageService.showInformation('Debes estar logueado para acceder a esta página');
      this.router.navigate(['/fantasy/login']);
      return false;
    } else {
      return true;
    }
  }
}
