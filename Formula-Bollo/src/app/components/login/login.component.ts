import { Component } from '@angular/core';
import { Admin } from 'src/shared/models/admin';
import { AdminService } from 'src/shared/services/admin-api.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'src/shared/services/message.service';
import { catchError } from 'rxjs/operators'
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
  // Check if both username and password are not empty
  if (this.loginForm.get('password')!.value != '' && this.loginForm.get('username')!.value != '') {
    // Create a new Admin object with the entered username and password
    let user : Admin = new Admin(0, this.loginForm.get('username')!.value, this.loginForm.get('password')!.value);
    // Call the login method from the adminService and handle any errors
    this.adminService.login(user)
      .pipe(catchError((error) => {
        // Show the error message using the messageService
        this.messageService.showInformation(error.error);
        return '';
      }))
      .subscribe(token =>{
        // Store the token in the local storage
        localStorage.setItem('auth', token);
        // Navigate to the admin page
        this.router.navigate(['/admin']);
      });
  } else {
    // Show a message indicating that the username and password are required
    this.messageService.showInformation("Necesitas poner el usuario/contraseña");
  }
}
}
