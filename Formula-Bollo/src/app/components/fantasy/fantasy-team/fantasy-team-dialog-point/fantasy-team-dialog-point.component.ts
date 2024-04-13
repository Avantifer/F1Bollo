import { Component } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Subject, takeUntil } from "rxjs";
import { ERROR_POINT_FETCH } from "src/app/constants";
import { FantasyPointsDriver } from "src/shared/models/fantasyPointsDriver";
import { FantasyPointsTeam } from "src/shared/models/fantasyPointsTeam";
import { FantasyApiService } from "src/shared/services/api/fantasy-api.service";
import { FantasyService } from "src/shared/services/fantasy.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";

@Component({
  selector: "app-fantasy-team-dialog-point",
  templateUrl: "./fantasy-team-dialog-point.component.html",
  styleUrl: "./fantasy-team-dialog-point.component.scss"
})
export class FantasyTeamDialogPointComponent {
  data: unknown;
  options: unknown;
  labels: string[] = [];
  points: number[] = [];

  ref: DynamicDialogRef | undefined;
  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    public config: DynamicDialogConfig,
    private fantasyApiService: FantasyApiService,
    private fantasyService: FantasyService,
    private messageInfoService: MessageInfoService
  ) { }

  ngOnInit(): void {
    const id: number = this.config.data.id;
    const type: string = this.config.data.type;

    if (type === "drivers") {
      this.getDriverPoint(id);
    } else if (type === "teams"){
      this.getTeamPoint(id);
    }
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Retrieves the points data for a specific driver from the fantasy API and updates the chart accordingly.
   * @param driverId The ID of the driver for which points data will be retrieved.
   */
  getDriverPoint(driverId: number) {
    this.fantasyApiService.getDriverPoints(driverId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (fantasyPricesDriver: FantasyPointsDriver[]) => {
          this.labels = fantasyPricesDriver.map((fantasyPointDriver: FantasyPointsDriver) => fantasyPointDriver.race.circuit.name);
          this.points = fantasyPricesDriver.map((fantasyPointDriver: FantasyPointsDriver) => fantasyPointDriver.points);
        },
        error: () => {
          this.messageInfoService.showError(ERROR_POINT_FETCH);
        },
        complete: () => {
          this.showChart();
        }
      });
  }

  /**
   * Retrieves the points data for a specific team from the fantasy API and updates the chart accordingly.
   * @param teamId The ID of the team for which points data will be retrieved.
  */
  getTeamPoint(teamId: number) {
    this.fantasyApiService.getTeamPoints(teamId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (fantasyPointsTeam: FantasyPointsTeam[]) => {
          this.labels = fantasyPointsTeam.map((fantasyPointTeam: FantasyPointsTeam) => fantasyPointTeam.race.circuit.name);
          this.points = fantasyPointsTeam.map((fantasyPointTeam: FantasyPointsTeam) => fantasyPointTeam.points);
        },
        error: () => {
          this.messageInfoService.showError(ERROR_POINT_FETCH);
        },
        complete: () => {
          this.showChart();
        }
      });
  }

  /**
   * Updates the chart with the data retrieved from the API.
   * Applies styles to match the theme of the application.
   */
  showChart(): void {
    const chartConfig = this.fantasyService.getChartConfig(this.labels, this.points);
    this.data = chartConfig.data;
    this.options = chartConfig.options;
  }
}
