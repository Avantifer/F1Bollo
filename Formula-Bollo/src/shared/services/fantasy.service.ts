import { Injectable } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { ERROR_POINT_FETCH } from "src/app/constants";
import { MessageInfoService } from "./messageinfo.service";
import { FantasyApiService } from "./api/fantasy-api.service";
import { FantasyElection } from "../models/fantasyElection";
import { FantasyPointsDriver } from "../models/fantasyPointsDriver";
import { FantasyPointsTeam } from "../models/fantasyPointsTeam";

@Injectable({
  providedIn: "root"
})
export class FantasyService {

  constructor(private fantasyApiService: FantasyApiService, private messageInfoService: MessageInfoService) { }

  private _unsubscribe: Subject<void> = new Subject<void>();


  /**
   * Retrieves specific points for each driver in the fantasy election and updates corresponding properties.
   *
   * @param fantasyElection - The fantasy election data containing driver information.
   * @param pointsDriverOne - The points of driver one.
   * @param pointsDriverTwo - The points of driver two.
   * @param pointsDriverThree - The points of driver three.
   */
  getSpecificPointsPerDriver(fantasyElection: FantasyElection, pointsDriverOne: number, pointsDriverTwo: number, pointsDriverThree: number): void {
    const raceId: number = fantasyElection.race!.id;

    this.fantasyApiService
      .getDriverPointsSpecificRace(fantasyElection.driverOne!.id, raceId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (fantasyPointsDriver: FantasyPointsDriver) => {
          if (pointsDriverOne < 0) return;
          pointsDriverOne = fantasyPointsDriver.points;
        },
        error: () => {
          this.messageInfoService.showError(ERROR_POINT_FETCH);
        },
      });

    this.fantasyApiService
      .getDriverPointsSpecificRace(fantasyElection.driverTwo!.id, raceId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (fantasyPointsDriver: FantasyPointsDriver) => {
          if (pointsDriverTwo < 0) return;
          pointsDriverTwo = fantasyPointsDriver.points;
        },
        error: () => {
          this.messageInfoService.showError(ERROR_POINT_FETCH);
        },
      });

    this.fantasyApiService
      .getDriverPointsSpecificRace(fantasyElection.driverThree!.id, raceId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (fantasyPointsDriver: FantasyPointsDriver) => {
          if (pointsDriverThree < 0) return;
          pointsDriverThree = fantasyPointsDriver.points;
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
   * @param pointsTeamOne - The points of team one.
   * @param pointsTeamTwo - The points of team two.
   */
  getSpecificPointsPerTeam(fantasyElection: FantasyElection, pointsTeamOne: number, pointsTeamTwo: number): void {
    const raceId: number = fantasyElection.race!.id;

    this.fantasyApiService
      .getTeamsPointsSpecificRace(fantasyElection.teamOne!.id, raceId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (fantasyPointsTeam: FantasyPointsTeam) => {
          if (pointsTeamOne < 0) return;
          pointsTeamOne = fantasyPointsTeam.points;
        },
        error: () => {
          this.messageInfoService.showError(ERROR_POINT_FETCH);
        },
      });

    this.fantasyApiService
      .getTeamsPointsSpecificRace(fantasyElection.teamTwo!.id, raceId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (fantasyPointsTeam: FantasyPointsTeam) => {
          if (pointsTeamTwo < 0) return;
          pointsTeamTwo = fantasyPointsTeam.points;
        },
        error: () => {
          this.messageInfoService.showError(ERROR_POINT_FETCH);
        },
      });
  }

  /**
   * Retrieves specific points for each team in the fantasy election and updates corresponding properties.
   *
   * @param labelsToChart - The labels that the chart will show.
   * @param dataToChart - The data that the chart will show.
   */
  getChartConfig(labelsToChart: string[], dataToChart: number[]): { data: unknown, options: unknown } {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const blue500 = documentStyle.getPropertyValue("--blue-500");

    const data = {
      labels: labelsToChart,
      datasets: [
        {
          label: "Precio",
          fill: false,
          borderColor: blue500,
          yAxisID: "y",
          tension: 0,
          data: dataToChart
        }
      ]
    };

    const options = {
      stacked: false,
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          type: "linear",
          display: true,
          position: "left",
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        }
      }
    };

    return { data, options };
  }
}
