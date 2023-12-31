import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { environment } from 'src/enviroments/enviroment';
import { Configuration } from 'src/shared/models/configuration';
import { Driver } from 'src/shared/models/driver';
import { DriverPoints } from 'src/shared/models/driverPoints';
import { Team } from 'src/shared/models/team';
import { ConfigurationApiService } from 'src/shared/services/api/configuration-api.service';
import { DriverApiService } from 'src/shared/services/api/driver-api.service';
import { ResultApiService } from 'src/shared/services/api/result-api.service';
import { TeamApiService } from 'src/shared/services/api/team-api.service';
import { MessageService } from 'src/shared/services/message.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  teams: Team[] = [];
  drivers: Driver[] = [];
  configurations: Configuration[] = [];
  driverPoints: DriverPoints[] = [];
  top3DriverPoints: DriverPoints[] = [];
  top3Drivers: Driver[] = [];

  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private teamApiService: TeamApiService,
    private driversApiService: DriverApiService,
    private configurationApiService: ConfigurationApiService,
    private resultApiService: ResultApiService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.obtainAllTeams();
    this.obtainAllConfigurations();
    this.obtainAllPointsDriver();
    this.obtainAllDrivers();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Fetch all team data and update the component's teams property.
  */
  obtainAllTeams(): void {
    this.teamApiService.getAllTeams(environment.seasonActual)
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (teams: Team[]) => {
          this.teams = teams;
        },
        error: (error) => {
          this.messageService.showInformation('No se pudo recoger los equipos correctamente');
          console.log(error);
          throw error;
        }
      });
  }

  /**
   * Fetch all drivers data and update the component's drivers property.
  */
  obtainAllDrivers(): void {
    this.driversApiService.getAllDrivers(environment.seasonActual)
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (drivers: Driver[]) => {
          this.drivers = drivers;
          this.top3Drivers = drivers.slice(0, 3);
          [this.top3Drivers[0], this.top3Drivers[1]] = [this.top3Drivers[1], this.top3Drivers[0]];
        },
        error: (error) => {
          this.messageService.showInformation('No se pudo obtener los pilotos correctamente');
          console.log(error);
          throw error;
        }
      })
  }

  /**
   * Fetch all configuration data and update the component's configurations property.
  */
  obtainAllConfigurations(): void {
    this.configurationApiService.getAllConfigurations()
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (configurations: Configuration[]) => {
          this.configurations = configurations;
        },
        error: (error) => {
          this.messageService.showInformation('No se pudo obtener las configuraciones correctamente');
          console.log(error);
          throw error;
        }
      });
  }

  /**
   * Fetch driver points data and process it, including obtaining the top 3 drivers.
  */
  obtainAllPointsDriver(): void {
    this.resultApiService.getAllDriverPoints(environment.seasonActual, 10)
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (driverPoints: DriverPoints[]) => {
          this.driverPoints = driverPoints;
          this.top3DriverPoints = driverPoints.slice(0, 3);
          // Swap the positions of the first and second elements in the top 3 array
          [this.top3DriverPoints[0], this.top3DriverPoints[1]] = [this.top3DriverPoints[1], this.top3DriverPoints[0]];
        },
        error: (error) => {
          this.messageService.showInformation('No se puedo obtener los puntos de los pilotos correctamente');
          console.log(error);
          throw error;
        }
      });
  }
}
