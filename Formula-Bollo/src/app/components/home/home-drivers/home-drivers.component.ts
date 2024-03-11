/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { ERROR_DRIVER_FETCH } from "src/app/constants";
import { environment } from "src/enviroments/enviroment";
import { Configuration } from "src/shared/models/configuration";
import { Driver } from "src/shared/models/driver";
import { DriverPoints } from "src/shared/models/driverPoints";
import { DriverApiService } from "src/shared/services/api/driver-api.service";
import { ResultApiService } from "src/shared/services/api/result-api.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";


@Component({
  selector: "app-home-drivers",
  templateUrl: "./home-drivers.component.html",
  styleUrl: "./home-drivers.component.scss",
})
export class HomeDriversComponent {
  drivers: Driver[] = [];
  configurations: Configuration[] = [];
  driverPoints: DriverPoints[] = [];
  top3DriverPoints: DriverPoints[] = [];
  top3Drivers: Driver[] = [];

  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    public router: Router,
    private driversApiService: DriverApiService,
    private resultApiService: ResultApiService,
    private messageInfoService: MessageInfoService
  ) { }

  ngOnInit(): void {
    this.obtainAllPointsDriver();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Fetch driver points data and process it, including obtaining the top 3 drivers.
   */
  obtainAllPointsDriver(): void {
    this.resultApiService
      .getAllDriverPoints(environment.seasonActual.number, 10)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (driverPoints: DriverPoints[]) => {
          this.driverPoints = driverPoints;
          this.top3DriverPoints = driverPoints.slice(0, 3);
          // Swap the positions of the first and second elements in the top 3 array
          [this.top3DriverPoints[0], this.top3DriverPoints[1]] = [
            this.top3DriverPoints[1],
            this.top3DriverPoints[0],
          ];
        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_DRIVER_FETCH);
          console.log(error);
          throw error;
        },
        complete: () => {
          if (this.driverPoints.length === 0) {
            this.obtainAllDrivers();
          }
        },
      });
  }

  /**
   * Fetch all drivers data and update the component"s drivers property.
   */
  private obtainAllDrivers(): void {
    this.driversApiService
      .getAllDrivers(environment.seasonActual.number)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (drivers: Driver[]) => {
          this.drivers = drivers.slice(0, 10);
          this.top3Drivers = drivers.slice(0, 3);
          [this.top3Drivers[0], this.top3Drivers[1]] = [
            this.top3Drivers[1],
            this.top3Drivers[0],
          ];
        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_DRIVER_FETCH);
          console.log(error);
          throw error;
        },
      });
  }

  /**
   * Convert driver name space to underscore.
   *
   * @param driverName - The input driver name to be converted.
   * @returns The driver name with spaces replaced by underscores.
   */
  public driverNameSpaceToUnderScore(driverName: string): string {
    return driverName.replaceAll(" ", "_");
  }
}
