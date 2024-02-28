import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthJWTService } from "../services/authJWT.service";
import { MessageInfoService } from "../services/messageinfo.service";
import { WARNING_NO_LOGIN } from "src/app/constants";

@Injectable()
export class FantasyTeamGuard {
  constructor(
    private router: Router,
    private authJWTService: AuthJWTService,
    private messageInfoService: MessageInfoService,
  ) {}

  canActivate(): boolean {
    if (!this.authJWTService.isLogged()) {
      this.messageInfoService.showWarn(WARNING_NO_LOGIN);
      this.router.navigate(["/fantasy/login"]);
      return false;
    } else {
      return true;
    }
  }
}
