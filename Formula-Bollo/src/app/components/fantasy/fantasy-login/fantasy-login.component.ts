import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/shared/models/user';
import { UserApiService } from 'src/shared/services/api/user-api.service';
import { MessageService } from 'src/shared/services/message.service';
import { FantasyDialogMailComponent } from '../fantasy-dialog-mail/fantasy-dialog-mail.component';

@Component({
  selector: 'app-login',
  templateUrl: './fantasy-login.component.html',
  styleUrls: ['./fantasy-login.component.scss']
})
export class FantasyLoginComponent {
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
    private dialog: MatDialog,
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
            localStorage.setItem('auth', token);
            this.router.navigate(['/fantasy']);
            this.resetNavItemsFantasy();
            this.messageService.showInformation("Has iniciado sesión correctamente");
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

  /**
   * Resets the 'active' class from elements with the class 'active'.
  */
  resetNavItemsFantasy(): void {
    let navItemSelected: NodeListOf<Element> = document.querySelectorAll('.active');

    if (navItemSelected.length === 0) return;

    navItemSelected.forEach((navItemSelected: Element) => {
      navItemSelected.classList.remove('active');
    });
  }

  /**
   * Opens the recovery password dialog.
  */
  openRecoveryPasswordDialog(): void {
    this.dialog.open(FantasyDialogMailComponent, {
      width: '700px',
      height: '300px',
      enterAnimationDuration: 200,
      exitAnimationDuration: 200,
    });
  }
}
