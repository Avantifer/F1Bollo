import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { ERROR_DRIVER_TEAM_FETCH, ERROR_TEAM_INFO_FETCH, ERROR_TEAM_NAME_NOT_FOUND } from "src/app/constants";
import { Driver } from "src/shared/models/driver";
import { Season } from "src/shared/models/season";
import { TeamInfo } from "src/shared/models/teamInfo";
import { DriverApiService } from "src/shared/services/api/driver-api.service";
import { SeasonApiService } from "src/shared/services/api/season-api.service";
import { TeamApiService } from "src/shared/services/api/team-api.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";

@Component({
  selector: "app-teams-info",
  templateUrl: "./teams-info.component.html",
  styleUrl: "./teams-info.component.scss"
})
export class TeamsInfoComponent {
  seasonForm: FormGroup = new FormGroup({
    season: new FormControl("")
  });
  name: string | null = "";
  seasons: Season[] = [];
  firstSeasonSelected: Season = new Season(0, "Total", 0);
  seasonSelected: Season = this.firstSeasonSelected;
  teamInfo: TeamInfo | undefined;
  drivers: Driver[] = [];

  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private seasonApiService: SeasonApiService,
    private teamApiService: TeamApiService,
    private driverApiService: DriverApiService,
    private messageInfoService: MessageInfoService,
  ) { }

  ngOnInit(): void {
    this.name = this.route.snapshot.paramMap.get("name")!.replaceAll("_", " ");
    this.getSeasonsByTeamName(this.name);
    this.changeSeasons();
  }

  getSeasonsByTeamName(teamName: string): void {
    this.seasonApiService
      .getSeasonByTeamName(teamName)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (seasons: Season[]) => {
          this.seasons = seasons;
        },
        error: (error) => {
          this.messageInfoService.showError(error);
          console.log(error);
          throw error;
        },
        complete: () => {
          if (this.seasons.length === 0) {
            this.router.navigate(["/teams"]);
            this.messageInfoService.showError(ERROR_TEAM_NAME_NOT_FOUND);
          }
          this.seasons.push(this.firstSeasonSelected);
          this.seasons.sort((a: Season, b: Season) => a.id - b.id);
          this.getInfoByTeamName(this.name!);
        }
      });
  }

  getInfoByTeamName(teamName: string, seasonNumber?: number): void {
    this.teamApiService
      .getInfoByTeamName(teamName, seasonNumber)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (teamInfo: TeamInfo) => {
          this.teamInfo = teamInfo;
        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_TEAM_INFO_FETCH);
          console.log(error);
          throw error;
        },
        complete: () => {
          this.getDriversbyTeam(this.teamInfo!.team.id);
        }
      });
  }

  changeSeasons(): void {
    this.seasonForm.valueChanges
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (data) => {
          if (data.season.id === 0 ){
            this.getInfoByTeamName(this.name!);
          } else {
            this.getInfoByTeamName(this.name!, data.season.number);
          }
        }
      });
  }

  getDriversbyTeam(teamId: number): void {
    this.driverApiService.getDriversByTeam(teamId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (drivers: Driver[]) => {
          this.drivers = drivers;
        }, error: (error) => {
          this.messageInfoService.showError(error);
          console.log(error);
          throw error;
        }, complete: () => {
          if (this.drivers.length === 0) {
            this.messageInfoService.showError(ERROR_DRIVER_TEAM_FETCH);
          }
        }
      });
  }

  public driverNameSpaceToUnderScore(driverName: string): string {
    return driverName.replaceAll(" ", "_");
  }
}
