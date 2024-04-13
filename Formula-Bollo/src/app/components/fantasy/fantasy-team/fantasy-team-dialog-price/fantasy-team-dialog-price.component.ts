import { Component } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Subject, takeUntil } from "rxjs";
import { ERROR_PRICE_FETCH } from "src/app/constants";
import { FantasyPriceDriver } from "src/shared/models/fantasyPriceDriver";
import { FantasyPriceTeam } from "src/shared/models/fantasyPriceTeam";
import { FantasyApiService } from "src/shared/services/api/fantasy-api.service";
import { FantasyService } from "src/shared/services/fantasy.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";

@Component({
  selector: "app-fantasy-team-dialog-price",
  templateUrl: "./fantasy-team-dialog-price.component.html",
  styleUrl: "./fantasy-team-dialog-price.component.scss"
})
export class FantasyTeamDialogPriceComponent {
  data: unknown;
  options: unknown;
  labels: string[] = [];
  prices: number[] = [];

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
      this.getDriverPrice(id);
    } else if (type === "teams"){
      this.getTeamPrice(id);
    }
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Retrieves the price data for a specific driver from the fantasy API and updates the chart accordingly.
   * @param driverId The ID of the driver for which price data will be retrieved.
   */
  getDriverPrice(driverId: number) {
    this.fantasyApiService.getDriverPrice(driverId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (fantasyPricesDriver: FantasyPriceDriver[]) => {
          this.labels = fantasyPricesDriver.map((fantasyPriceDriver: FantasyPriceDriver) => fantasyPriceDriver.race.circuit.name);
          this.prices = fantasyPricesDriver.map((fantasyPriceDriver: FantasyPriceDriver) => fantasyPriceDriver.price);
        },
        error: () => {
          this.messageInfoService.showError(ERROR_PRICE_FETCH);
        },
        complete: () => {
          this.showChart();
        }
      });
  }

  /**
   * Retrieves the price data for a specific team from the fantasy API and updates the chart accordingly.
   * @param teamId The ID of the team for which price data will be retrieved.
  */
  getTeamPrice(teamId: number) {
    this.fantasyApiService.getTeamPrice(teamId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (fantasyPricesDriver: FantasyPriceTeam[]) => {
          this.labels = fantasyPricesDriver.map((fantasyPriceTeam: FantasyPriceTeam) => fantasyPriceTeam.race.circuit.name);
          this.prices = fantasyPricesDriver.map((fantasyPriceTeam: FantasyPriceTeam) => fantasyPriceTeam.price);
        },
        error: () => {
          this.messageInfoService.showError(ERROR_PRICE_FETCH);
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
    const chartConfig = this.fantasyService.getChartConfig(this.labels, this.prices);
    this.data = chartConfig.data;
    this.options = chartConfig.options;
  }
}
