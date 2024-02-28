import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthJWTService } from "../services/authJWT.service";
import { MessageInfoService } from "../services/messageinfo.service";
import { WARNING_NO_ADMIN } from "src/app/constants";

@Injectable()
export class AdminGuard {
  constructor(
    private router: Router,
    private authJWTService: AuthJWTService,
    private messageInfoService: MessageInfoService,
  ) {}

  canActivate(): boolean  {
    if (localStorage.getItem("auth")) {
      if (this.authJWTService.checkAdmin(localStorage.getItem("auth")!)) {
        return true;
      } else {
        this.router.navigate(["/"]);
        this.messageInfoService.showError(WARNING_NO_ADMIN);
        return false;
      }
    } else {
      this.router.navigate(["/login"]);
      return false;
    }
  }
}
