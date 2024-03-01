import { Component } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { environment } from "src/enviroments/enviroment";
import { Configuration } from "src/shared/models/configuration";
import { Team } from "src/shared/models/team";
import { ThemeService } from "src/shared/services/theme.service";
import { TeamApiService } from "src/shared/services/api/team-api.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { ERROR_TEAM_FETCH } from "src/app/constants";

@Component({
  selector: "app-home-teams",
  templateUrl: "./home-teams.component.html",
  styleUrl: "./home-teams.component.scss",
})
export class HomeTeamsComponent {

  teams: Team[] = [];
  configurations: Configuration[] = [];
  themeClass: string = "";

  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private teamApiService: TeamApiService,
    private messageInfoService: MessageInfoService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.obtainAllTeams();
    this.themeService.theme$.subscribe((theme) => {
      this.themeClass = theme === true ? "dark-theme" : "light-theme";
    });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Fetch all team data and update the component's teams property.
   */
  obtainAllTeams(): void {
    this.teamApiService
      .getAllTeams(environment.seasonActual.number)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (teams: Team[]) => {
          this.teams = teams;
        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_TEAM_FETCH);
          console.log(error);
          throw error;
        },
      });
  }
}
