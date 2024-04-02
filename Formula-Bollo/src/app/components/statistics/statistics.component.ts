import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";
import { ERROR_DRIVER_INFO_FETCH, ERROR_SEASON_FETCH, ERROR_TEAM_INFO_FETCH } from "src/app/constants";
import { DriverInfo } from "src/shared/models/driverInfo";
import { Season } from "src/shared/models/season";
import { TeamInfo } from "src/shared/models/teamInfo";
import { DriverApiService } from "src/shared/services/api/driver-api.service";
import { SeasonApiService } from "src/shared/services/api/season-api.service";
import { TeamApiService } from "src/shared/services/api/team-api.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { ThemeService } from "src/shared/services/theme.service";

@Component({
  selector: "app-statistics",
  templateUrl: "./statistics.component.html",
  styleUrl: "./statistics.component.scss"
})
export class StatisticsComponent {

  optionStatistics: string[] = ["Pilotos", "Escuderías"];
  seasons: Season[] = [];
  driversInfo: DriverInfo[] = [];
  teamsInfo: TeamInfo[] = [];

  optionStatisticsForm: FormGroup = new FormGroup({
    option: new FormControl("")
  });
  seasonsForm: FormGroup = new FormGroup({
    season: new FormControl("")
  });

  optionStatisticsSelected: string = "Pilotos";
  seasonSelected: Season | undefined;
  firstSeasonSelected: Season = new Season(0, "Total", 0,);

  dataDriversPoles: unknown;
  dataDriversFastLaps: unknown;
  dataDriversPodiums: unknown;
  dataDriversVictories: unknown;
  dataDriversPenalties: unknown;
  dataDriversRacesFinished: unknown;
  dataDriversTotalPoints: unknown;
  dataDriversAveragePoints: unknown;

  dataTeamsPoles: unknown;
  dataTeamsFastLaps: unknown;
  dataTeamsPodiums: unknown;
  dataTeamsVictories: unknown;
  dataTeamsPenalties: unknown;
  dataTeamsRacesFinished: unknown;
  dataTeamsTotalPoints: unknown;
  dataTeamsAveragePoints: unknown;

  barChartOptions: unknown;
  reverseBarChartOptions: unknown;
  labels: string[] = [];

