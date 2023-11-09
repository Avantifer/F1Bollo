import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { environment } from 'src/enviroments/enviroment';
import { DriverPoints } from 'src/shared/models/driverPoints';
import { Season } from 'src/shared/models/season';
import { ResultApiService } from 'src/shared/services/api/result-api.service';
import { SeasonApiService } from 'src/shared/services/api/season-api.service';
import { MessageService } from 'src/shared/services/message.service';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent {

  driverPoints: DriverPoints[] = [];
  seasons: Season[] = [];

  seasonForm: FormGroup = new FormGroup({
    season: new FormControl(''),
  });

  seasonSelected: Season | undefined;

  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private resultApiService: ResultApiService,
    private messageService: MessageService,
    private seasonApiService: SeasonApiService
  ) {  }

  ngOnInit(): void {
    this.obtainAllSeasons();
    this.obtainAllDrivers();
    this.changeSeasonDrivers();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Fetch all driver points data and update the component's driverPoints property.
  */
  obtainAllDrivers(seasonNumber?: number): void {
    this.resultApiService.getAllDriverPoints(seasonNumber)
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

  /**
   * Fetch all seasons and set a default season in the form.
  */
  obtainAllSeasons(): void {
    this.seasonApiService.getSeasons()
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (seasons: Season[]) => {
          this.seasons = seasons;

          // Put seasonActual on the season Form as default value and update seasonSelected's property
          this.seasonSelected = this.seasons.filter((season: Season) => season.number === environment.seasonActual)[0];
          this.seasonForm.get('season')?.setValue(this.seasonSelected);
        },
        error: (error) => {
          this.messageService.showInformation('No se ha podido recoger las temporadas correctamente');
          console.log(error);
          throw error;
        }
      });
  }

  /**
   * Listen for changes in the selected season and update the list of drivers accordingly.
  */
  changeSeasonDrivers(): void {
    this.seasonForm.valueChanges.pipe(
      takeUntil(this._unsubscribe)
    )
    .subscribe((data: any) => {
      this.seasonSelected = data.season;
      this.obtainAllDrivers(this.seasonSelected!.number);
    });
  }
}
