import { Component } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { ERROR_TEAM_FETCH } from "src/app/constants";
import { environment } from "src/enviroments/enviroment";
import { Season } from "src/shared/models/season";
import { TeamWithDrivers } from "src/shared/models/teamWithDrivers";
import { TeamApiService } from "src/shared/services/api/team-api.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { SeasonService } from "src/shared/services/season.service";

@Component({
  selector: "app-teams",
  templateUrl: "./teams.component.html",
  styleUrls: ["./teams.component.scss"],
})
export class TeamsComponent {
  teamWithDrivers: TeamWithDrivers[] = [];
  seasons: Season[] = [];

  seasonForm: FormGroup = new FormGroup({
    season: new FormControl(""),
  });

  seasonSelected: Season = environment.seasonActual;

  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    public router: Router,
    private teamApiService: TeamApiService,
    private messageInfoService: MessageInfoService,
    private seasonService: SeasonService,

  ) {}

  ngOnInit(): void {
    this.obtainAllSeasons();
    this.obtainAllTeamsWithDrivers();
    this.changeSeasonTeams();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Get all Teams with their drivers from Backend.
   */
  obtainAllTeamsWithDrivers(seasonNumber?: number): void {
    this.teamApiService
      .getAllTeamsWithDrivers(seasonNumber)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (teamWithDrivers: TeamWithDrivers[]) => {
          this.teamWithDrivers = teamWithDrivers;
        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_TEAM_FETCH);
          console.log(error);
        }
      });
  }

  /**
   * Fetch all seasons and set a default season in the form.
   */
  obtainAllSeasons(): void {
    this.seasonService.obtainAllSeasons(this.seasons, this.seasonSelected, this.seasonForm);
  }

  /**
   * Listen for changes in the selected season and update the list of teams with drivers accordingly.
   */
  changeSeasonTeams(): void {
    this.seasonForm.valueChanges
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((data) => {
        this.seasonSelected = data.season;
        this.teamWithDrivers = [];
        this.obtainAllTeamsWithDrivers(this.seasonSelected.number);
      });
  }

  /**
   * Convert team name space to underscore.
   *
   * @param teamName - The input team name to be converted.
   * @returns The team name with spaces replaced by underscores.
   */
  public teamNameSpaceToUnderScore(teamName: string): string {
    return teamName.replaceAll(" ", "_");
  }
}
