import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DriverPoints } from 'src/shared/models/driverPoints';
import { ResultApiService } from 'src/shared/services/api/result-api.service';
import { MessageService } from 'src/shared/services/message.service';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent {

  driverPoints: DriverPoints[] = [];

  private _unsubscribe = new Subject<void>();

  constructor(private resultApiService: ResultApiService, private messageService: MessageService) {  }

  ngOnInit(): void {
    this.obtainAllResults();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Fetch all driver points data and update the component's driverPoints property.
  */
  obtainAllResults(): void {
    this.resultApiService.getAllDriverPoints()
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (driverPoints: DriverPoints[]) => {
          this.driverPoints = driverPoints;
        },
        error: (error) => {
          this.messageService.showInformation('No se ha podido recoger los resultados correctamente');
          console.log(error);
          throw error;
        }
      })
  }
}
