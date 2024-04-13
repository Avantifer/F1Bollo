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
  pointsDriverOne: number = 0;
  pointsDriverTwo: number = 0;
  pointsDriverThree: number = 0;
  pointsTeamOne: number = 0;
  pointsTeamTwo: number = 0;
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
    this.fantasyService.getSpecificPointsPerDriver(fantasyElection, this.pointsDriverOne, this.pointsDriverTwo, this.pointsDriverThree);
  }

  /**
   * Retrieves specific points for each team in the fantasy election and updates corresponding properties.
   *
   * @param fantasyElection - The fantasy election data containing team information.
   */
  getSpecificPointsPerTeam(fantasyElection: FantasyElection): void {
    this.fantasyService.getSpecificPointsPerTeam(fantasyElection, this.pointsTeamOne, this.pointsTeamTwo);
  }
}
