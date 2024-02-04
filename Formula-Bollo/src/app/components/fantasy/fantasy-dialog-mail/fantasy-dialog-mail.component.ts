import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UserApiService } from 'src/shared/services/api/user-api.service';
import { MessageService } from 'src/shared/services/message.service';

@Component({
  selector: 'app-fantasy-dialog-mail',
  templateUrl: './fantasy-dialog-mail.component.html',
  styleUrls: ['./fantasy-dialog-mail.component.scss']
})
export class FantasyDialogMailComponent {

  emailForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]]
  });

  _unsubscribe: Subject<void> = new Subject<void>();

  constructor(private formBuilder: FormBuilder, private userApiService: UserApiService, private messageService: MessageService) { }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Sends a recovery password email using the email form.
  */
  sendRecoveryPasswordEmail(): void {
    if (this.emailForm.invalid) return this.messageService.showInformation("El email introducido no es válido");

    this.userApiService.recoverPassword(this.emailForm.get('email')!.value)
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (response: string) => {
          console.log(response);

          this.messageService.showInformation(response);
        },
        error: (error) => {
          this.messageService.showInformation(error.error);
          console.log(error);
          throw error;
        }
      })
  }
}
