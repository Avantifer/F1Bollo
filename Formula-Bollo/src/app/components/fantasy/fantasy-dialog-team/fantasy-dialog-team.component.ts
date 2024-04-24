import { Component } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Subject } from "rxjs";
import { FantasyElection } from "src/shared/models/fantasyElection";
import { FantasyService } from "src/shared/services/fantasy.service";

@Component({
  selector: "app-fantasy-dialog-team",
  templateUrl: "./fantasy-dialog-team.component.html",
  styleUrls: ["./fantasy-dialog-team.component.scss"],
})
export class FantasyDialogTeamComponent {
  fantasyElection: FantasyElection | undefined;
  pointsDriverArray: number[] = [];
  pointsTeamArray: number[] = [];
  ref: DynamicDialogRef | undefined;
  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private fantasyService: FantasyService,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.fantasyElection = this.config.data.fantasyElection;
    this.getSpecificPointsPerDriver(this.fantasyElection!);
    this.getSpecificPointsPerTeam(this.fantasyElection!);
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Retrieves specific points for each driver in the fantasy election and updates corresponding properties.
   *
   * @param fantasyElection - The fantasy election data containing driver information.
   */
  getSpecificPointsPerDriver(fantasyElection: FantasyElection): void {
    this.pointsDriverArray = this.fantasyService.getSpecificPointsPerDriver(fantasyElection);
  }

  /**
   * Retrieves specific points for each team in the fantasy election and updates corresponding properties.
   *
   * @param fantasyElection - The fantasy election data containing team information.
   */
  getSpecificPointsPerTeam(fantasyElection: FantasyElection): void {
    this.pointsTeamArray = this.fantasyService.getSpecificPointsPerTeam(fantasyElection);
  }
}
