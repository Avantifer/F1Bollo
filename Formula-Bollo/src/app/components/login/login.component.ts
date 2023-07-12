import { Component } from '@angular/core';
import { Admin } from 'src/shared/models/admin';
import { AdminService } from 'src/shared/services/admin-api.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'src/shared/services/message.service';
import { catchError } from 'rxjs/operators'
import { of } from 'rxjs';
import { Router } from '@angular/router';

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

  constructor(private adminService: AdminService, private messageService: MessageService, private router: Router) { }

  /**
   * Login for admin
   * @memberof LoginComponent
  */
  login(): void {
    if (this.loginForm.get('password')!.value != '' && this.loginForm.get('username')!.value != '') {
      let user : Admin = new Admin(0, this.loginForm.get('username')!.value, this.loginForm.get('password')!.value);

      this.adminService.login(user)
      .pipe(catchError((error) => {
        this.messageService.showInformation(error.error);
        return '';
      })).subscribe(token =>{
        localStorage.setItem('auth', token);
        this.router.navigate(['/admin']);
      });
    }else {
      this.messageService.showInformation("Necesitas poner el usuario/contraseña");
    }
  }
}