  labelsColors: string = "";
  colors: string[] = [];
  colorsMappings: { [key: string]: string } = {
    "Mercedes": "#6cd3bf",
    "Red Bull": "#3671c6",
    "Ferrari": "#f91536",
    "McLaren": "#f58020",
    "Alpine": "#2293d1",
    "AlphaTauri": "#5e8faa",
    "Aston Martin": "#358c75",
    "Alfa Romeo Racing": "#c92d4b",
    "Haas": "#b6babd",
    "Williams": "#37bedd"
  };

  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private driverApiService: DriverApiService,
    private seasonApiService: SeasonApiService,
    private messageInfoService: MessageInfoService,
    private teamApiService: TeamApiService,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.labelsColors = localStorage.getItem("theme") === "light" ? "white" : "dark";
    this.obtainAllSeasons();
    this.changeOption();
    this.changeSeason();
    this.loadOptionsCharts();
    this.themeService.theme$.subscribe((theme) => {
      this.labelsColors = theme === false ? "dark" : "white";
      this.loadOptionsCharts();
    });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Fetch all seasons and set a default season in the form.
   */
  obtainAllSeasons(): void {
    this.seasonApiService
      .getSeasons()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (seasons: Season[]) => {
          this.seasons = [];
          this.seasons.push(this.firstSeasonSelected);
          this.seasons.push(...seasons);
          this.seasonsForm.get("season")?.setValue(this.firstSeasonSelected);
        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_SEASON_FETCH);
          console.log(error);
          throw error;
        },
      });
  }

  /**
   * Listen for changes in the selected option and update the graphs.
   */
  changeOption(): void {
    this.optionStatisticsForm.valueChanges
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((data) => {
        if (data && data.option !== this.optionStatisticsSelected) {
          this.optionStatisticsSelected = data.option;

          if (this.optionStatisticsSelected === "Pilotos") {
            this.getStatisticsOfDrivers();
          } else if (this.optionStatisticsSelected === "Escuderías") {
            this.getStatisticsOfTeams();
          }
        }
      });
  }

  /**
   * Listen for changes in the selected season and update the graphs.
   */
  changeSeason(): void {
    this.seasonsForm.valueChanges
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((data) => {
        if (data) {
          this.seasonSelected = data.season;
          if (this.seasonSelected!.number != 0) {
            if (this.optionStatisticsSelected === "Pilotos") {
              this.getStatisticsOfDrivers(this.seasonSelected!.number);
            } else if (this.optionStatisticsSelected === "Escuderías") {
              this.getStatisticsOfTeams(this.seasonSelected!.number);
            }
          } else if (this.seasonSelected!.number == 0) {
            if (this.optionStatisticsSelected === "Pilotos") {
              this.getStatisticsOfDrivers();
            } else if (this.optionStatisticsSelected === "Escuderías") {
              this.getStatisticsOfTeams();
            }
          }

        }
      });
  }

  getStatisticsOfDrivers(seasonNumber?: number): void {
    this.driverApiService.getAllInfoDrivers(seasonNumber)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (driversInfo: DriverInfo[]) => {
          this.driversInfo = driversInfo;
        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_DRIVER_INFO_FETCH);
          console.log(error);
          throw error;
        },
        complete: () => {
          this.loadDataCharts();
        }
      });
  }

  getStatisticsOfTeams(seasonNumber?: number): void {
    this.teamApiService.getAllInfoTeam(seasonNumber)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (teamsInfo: TeamInfo[]) => {
          this.teamsInfo = teamsInfo;
        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_TEAM_INFO_FETCH);
          console.log(error);
          throw error;
        }, complete: () => {
          this.loadDataCharts();
        }
      });
  }

  loadDataCharts(): void {
    if (this.optionStatisticsSelected === "Pilotos") {
      this.getDataDriversPoles();
      this.getDataDriversPodiums();
      this.getDataDriversFastLaps();
      this.getDataDriversPenalties();
      this.getDataDriversVictories();
      this.getDataDriversRacesFinished();
      this.getDataDriversTotalPoints();
      this.getDataDriversAveragePoints();
    } else if (this.optionStatisticsSelected === "Escuderías") {
      this.getDataTeamsPoles();
      this.getDataTeamsPodiums();
      this.getDataTeamsFastLaps();
      this.getDataTeamsPenalties();
      this.getDataTeamsVictories();
      this.getDataTeamsRacesFinished();
      this.getDataTeamsTotalPoints();
      this.getDataTeamsAveragePoints();
    }
  }

  getDataDriversPoles(): void {
    const driversInfoWithPoles: DriverInfo[] = this.driversInfo.filter(driverInfo => driverInfo.poles > 0);
    const driverInfoWithPolesSorted: DriverInfo[] = driversInfoWithPoles.sort((a, b) => b.poles - a.poles);

    this.labels = driverInfoWithPolesSorted.map(driverInfo => driverInfo.driver.name);
    this.colors = driverInfoWithPolesSorted.map(driverInfo => this.colorsMappings[driverInfo.driver.team.name]);

    this.dataDriversPoles = {
      labels: this.labels,
      datasets: [{
        backgroundColor: this.colors,
        data: driverInfoWithPolesSorted.map(driverInfo => driverInfo.poles)
      }]
    };
  }

  getDataDriversFastLaps(): void {
    const driversInfoWithFastLaps: DriverInfo[] = this.driversInfo.filter(driverInfo => driverInfo.fastlaps > 0);
    const driversInfoWithFastLapsSorted: DriverInfo[] = driversInfoWithFastLaps.sort((a, b) => b.fastlaps - a.fastlaps);
    this.labels = driversInfoWithFastLapsSorted.map(driverInfo => driverInfo.driver.name);
    this.colors = driversInfoWithFastLapsSorted.map(driverInfo => this.colorsMappings[driverInfo.driver.team.name]);

    this.dataDriversFastLaps = {
      labels: this.labels,
      datasets: [{
        backgroundColor: this.colors,
        data: driversInfoWithFastLapsSorted.map(driverInfo => driverInfo.fastlaps)
      }]
    };
  }

  getDataDriversPodiums(): void {
    const driversInfoWithPodiums: DriverInfo[] = this.driversInfo.filter(driverInfo => driverInfo.podiums > 0);
    const driversInfoWithPodiumsSorted: DriverInfo[] = driversInfoWithPodiums.sort((a, b) => b.podiums - a.podiums);
    this.labels = driversInfoWithPodiumsSorted.map(driverInfo => driverInfo.driver.name);
    this.colors = driversInfoWithPodiumsSorted.map(driverInfo => this.colorsMappings[driverInfo.driver.team.name]);

    this.dataDriversPodiums = {
      labels: this.labels,
      datasets: [{
        backgroundColor: this.colors,
        data: driversInfoWithPodiumsSorted.map(driverInfo => driverInfo.podiums)
      }]
    };
  }

  getDataDriversVictories(): void {
    const driversInfoWithVictories: DriverInfo[] = this.driversInfo.filter(driverInfo => driverInfo.victories > 0);
    const driversInfoWithVictoriesSorted: DriverInfo[] = driversInfoWithVictories.sort((a, b) => b.victories - a.victories);
    this.labels = driversInfoWithVictoriesSorted.map(driverInfo => driverInfo.driver.name);
    this.colors = driversInfoWithVictoriesSorted.map(driverInfo => this.colorsMappings[driverInfo.driver.team.name]);

    this.dataDriversVictories = {
      labels: this.labels,
      datasets: [{
        backgroundColor: this.colors,
        data: driversInfoWithVictoriesSorted.map(driverInfo => driverInfo.victories)
      }]
    };
  }

  getDataDriversRacesFinished(): void {
    const driversInfoWithRacesFinished: DriverInfo[] = this.driversInfo.filter(driverInfo => driverInfo.racesFinished > 0);
    const driversInfoWithRacesFinishedSorted: DriverInfo[] = driversInfoWithRacesFinished.sort((a, b) => b.racesFinished - a.racesFinished);
    this.labels = driversInfoWithRacesFinishedSorted.map(driverInfo => driverInfo.driver.name);
    this.colors = driversInfoWithRacesFinishedSorted.map(driverInfo => this.colorsMappings[driverInfo.driver.team.name]);

    this.dataDriversRacesFinished = {
      labels: this.labels,
      datasets: [{
        backgroundColor: this.colors,
        data: driversInfoWithRacesFinishedSorted.map(driverInfo => driverInfo.racesFinished)
      }]
    };
  }

  getDataDriversPenalties(): void {
    const driversInfoWithPenalties: DriverInfo[] = this.driversInfo.filter(driverInfo => driverInfo.penalties > 0);
    const driversInfoWithPenaltiesSorted: DriverInfo[] = driversInfoWithPenalties.sort((a, b) => b.penalties - a.penalties);
    this.labels = driversInfoWithPenaltiesSorted.map(driverInfo => driverInfo.driver.name);
    this.colors = driversInfoWithPenaltiesSorted.map(driverInfo => this.colorsMappings[driverInfo.driver.team.name]);

    this.dataDriversPenalties = {
      labels: this.labels,
      datasets: [{
        backgroundColor: this.colors,
        data: driversInfoWithPenaltiesSorted.map(driverInfo => driverInfo.penalties)
      }]
    };
  }

  getDataDriversTotalPoints(): void {
    const driverInfoWithTotalPoints: DriverInfo[] = this.driversInfo.sort((a, b) => b.totalPoints - a.totalPoints);
    this.labels = driverInfoWithTotalPoints.map(driverInfo => driverInfo.driver.name);
    this.colors = driverInfoWithTotalPoints.map(driverInfo => this.colorsMappings[driverInfo.driver.team.name]);

    this.dataDriversTotalPoints = {
      labels: this.labels,
      datasets: [{
        backgroundColor: this.colors,
        data: driverInfoWithTotalPoints.map(driverInfo => driverInfo.totalPoints)
      }]
    };
  }

  getDataDriversAveragePoints(): void {
    const driverInfoWithAveragePoints: DriverInfo[] = this.driversInfo.sort((a, b) => parseFloat((b.totalPoints / b.racesFinished).toFixed(2)) - parseFloat((a.totalPoints / a.racesFinished).toFixed(2)));
    this.labels = driverInfoWithAveragePoints.map(driverInfo => driverInfo.driver.name);
    this.colors = driverInfoWithAveragePoints.map(driverInfo => this.colorsMappings[driverInfo.driver.team.name]);

    this.dataDriversAveragePoints = {
      labels: this.labels,
      datasets: [{
        backgroundColor: this.colors,
        data: driverInfoWithAveragePoints.map(driverInfo => parseFloat((driverInfo.totalPoints / driverInfo.racesFinished).toFixed(2)))
      }]
    };
  }

  getDataTeamsPoles(): void {
    const teamsInfoWithPoles: TeamInfo[] = this.teamsInfo.filter(teamInfo => teamInfo.poles > 0);
    const teamsInfoWithPolesSorted: TeamInfo[] = teamsInfoWithPoles.sort((a, b) => b.poles - a.poles);
    this.labels = teamsInfoWithPolesSorted.map(teamInfo => teamInfo.team.name);
    this.colors = teamsInfoWithPolesSorted.map(teamInfo => this.colorsMappings[teamInfo.team.name]);

    this.dataTeamsPoles = {
      labels: this.labels,
      datasets: [{
        backgroundColor: this.colors,
        data: teamsInfoWithPolesSorted.map(teamInfo => teamInfo.poles)
      }]
    };
  }

  getDataTeamsPodiums(): void {
    const teamsInfoWithPodiums: TeamInfo[] = this.teamsInfo.filter(teamInfo => teamInfo.podiums > 0);
    const teamsInfoWithPodiumsSorted: TeamInfo[] = teamsInfoWithPodiums.sort((a, b) => b.podiums - a.podiums);
    this.labels = teamsInfoWithPodiumsSorted.map(teamInfo => teamInfo.team.name);
    this.colors = teamsInfoWithPodiumsSorted.map(teamInfo => this.colorsMappings[teamInfo.team.name]);

    this.dataTeamsPodiums = {
      labels: this.labels,
      datasets: [{
        backgroundColor: this.colors,
        data: teamsInfoWithPodiumsSorted.map(teamInfo => teamInfo.podiums)
      }]
    };
  }

  getDataTeamsFastLaps(): void {
    const teamsInfoWithFastLaps: TeamInfo[] = this.teamsInfo.filter(teamInfo => teamInfo.fastlaps > 0);
    const teamsInfoWithFastLapsSorted: TeamInfo[] = teamsInfoWithFastLaps.sort((a, b) => b.fastlaps - a.fastlaps);
    this.labels = teamsInfoWithFastLapsSorted.map(teamInfo => teamInfo.team.name);
    this.colors = teamsInfoWithFastLapsSorted.map(teamInfo => this.colorsMappings[teamInfo.team.name]);

    this.dataTeamsFastLaps = {
      labels: this.labels,
      datasets: [{
        backgroundColor: this.colors,
        data: teamsInfoWithFastLapsSorted.map(teamInfo => teamInfo.fastlaps)
      }]
    };
  }

  getDataTeamsPenalties(): void {
    const teamsInfoWithPenalties: TeamInfo[] = this.teamsInfo.filter(teamInfo => teamInfo.penalties > 0);
    const teamsInfoWithPenaltiesSorted: TeamInfo[] = teamsInfoWithPenalties.sort((a, b) => b.penalties - a.penalties);
    this.labels = teamsInfoWithPenaltiesSorted.map(teamInfo => teamInfo.team.name);
    this.colors = teamsInfoWithPenaltiesSorted.map(teamInfo => this.colorsMappings[teamInfo.team.name]);

    this.dataTeamsPenalties = {
      labels: this.labels,
      datasets: [{
        backgroundColor: this.colors,
        data: teamsInfoWithPenaltiesSorted.map(teamInfo => teamInfo.penalties)
      }]
    };
  }

  getDataTeamsVictories(): void {
    const teamsInfoWithVictories: TeamInfo[] = this.teamsInfo.filter(teamInfo => teamInfo.victories > 0);
    const teamsInfoWithVictoriesSorted: TeamInfo[] = teamsInfoWithVictories.sort((a, b) => b.victories - a.victories);
    this.labels = teamsInfoWithVictoriesSorted.map(teamInfo => teamInfo.team.name);
    this.colors = teamsInfoWithVictoriesSorted.map(teamInfo => this.colorsMappings[teamInfo.team.name]);

    this.dataTeamsVictories = {
      labels: this.labels,
      datasets: [{
        backgroundColor: this.colors,
        data: teamsInfoWithVictoriesSorted.map(teamInfo => teamInfo.victories)
      }]
    };
  }

  getDataTeamsRacesFinished(): void {
    const teamsInfoWithRacesFinished: TeamInfo[] = this.teamsInfo.filter(teamInfo => teamInfo.racesFinished > 0);
    const teamsInfoWithRacesFinishedSorted: TeamInfo[] = teamsInfoWithRacesFinished.sort((a, b) => b.victories - a.victories);
    this.labels = teamsInfoWithRacesFinishedSorted.map(teamInfo => teamInfo.team.name);
    this.colors = teamsInfoWithRacesFinishedSorted.map(teamInfo => this.colorsMappings[teamInfo.team.name]);

    this.dataTeamsRacesFinished = {
      labels: this.labels,
      datasets: [{
        backgroundColor: this.colors,
        data: teamsInfoWithRacesFinishedSorted.map(teamInfo => teamInfo.racesFinished)
      }]
    };
  }

  getDataTeamsTotalPoints(): void {
    const teamsInfoWithTotalPoints: TeamInfo[] = this.teamsInfo.sort((a, b) => b.totalPoints - a.totalPoints);
    this.labels = teamsInfoWithTotalPoints.map(teamInfo => teamInfo.team.name);
    this.colors =  teamsInfoWithTotalPoints.map(teamInfo => this.colorsMappings[teamInfo.team.name]);

    this.dataTeamsTotalPoints = {
      labels: this.labels,
      datasets: [{
        backgroundColor: this.colors,
        data: teamsInfoWithTotalPoints.map(teamInfo => teamInfo.totalPoints)
      }]
    };
  }

  getDataTeamsAveragePoints(): void {
    const driverInfoWithAveragePoints: TeamInfo[] = this.teamsInfo.sort((a, b) => parseFloat((b.totalPoints / b.racesFinished).toFixed(2)) - parseFloat((a.totalPoints / a.racesFinished).toFixed(2)));
    this.labels = driverInfoWithAveragePoints.map(teamInfo => teamInfo.team.name);
    this.colors =  driverInfoWithAveragePoints.map(teamInfo => this.colorsMappings[teamInfo.team.name]);
    this.dataTeamsAveragePoints = {
      labels: this.labels,
      datasets: [{
        backgroundColor: this.colors,
        data:  driverInfoWithAveragePoints.map(teamInfo => parseFloat((teamInfo.totalPoints / teamInfo.racesFinished).toFixed(2))).sort((a, b) => b - a)
      }]
    };
  }

  loadOptionsCharts(): void {
    this.barChartOptions   = {
      stacked: false,
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          ticks: {
            color: this.labelsColors
          },
          grid: {
            color: this.labelsColors,
            display: false
          }
        },
        y: {
          type: "linear",
          display: true,
          position: "left",
          grace: "10%",
          ticks: {
            color: this.labelsColors
          },
          grid: {
            color: this.labelsColors
          }
        }
      }
    };

    this.reverseBarChartOptions = {
      indexAxis: "y",
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          grace: "10%",
          ticks: {
            color: this.labelsColors,
            autoSkip: false,
          },
          grid: {
            color: this.labelsColors,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: this.labelsColors,
            autoSkip: false,
          },
          grid: {
            color: this.labelsColors,
            display: false,
            drawBorder: false
          }
        }
      }
    };
  }
}
