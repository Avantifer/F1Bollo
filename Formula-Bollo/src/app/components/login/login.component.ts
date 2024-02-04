import { Component } from '@angular/core';
import { User } from 'src/shared/models/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'src/shared/services/message.service';
import { takeUntil } from 'rxjs/operators'
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UserApiService } from 'src/shared/services/api/user-api.service';
import { AuthJWTService } from 'src/shared/services/authJWT.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  hidePassword: boolean = true;

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private userApiService: UserApiService,
    private messageService: MessageService,
    private router: Router,
    private authJWTService: AuthJWTService
  ) { }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Handle user login.
  */
  login(): void {
    let username: string = this.loginForm.get('username')!.value;
    let password: string = this.loginForm.get('password')!.value;

    if (username && password) {
      let user : User = new User(0, username, password);

      this.userApiService.login(user)
        .pipe(
          takeUntil(this._unsubscribe)
        )
        .subscribe({
          next: (token: string) => {
            if (this.authJWTService.checkAdmin(token)) {
              localStorage.setItem('auth', token);
              this.router.navigate(['/admin']);
            } else {
              this.messageService.showInformation("No tienes permisos de administrador");
            }
          },
          error: (error) => {
            this.messageService.showInformation(error.error);
            console.log(error);
            throw error;
          }
        });
    } else {
      this.messageService.showInformation("Necesitas poner el usuario/contraseña");
    }
  }
}
