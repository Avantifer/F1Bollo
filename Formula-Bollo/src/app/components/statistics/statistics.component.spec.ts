/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { StatisticsComponent } from "./statistics.component";
import { DriverApiService } from "src/shared/services/api/driver-api.service";
import { SeasonApiService } from "src/shared/services/api/season-api.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { TeamApiService } from "src/shared/services/api/team-api.service";
import { ThemeService } from "src/shared/services/theme.service";
import { DropdownModule } from "primeng/dropdown";
import { BehaviorSubject, of, throwError } from "rxjs";
import { Season } from "src/shared/models/season";
import { ReactiveFormsModule } from "@angular/forms";
import { SkeletonModule } from "primeng/skeleton";
import { ERROR_DRIVER_INFO_FETCH, ERROR_SEASON_FETCH, ERROR_TEAM_INFO_FETCH } from "src/app/constants";
import { DriverInfo } from "src/shared/models/driverInfo";
import { Driver } from "src/shared/models/driver";
import { Team } from "src/shared/models/team";
import { TeamInfo } from "src/shared/models/teamInfo";

describe("StatisticsComponent", () => {
  let component: StatisticsComponent;
  let fixture: ComponentFixture<StatisticsComponent>;
  let driverApiServiceSpy: jasmine.SpyObj<DriverApiService>;
  let seasonApiServiceSpy: jasmine.SpyObj<SeasonApiService>;
  let messageInfoServiceSpy: jasmine.SpyObj<MessageInfoService>;
  let teamApiServiceSpy: jasmine.SpyObj<TeamApiService>;
  let themeServiceSpy: any;
  let themeSubject: BehaviorSubject<boolean>;

  // beforeAll(async () => {
  //   let store: any = {};

  //   const mockLocalStorage = {
  //     getItem: (key: string): string => {
  //       return key in store ? store[key] : null;
  //     },
  //     setItem: (key: string, value: string) => {
  //       store[key] = `${value}`;
  //     },
  //     removeItem: (key: string) => {
  //       delete store[key];
  //     },
  //     clear: () => {
  //       store = {};
  //     }
  //   };

  //   spyOn(localStorage, "getItem").and.callFake(mockLocalStorage.getItem);
  //   spyOn(localStorage, "setItem").and.callFake(mockLocalStorage.setItem);
  //   spyOn(localStorage, "removeItem").and.callFake(mockLocalStorage.removeItem);
  //   spyOn(localStorage, "clear").and.callFake(mockLocalStorage.clear);
  // });

  beforeEach(async () => {
    driverApiServiceSpy = jasmine.createSpyObj("DriverApiService", ["getAllInfoDrivers"]);
    seasonApiServiceSpy = jasmine.createSpyObj("SeasonApiService", ["getSeasons"]);
    messageInfoServiceSpy = jasmine.createSpyObj("MessageInfoService", ["showError"]);
    teamApiServiceSpy = jasmine.createSpyObj("TeamApiService", ["getAllInfoTeam"]);
    themeSubject = new BehaviorSubject<boolean>(true);
    themeServiceSpy = { theme$: themeSubject.asObservable() };

    await TestBed.configureTestingModule({
      declarations: [StatisticsComponent],
      imports: [
        ReactiveFormsModule,
        DropdownModule,
        SkeletonModule
      ],
      providers: [
        { provide: DriverApiService, useValue: driverApiServiceSpy },
        { provide: SeasonApiService, useValue: seasonApiServiceSpy },
        { provide: MessageInfoService, useValue: messageInfoServiceSpy },
        { provide: TeamApiService, useValue: teamApiServiceSpy },
        { provide: ThemeService, useValue: themeServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticsComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with default values and fetch seasons", () => {
    const mockSeasons = [new Season(1, "Temporada 1", 1)];
    seasonApiServiceSpy.getSeasons.and.returnValue(of(mockSeasons));
    spyOn(component, "getStatisticsOfDrivers");

    component.ngOnInit();

    expect(component.labelsColors).toBe("white");
    themeSubject.next(false);
    expect(component.labelsColors).toBe("dark");

    expect(component.seasons.length).toBe(2);
    expect(component.seasonsForm.get("season")?.value).toEqual(component.firstSeasonSelected);

    component.ngOnInit();
  });

  it("should set labelsColors based on localStorage theme", () => {
    spyOn(component, "getStatisticsOfDrivers");
    spyOn(component, "obtainAllSeasons");
    localStorage.setItem("theme", "dark");

    component.ngOnInit();

    localStorage.setItem("theme", "light");
    component.ngOnInit();
  });

  it("should handle error when fetching seasons", () => {
    seasonApiServiceSpy.getSeasons.and.returnValue(throwError(() => ERROR_SEASON_FETCH));
    spyOn(component, "obtainAllSeasons").and.callThrough();

    component.obtainAllSeasons();

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_SEASON_FETCH);
  });

  it("should update optionStatisticsSelected and call getStatisticsOfDrivers when option is Pilotos", () => {
    spyOn(component, "obtainAllSeasons");
    spyOn(component, "getStatisticsOfDrivers");

    component.changeOption();
    component.optionStatisticsSelected = "Escuderías";
    component.optionStatisticsForm.setValue({ option: "Pilotos" });
  });

  it("should update optionStatisticsSelected and call getStatisticsOfTeams when option is Escuderías", () => {
    spyOn(component, "obtainAllSeasons");
    spyOn(component, "getStatisticsOfTeams");

    component.changeOption();
    component.optionStatisticsSelected = "Pilotos";
    component.optionStatisticsForm.setValue({ option: "Escuderías" });
  });

  it("should changeSeason and call statistics for drivers", () => {
    spyOn(component, "getStatisticsOfDrivers");

    component.changeSeason();
    component.seasonSelected = new Season(1, "Temporada 1", 1);
    component.optionStatisticsSelected = "Pilotos";
    component.seasonsForm.setValue({ season: new Season(1, "Temporada 1", 1)});
  });

  it("should changeSeason and call statistics for teams", () => {
    spyOn(component, "getStatisticsOfTeams");

    component.changeSeason();
    component.seasonSelected = new Season(1, "Temporada 1", 1);
    component.optionStatisticsSelected = "Escuderías";
    component.seasonsForm.setValue({ season: new Season(1, "Temporada 1", 1)});
  });

  it("should changeSeason and call statistics for drivers", () => {
    spyOn(component, "getStatisticsOfDrivers");

    component.changeSeason();
    component.seasonSelected = new Season(1, "Temporada 1", 0);
    component.optionStatisticsSelected = "Pilotos";
    component.seasonsForm.setValue({ season: new Season(1, "Temporada 1", 0)});
  });

  it("should changeSeason and call statistics for teams", () => {
    spyOn(component, "getStatisticsOfTeams");

    component.changeSeason();
    component.seasonSelected = new Season(1, "Temporada 1", 0);
    component.optionStatisticsSelected = "Escuderías";
    component.seasonsForm.setValue({ season: new Season(1, "Temporada 1", 0)});
  });

  it("should get statistics of drivers and loadDataCharts", () => {
    const driversInfo = [
      new DriverInfo(
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        10,
        10,
        10,
        10,
        10,
        10,
        1,
        10,
        10
      )
    ];
    driverApiServiceSpy.getAllInfoDrivers.and.returnValue(of(driversInfo));
    spyOn(component, "loadDataCharts");

    component.getStatisticsOfDrivers();

    expect(component.driversInfo).toBe(driversInfo);
  });

  it("should thrown error getting statistics of drivers", () =>{
    driverApiServiceSpy.getAllInfoDrivers.and.returnValue(throwError(() => ERROR_DRIVER_INFO_FETCH));

    component.getStatisticsOfDrivers();

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_DRIVER_INFO_FETCH);
  });

  it("should get statistics of teams and loadDataCharts", () => {
    const teamsInfo = [
      new TeamInfo(
        new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        10,
        10,
        10,
        10,
        10,
        10,
        1,
        10,
        10,
        10
      )
    ];
    teamApiServiceSpy.getAllInfoTeam.and.returnValue(of(teamsInfo));
    spyOn(component, "loadDataCharts");

    component.getStatisticsOfTeams();

    expect(component.teamsInfo).toBe(teamsInfo);
  });

  it("should thrown error getting statistics of drivers", () =>{
    teamApiServiceSpy.getAllInfoTeam.and.returnValue(throwError(() => ERROR_TEAM_INFO_FETCH));

    component.getStatisticsOfTeams();

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_TEAM_INFO_FETCH);
  });

  it("should call some methods when load charts with Pilotos", () => {
    spyOn(component, "getDataDriversPoles");
    spyOn(component, "getDataDriversPodiums");
    spyOn(component, "getDataDriversFastLaps");
    spyOn(component, "getDataDriversPenalties");
    spyOn(component, "getDataDriversVictories");
    spyOn(component, "getDataDriversRacesFinished");
    spyOn(component, "getDataDriversTotalPoints");
    spyOn(component, "getDataDriversAveragePoints");
    component.optionStatisticsSelected = "Pilotos";

    component.loadDataCharts();
  });

  it("should call some methods when load charts with Escuderías", () => {
    spyOn(component, "getDataTeamsPoles");
    spyOn(component, "getDataTeamsPodiums");
    spyOn(component, "getDataTeamsFastLaps");
    spyOn(component, "getDataTeamsPenalties");
    spyOn(component, "getDataTeamsVictories");
    spyOn(component, "getDataTeamsRacesFinished");
    spyOn(component, "getDataTeamsTotalPoints");
    spyOn(component, "getDataTeamsAveragePoints");
    component.optionStatisticsSelected = "Escuderías";

    component.loadDataCharts();
  });

  it("should populate dataDriversPoles correctly", () => {
    const driversInfo: DriverInfo[] = [
      new DriverInfo(
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        10,
        10,
        10,
        10,
        10,
        10,
        1,
        10,
        10
      ),
      new DriverInfo(
        new Driver(1, "AlbertoMD", 18,new Team( 1, "Williams", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        5,
        10,
        10,
        10,
        10,
        10,
        1,
        10,
        10
      )
    ];
    component.driversInfo = driversInfo;

    component.getDataDriversPoles();

    expect(component.dataDriversPoles).toEqual({
      labels: ["Avantifer", "AlbertoMD"],
      datasets: [{
        backgroundColor: ["#358c75", "#37bedd"],
        data: [10, 5]
      }]
    });
  });

  it("should populate dataDriversFastLaps correctly", () => {
    const driversInfo: DriverInfo[] = [
      new DriverInfo(
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        10,
        20,
        10,
        10,
        10,
        10,
        1,
        5,
        10
      ),
      new DriverInfo(
        new Driver(1, "AlbertoMD", 18,new Team( 1, "Williams", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        5,
        30,
        10,
        10,
        10,
        10,
        1,
        10,
        10
      )
    ];
    component.driversInfo = driversInfo;

    component.getDataDriversFastLaps();

    expect(component.dataDriversFastLaps).toEqual({
      labels: ["AlbertoMD", "Avantifer"],
      datasets: [{
        backgroundColor: ["#37bedd", "#358c75"],
        data: [30, 20]
      }]
    });
  });

  it("should populate dataDriversPodiums correctly", () => {
    const driversInfo: DriverInfo[] = [
      new DriverInfo(
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        10,
        10,
        10,
        10,
        10,
        10,
        1,
        5,
        10
      ),
      new DriverInfo(
        new Driver(1, "AlbertoMD", 18,new Team( 1, "Williams", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        5,
        10,
        10,
        10,
        10,
        10,
        1,
        10,
        10
      )
    ];
    component.driversInfo = driversInfo;

    component.getDataDriversPodiums();

    expect(component.dataDriversPodiums).toEqual({
      labels: ["AlbertoMD", "Avantifer"],
      datasets: [{
        backgroundColor: ["#37bedd", "#358c75"],
        data: [10, 5]
      }]
    });
  });

  it("should populate dataDriversVictories correctly", () => {
    const driversInfo: DriverInfo[] = [
      new DriverInfo(
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        10,
        10,
        10,
        10,
        10,
        10,
        1,
        5,
        10
      ),
      new DriverInfo(
        new Driver(1, "AlbertoMD", 18,new Team( 1, "Williams", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        5,
        10,
        10,
        10,
        10,
        10,
        1,
        10,
        10
      )
    ];
    component.driversInfo = driversInfo;

    component.getDataDriversVictories();

    expect(component.dataDriversVictories).toEqual({
      labels: ["Avantifer", "AlbertoMD"],
      datasets: [{
        backgroundColor: ["#358c75", "#37bedd"],
        data: [10, 10]
      }]
    });
  });

  it("should populate dataDriversRacesFinished correctly", () => {
    const driversInfo: DriverInfo[] = [
      new DriverInfo(
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        10,
        10,
        10,
        10,
        10,
        10,
        1,
        5,
        10
      ),
      new DriverInfo(
        new Driver(1, "AlbertoMD", 18,new Team( 1, "Williams", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        5,
        10,
        10,
        10,
        10,
        10,
        1,
        10,
        10
      )
    ];
    component.driversInfo = driversInfo;

    component.getDataDriversRacesFinished();

    expect(component.dataDriversRacesFinished).toEqual({
      labels: ["Avantifer", "AlbertoMD"],
      datasets: [{
        backgroundColor: ["#358c75", "#37bedd"],
        data: [10, 10]
      }]
    });
  });

  it("should populate dataDriversPenalties correctly", () => {
    const driversInfo: DriverInfo[] = [
      new DriverInfo(
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        10,
        10,
        10,
        10,
        10,
        10,
        1,
        5,
        10
      ),
      new DriverInfo(
        new Driver(1, "AlbertoMD", 18,new Team( 1, "Williams", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        5,
        10,
        10,
        10,
        10,
        10,
        1,
        10,
        10
      )
    ];
    component.driversInfo = driversInfo;

    component.getDataDriversPenalties();

    expect(component.dataDriversPenalties).toEqual({
      labels: ["Avantifer", "AlbertoMD"],
      datasets: [{
        backgroundColor: ["#358c75", "#37bedd"],
        data: [10, 10]
      }]
    });
  });

  it("should populate dataDriversTotalPoints correctly", () => {
    const driversInfo: DriverInfo[] = [
      new DriverInfo(
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        10,
        10,
        10,
        10,
        10,
        10,
        1,
        5,
        10
      ),
      new DriverInfo(
        new Driver(1, "AlbertoMD", 18,new Team( 1, "Williams", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        5,
        10,
        10,
        10,
        10,
        10,
        1,
        10,
        10
      )
    ];
    component.driversInfo = driversInfo;

    component.getDataDriversTotalPoints();

    expect(component.dataDriversTotalPoints).toEqual({
      labels: ["Avantifer", "AlbertoMD"],
      datasets: [{
        backgroundColor: ["#358c75", "#37bedd"],
        data: [10, 10]
      }]
    });
  });

  it("should populate dataDriversAveragePoints correctly", () => {
    const driversInfo: DriverInfo[] = [
      new DriverInfo(
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        10,
        10,
        10,
        10,
        10,
        10,
        1,
        5,
        10
      ),
      new DriverInfo(
        new Driver(1, "AlbertoMD", 18,new Team( 1, "Williams", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        5,
        10,
        10,
        10,
        10,
        10,
        1,
        10,
        10
      )
    ];
    component.driversInfo = driversInfo;

    component.getDataDriversAveragePoints();

    expect(component.dataDriversAveragePoints).toEqual({
      labels: ["Avantifer", "AlbertoMD"],
      datasets: [{
        backgroundColor: ["#358c75", "#37bedd"],
        data: [1, 1]
      }]
    });
  });

  it("should populate dataTeamPoles correctly", () => {
    const teamsInfo = [
      new TeamInfo(
        new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        10,
        10,
        10,
        10,
        10,
        10,
        1,
        10,
        10,
        10
      ),
      new TeamInfo(
        new Team(2, "Williams", "", "", new Season(1, "Season 1", 1)),
        10,
        10,
        10,
        10,
        10,
        10,
        1,
        10,
        10,
        10
      )
    ];
    component.teamsInfo = teamsInfo;

    component.getDataTeamsPoles();

    expect(component.dataTeamsPoles).toEqual({
      labels: ["Aston Martin", "Williams"],
      datasets: [{
        backgroundColor: ["#358c75", "#37bedd"],
        data: [10, 10]
      }]
    });
  });

  it("should populate dataTeamPodiums correctly", () => {
    const teamsInfo = [
      new TeamInfo(
        new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        10,
        10,
        10,
        10,
        10,
        10,
        1,
        10,
        10,
        10
      ),
      new TeamInfo(
        new Team(2, "Williams", "", "", new Season(1, "Season 1", 1)),
        10,
        10,
        10,
        10,
        10,
        10,
        1,
        10,
        10,
        10
      )
    ];
    component.teamsInfo = teamsInfo;

    component.getDataTeamsPodiums();

    expect(component.dataTeamsPodiums).toEqual({
      labels: ["Aston Martin", "Williams"],
      datasets: [{
        backgroundColor: ["#358c75", "#37bedd"],
        data: [10, 10]
      }]
    });
  });

  it("should populate dataTeamFastLaps correctly", () => {
    const teamsInfo = [
      new TeamInfo(
        new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        10,
        10,
        10,
        10,
        10,
        10,
        1,
        10,
        10,
        10
      ),
      new TeamInfo(
        new Team(2, "Williams", "", "", new Season(1, "Season 1", 1)),
        10,
        10,
        10,
        10,
        10,
        10,
        1,
        10,
        10,
        10
      )
    ];
    component.teamsInfo = teamsInfo;

    component.getDataTeamsFastLaps();

    expect(component.dataTeamsFastLaps).toEqual({
      labels: ["Aston Martin", "Williams"],
      datasets: [{
        backgroundColor: ["#358c75", "#37bedd"],
        data: [10, 10]
      }]
    });
  });

  it("should populate dataTeamPenalties correctly", () => {
    const teamsInfo = [
      new TeamInfo(
        new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        10,
        10,
        10,
        10,
        10,
        10,
        1,
        10,
        10,
        10
      ),
      new TeamInfo(
        new Team(2, "Williams", "", "", new Season(1, "Season 1", 1)),
        10,
        10,
        10,
        10,
        10,
        10,
        1,
        10,
        10,
        10
      )
    ];
    component.teamsInfo = teamsInfo;

    component.getDataTeamsPenalties();

    expect(component.dataTeamsPenalties).toEqual({
      labels: ["Aston Martin", "Williams"],
      datasets: [{
        backgroundColor: ["#358c75", "#37bedd"],
        data: [1, 1]
      }]
    });
  });

  it("should populate dataTeamVictories correctly", () => {
    const teamsInfo = [
      new TeamInfo(
        new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        10,
        10,
        10,
        10,
        10,
        10,
        1,
        10,
        10,
        10
      ),
      new TeamInfo(
        new Team(2, "Williams", "", "", new Season(1, "Season 1", 1)),
        10,
        10,
        10,
        10,
        10,
        10,
        1,
        10,
        10,
        10
      )
    ];
    component.teamsInfo = teamsInfo;

    component.getDataTeamsVictories();

    expect(component.dataTeamsVictories).toEqual({
      labels: ["Aston Martin", "Williams"],
      datasets: [{
        backgroundColor: ["#358c75", "#37bedd"],
        data: [10, 10]
      }]
    });
  });

  it("should populate dataTeamRacesFinished correctly", () => {
    const teamsInfo = [
      new TeamInfo(
        new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        10,
        10,
        10,
        10,
        10,
        10,
        1,
        10,
        10,
        10
      ),
      new TeamInfo(
        new Team(2, "Williams", "", "", new Season(1, "Season 1", 1)),
        10,
        10,
        10,
        10,
        10,
        10,
        1,
        10,
        10,
        10
      )
    ];
    component.teamsInfo = teamsInfo;

    component.getDataTeamsRacesFinished();

    expect(component.dataTeamsRacesFinished).toEqual({
      labels: ["Aston Martin", "Williams"],
      datasets: [{
        backgroundColor: ["#358c75", "#37bedd"],
        data: [10, 10]
      }]
    });
  });

  it("should populate dataTeamTotalPoints correctly", () => {
    const teamsInfo = [
      new TeamInfo(
        new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        10,
        10,
        10,
        10,
        10,
        10,
        1,
        10,
        10,
        10
      ),
      new TeamInfo(
        new Team(2, "Williams", "", "", new Season(1, "Season 1", 1)),
        10,
        10,
        10,
        10,
        10,
        10,
        1,
        10,
        10,
        10
      )
    ];
    component.teamsInfo = teamsInfo;

    component.getDataTeamsTotalPoints();

    expect(component.dataTeamsTotalPoints).toEqual({
      labels: ["Aston Martin", "Williams"],
      datasets: [{
        backgroundColor: ["#358c75", "#37bedd"],
        data: [10, 10]
      }]
    });
  });

  it("should populate dataTeamAveragePoints correctly", () => {
    const teamsInfo = [
      new TeamInfo(
        new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        10,
        10,
        10,
        10,
        10,
        10,
        1,
        10,
        10,
        10
      ),
      new TeamInfo(
        new Team(2, "Williams", "", "", new Season(1, "Season 1", 1)),
        10,
        10,
        10,
        10,
        10,
        10,
        1,
        10,
        10,
        10
      )
    ];
    component.teamsInfo = teamsInfo;

    component.getDataTeamsAveragePoints();

    expect(component.dataTeamsAveragePoints).toEqual({
      labels: ["Aston Martin", "Williams"],
      datasets: [{
        backgroundColor: ["#358c75", "#37bedd"],
        data: [1, 1]
      }]
    });
  });
});
