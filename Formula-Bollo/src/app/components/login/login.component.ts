import { Component } from '@angular/core';
import { Admin } from 'src/shared/models/admin';
import { AdminApiService } from 'src/shared/services/api/admin-api.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'src/shared/services/message.service';
import { takeUntil } from 'rxjs/operators'
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  hidePassword: boolean = true;

  loginForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  private _unsubscribe = new Subject<void>();

  constructor(private adminApiService: AdminApiService, private messageService: MessageService, private router: Router) { }

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
      let user : Admin = new Admin(0, username, password);

      this.adminApiService.login(user)
        .pipe(
          takeUntil(this._unsubscribe)
        )
        .subscribe({
          next: (token: string) => {
            localStorage.setItem('auth', token);
            this.router.navigate(['/admin']);
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
