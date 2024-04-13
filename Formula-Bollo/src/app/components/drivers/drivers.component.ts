import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { ERROR_DRIVER_FETCH, ERROR_RESULT_FETCH } from "src/app/constants";
import { environment } from "src/enviroments/enviroment";
import { Driver } from "src/shared/models/driver";
import { DriverPoints } from "src/shared/models/driverPoints";
import { Season } from "src/shared/models/season";
import { DriverApiService } from "src/shared/services/api/driver-api.service";
import { ResultApiService } from "src/shared/services/api/result-api.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { SeasonService } from "src/shared/services/season.service";

@Component({
  selector: "app-drivers",
  templateUrl: "./drivers.component.html",
  styleUrls: ["./drivers.component.scss"],
})
export class DriversComponent {
  driverPoints: DriverPoints[] = [];
  drivers: Driver[] = [];
  seasons: Season[] = [];

  seasonForm: FormGroup = new FormGroup({
    season: new FormControl(""),
  });

  seasonSelected: Season = environment.seasonActual;
  seasonName: string = environment.seasonActual.name;

  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    public router: Router,
    private driversApiService: DriverApiService,
    private resultApiService: ResultApiService,
    private messageInfoService: MessageInfoService,
    private seasonService: SeasonService,
  ) {}

  ngOnInit(): void {
    this.obtainAllSeasons();
    this.obtainAllDriversPoints();
    this.changeSeasonDrivers();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Fetch all driver points data and update the component's driverPoints property.
   */
  obtainAllDriversPoints(seasonNumber?: number): void {
    this.resultApiService
      .getAllDriverPoints(seasonNumber)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (driverPoints: DriverPoints[]) => {
          this.driverPoints = driverPoints;
        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_RESULT_FETCH);
          console.log(error);
          throw error;
        },
        complete: () => {
          if (this.driverPoints.length === 0) {
            this.obtainAllDrivers(seasonNumber);
          }
        },
      });
  }

  /**
   * Fetch all drivers data and update the component's drivers property.
   */
  obtainAllDrivers(seasonNumber?: number): void {
    this.driversApiService
      .getAllDrivers(seasonNumber)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (drivers: Driver[]) => {
          this.drivers = drivers;
        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_DRIVER_FETCH);
          console.log(error);
          throw error;
        },
      });
  }

  /**
   * Fetch all seasons and set a default season in the form.
   */
  obtainAllSeasons(): void {
    this.seasonService.obtainAllSeasons(this.seasons, this.seasonSelected, this.seasonForm);
  }

  /**
   * Listen for changes in the selected season and update the list of drivers accordingly.
   */
  changeSeasonDrivers(): void {
    this.seasonForm.valueChanges
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((data) => {
        this.seasonSelected = data.season;
        this.driverPoints = [];
        this.drivers = [];
        this.obtainAllDriversPoints(this.seasonSelected.number);
      });
  }

  /**
   * Convert driver name space to underscore.
   *
   * @param driverName - The input driver name to be converted.
   * @returns The driver name with spaces replaced by underscores.
   */
  public driverNameSpaceToUnderScore(driverName: string) {
    return driverName.replaceAll(" ", "_");
  }
}
