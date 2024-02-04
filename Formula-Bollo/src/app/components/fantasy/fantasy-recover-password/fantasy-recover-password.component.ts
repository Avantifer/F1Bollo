import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserApiService } from 'src/shared/services/api/user-api.service';
import { AuthJWTService } from 'src/shared/services/authJWT.service';
import { MessageService } from 'src/shared/services/message.service';

@Component({
  selector: 'app-fantasy-recover-password',
  templateUrl: './fantasy-recover-password.component.html',
  styleUrls: ['./fantasy-recover-password.component.scss']
})
export class FantasyRecoverPasswordComponent {

  token: string = '';

  hidePassword: boolean = true;
  hidePasswordRepeated: boolean = true;

  recoverPasswordForm: FormGroup = new FormGroup({
    password: new FormControl('', Validators.required),
    passwordRepeated: new FormControl('', [Validators.required, this.passwordMatchValidator()]),
  });

  private _unsuscribe: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private messageService: MessageService,
    private userApiService: UserApiService,
    private authJWTService: AuthJWTService
  ) { }

  ngOnInit(): void {
    this.token = this.router.url.split('/')[3];
  }

  /**
   * Returns a validator function that checks if the password and passwordRepeated fields match.
   * @returns A validator function that returns null if the passwords match, or an object with the 'passwordMismatch' property if they don't.
   */
  private passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const password = control.parent?.get('password')?.value;
      const passwordRepeated = control.value;
      return password === passwordRepeated ? null : { 'passwordMismatch': true };
    };
  }

  /**
   * Changes the user's password using the password provided in the recoverPasswordForm.
  */
  changePassword(): void {
    if (this.recoverPasswordForm.valid) {
      let username: string = this.authJWTService.getUsernameFromToken(this.token);
      let password: string = this.recoverPasswordForm.get('password')?.value;
      this.userApiService.changePassword(password, username)
        .pipe(
          takeUntil(this._unsuscribe)
        )
        .subscribe({
          next: (response: string) => {
            this.messageService.showInformation(response);
            this.router.navigate(['/fantasy/login']);
          },
          error: (error) => {
            this.messageService.showInformation(error.error);
            console.log(error);
            throw error;
          },
        })
    } else {
      this.messageService.showInformation('No has rellenado correctamente el formulario.');
    }
  }
}
