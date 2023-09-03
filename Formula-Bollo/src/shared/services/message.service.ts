import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private snackbar: MatSnackBar) {}

  showInformation(message: string) {
    this.snackbar.open(message, 'Cerrar', {
      duration: 3000
    });
  }
}
