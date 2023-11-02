import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Driver } from 'src/shared/models/driver';
import { User } from 'src/shared/models/user';
import { DriverApiService } from 'src/shared/services/api/driver-api.service';
import { UserApiService } from 'src/shared/services/api/user-api.service';
import { MessageService } from 'src/shared/services/message.service';

@Component({
  selector: 'app-fantasy-register',
  templateUrl: './fantasy-register.component.html',
  styleUrls: ['./fantasy-register.component.scss']
})
export class FantasyRegisterComponent {
  hidePassword: boolean = true;
  hidePasswordRepeated: boolean = true;

  registerForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    passwordRepeated: new FormControl('', [Validators.required, this.passwordMatchValidator()]),
    driver: new FormControl('', Validators.required),
  });

  drivers: Driver[] = [];
  private _unsubscribe = new Subject<void>();

  constructor(
    private userApiService: UserApiService,
    private messageService: MessageService,
    private router: Router,
    private driverApiService: DriverApiService,
  ) { }

  ngOnInit(): void {
    this.getAllDrivers();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
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
   * Handle user login.
  */
  register(): void {
    if (this.registerForm.valid) {
      let user : User = new User(0, this.registerForm.get('username')!.value, this.registerForm.get('password')!.value, 0, this.registerForm.get('driver')!.value);
      this.userApiService.register(user)
        .pipe(
          takeUntil(this._unsubscribe)
        )
        .subscribe({
          next: (token: string) => {
            localStorage.setItem('auth', token);
            this.router.navigate(['/fantasy/home'])
            this.messageService.showInformation("Te has registrado correctamente");
          },
          error: (error) => {
            this.messageService.showInformation('No se ha podido registrar correctamente');
            console.log(error);
            throw error;
          }
        });
    } else {
      this.messageService.showInformation("No has rellenado correctamente el formulario");
    }
  }

  getAllDrivers(): void {
    this.driverApiService.getAllDrivers()
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (drivers) => {
          this.drivers = drivers;
        },
        error: (error) => {
          console.log(error);
          this.messageService.showInformation('No se ha podido recoger los pilotos correctamente');
          throw error;
        }
      });
  }
}
