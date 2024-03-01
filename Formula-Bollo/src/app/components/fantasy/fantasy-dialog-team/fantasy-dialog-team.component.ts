import { Component } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Subject, takeUntil } from "rxjs";
import { ERROR_POINT_FETCH, ERROR_PRICE_FETCH } from "src/app/constants";
import { FantasyElection } from "src/shared/models/fantasyElection";
import { FantasyPointsDriver } from "src/shared/models/fantasyPointsDriver";
import { FantasyPointsTeam } from "src/shared/models/fantasyPointsTeam";
import { FantasyApiService } from "src/shared/services/api/fantasy-api.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";

@Component({
  selector: "app-fantasy-dialog-team",
  templateUrl: "./fantasy-dialog-team.component.html",
  styleUrls: ["./fantasy-dialog-team.component.scss"],
})
export class FantasyDialogTeamComponent {
  fantasyElection: FantasyElection | undefined;
  pointsDriverOne: number | undefined;
  pointsDriverTwo: number | undefined;
  pointsDriverThree: number | undefined;
  pointsTeamOne: number | undefined;
  pointsTeamTwo: number | undefined;

  ref: DynamicDialogRef | undefined;
  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private fantasyApiService: FantasyApiService,
    private messageInfoService: MessageInfoService,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.fantasyElection = this.config.data.fantasyElection;
    this.getSpecificPointsPerDriver(this.fantasyElection!);
    this.getSpecificPointsPerTeam(this.fantasyElection!);
  }

  /**
   * Retrieves specific points for each driver in the fantasy election and updates corresponding properties.
   *
   * @param fantasyElection - The fantasy election data containing driver information.
   */
  getSpecificPointsPerDriver(fantasyElection: FantasyElection): void {
    const raceId: number = fantasyElection.race!.id;

    this.fantasyApiService
      .getDriverPoints(fantasyElection.driverOne!.id, raceId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (fantasyPointsDriver: FantasyPointsDriver) => {
          this.pointsDriverOne = fantasyPointsDriver.points;
        },
        error: () => {
          this.messageInfoService.showError(ERROR_POINT_FETCH);
        },
      });

    this.fantasyApiService
      .getDriverPoints(fantasyElection.driverTwo!.id, raceId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (fantasyPointsDriver: FantasyPointsDriver) => {
          this.pointsDriverTwo = fantasyPointsDriver.points;
        },
        error: () => {
          this.messageInfoService.showError(ERROR_PRICE_FETCH);
        },
      });

    this.fantasyApiService
      .getDriverPoints(fantasyElection.driverThree!.id, raceId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (fantasyPointsDriver: FantasyPointsDriver) => {
          this.pointsDriverThree = fantasyPointsDriver.points;
        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_POINT_FETCH);
          console.log(error.error);
          throw error;
        },
      });
  }

  /**
   * Retrieves specific points for each team in the fantasy election and updates corresponding properties.
   *
   * @param fantasyElection - The fantasy election data containing team information.
   */
  getSpecificPointsPerTeam(fantasyElection: FantasyElection): void {
    const raceId: number = fantasyElection.race!.id;

    this.fantasyApiService
      .getTeamPoints(fantasyElection.teamOne!.id, raceId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (fantasyPointsTeam: FantasyPointsTeam) => {
          this.pointsTeamOne = fantasyPointsTeam.points;
        },
        error: () => {
          this.messageInfoService.showError(ERROR_POINT_FETCH);
        },
      });

    this.fantasyApiService
      .getTeamPoints(fantasyElection.teamTwo!.id, raceId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (fantasyPointsTeam: FantasyPointsTeam) => {
          this.pointsTeamTwo = fantasyPointsTeam.points;
        },
        error: () => {
          this.messageInfoService.showError(ERROR_POINT_FETCH);
        },
      });
  }
}
