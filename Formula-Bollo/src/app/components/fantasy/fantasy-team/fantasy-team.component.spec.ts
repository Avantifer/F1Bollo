import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FantasyTeamComponent } from "./fantasy-team.component";
import { DialogService } from "primeng/dynamicdialog";
import { FantasyApiService } from "src/shared/services/api/fantasy-api.service";
import { RaceApiService } from "src/shared/services/api/race-api.service";
import { AuthJWTService } from "src/shared/services/authJWT.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { DropdownModule } from "primeng/dropdown";
import { IsNanPipe } from "src/shared/pipes/isNan.pipe";
import { SpaceToUnderscorePipe } from "src/shared/pipes/spaceToUnderscore.pipe";
import { Circuit } from "src/shared/models/circuit";
import { Race } from "src/shared/models/race";
import { Season } from "src/shared/models/season";
import { of, throwError } from "rxjs";
import {
  ERROR_DRIVER_FETCH,
  ERROR_FANTASY_DRIVER_IN_TEAM,
  ERROR_FANTASY_ELECTION_SAVE,
  ERROR_FANTASY_TEAM_IN_DRIVER,
  ERROR_POINT_FETCH,
  ERROR_RACE_FETCH,
  ERROR_TEAM_FETCH,
  WARNING_ELECTION_NOT_COMPLETED,
  WARNING_FANTASY_SAVE_LATE,
  WARNING_MONEY_NEGATIVE
} from "src/app/constants";
import { Driver } from "src/shared/models/driver";
import { Team } from "src/shared/models/team";
import { FantasyPriceDriver } from "src/shared/models/fantasyPriceDriver";
import { FantasyInfo } from "src/shared/models/fantasyInfo";
import { FantasyPriceTeam } from "src/shared/models/fantasyPriceTeam";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PricePipe } from "src/shared/pipes/price.pipe";
import { ButtonModule } from "primeng/button";
import { SkeletonModule } from "primeng/skeleton";
import { OrderBy } from "src/shared/models/orderBy";
import { By } from "@angular/platform-browser";
import { FantasyElection } from "src/shared/models/fantasyElection";
import { Account } from "src/shared/models/account";
import { FantasyPointsDriver } from "src/shared/models/fantasyPointsDriver";
import { FantasyPointsTeam } from "src/shared/models/fantasyPointsTeam";
import { FantasyTeamDialogPointComponent } from "./fantasy-team-dialog-point/fantasy-team-dialog-point.component";
import { FantasyTeamDialogPriceComponent } from "./fantasy-team-dialog-price/fantasy-team-dialog-price.component";

describe("FantasyTeamComponent", () => {
  let component: FantasyTeamComponent;
  let fixture: ComponentFixture<FantasyTeamComponent>;
  let raceApiServiceSpy: jasmine.SpyObj<RaceApiService>;
  let messageInfoServiceSpy: jasmine.SpyObj<MessageInfoService>;
  let fantasyApiServiceSpy: jasmine.SpyObj<FantasyApiService>;
  let authJWTServiceSpy: jasmine.SpyObj<AuthJWTService>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;

  beforeEach(async () => {
    raceApiServiceSpy = jasmine.createSpyObj("RaceApiService", ["getAllPreviousAndNextOne"]);
    messageInfoServiceSpy = jasmine.createSpyObj("MessageInfoService", ["showError", "showWarn", "showSuccess"]);
    fantasyApiServiceSpy = jasmine.createSpyObj("FantasyApiService", ["getAllDriverPrices", "getInfoByDriver", "getAllTeamPrices", "getInfoByTeam", "saveFantasyElection", "getFantasyElection", "getDriverPointsSpecificRace", "getTeamsPointsSpecificRace"]);
    authJWTServiceSpy = jasmine.createSpyObj("AuthJWTService", ["getIdFromToken"]);
    dialogServiceSpy = jasmine.createSpyObj("DialogService", ["open"]);

    await TestBed.configureTestingModule({
      declarations: [
        FantasyTeamComponent,
        IsNanPipe,
        SpaceToUnderscorePipe,
        PricePipe
      ],
      imports: [
        DropdownModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        SkeletonModule
      ],
      providers: [
        { provide: RaceApiService, useValue: raceApiServiceSpy },
        { provide: MessageInfoService, useValue: messageInfoServiceSpy },
        { provide: FantasyApiService, useValue: fantasyApiServiceSpy },
        { provide: AuthJWTService, useValue: authJWTServiceSpy },
        { provide: DialogService, useValue: dialogServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FantasyTeamComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call some methods on ngOnInit", () => {
    spyOn(component, "getAllRacesWithDriversAndTeams");
    spyOn(component, "changeRace");
    spyOn(component, "changeDriverFinder");
    spyOn(component, "changeTeamFinder");

    component.ngOnInit();

    expect(component.getAllRacesWithDriversAndTeams).toHaveBeenCalled();
    expect(component.changeRace).toHaveBeenCalled();
    expect(component.changeDriverFinder).toHaveBeenCalled();
    expect(component.changeTeamFinder).toHaveBeenCalled();
  });

  it("should get all races with drivers and teams correctly", () => {
    const races = [
      new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      new Race(2, new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
    ];
    raceApiServiceSpy.getAllPreviousAndNextOne.and.returnValue(of(races));
    spyOn(component, "getAllDrivers");
    spyOn(component, "getFantasyElection");

    component.getAllRacesWithDriversAndTeams();

    expect(component.races).toBe(races);
  });

  it("should thrown an error getting all races with drivers and teams", () => {
    raceApiServiceSpy.getAllPreviousAndNextOne.and.returnValue(throwError(() => ERROR_RACE_FETCH));

    component.getAllRacesWithDriversAndTeams();

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_RACE_FETCH);
  });

  it("should get all drivers correctly", () => {
    component.raceSelected = new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1));

    const drivers = [
      new FantasyPriceDriver(
        0,
        new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        100000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceDriver(
        0,
        new Driver(1, "AlbertoMD", 22, new Team(1, "Williams", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        100000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceDriver(
        0,
        new Driver(1, "Bubapu", 1, new Team(1, "Ferrari", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        100000,
        new Season(1, "Season 1", 1)
      ),
    ];
    const driversExpected = [
      new FantasyPriceDriver(
        0,
        new Driver(1, "AlbertoMD", 22, new Team(1, "Williams", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        100000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceDriver(
        0,
        new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        100000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceDriver(
        0,
        new Driver(1, "Bubapu", 1, new Team(1, "Ferrari", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        100000,
        new Season(1, "Season 1", 1)
      ),
    ];
    fantasyApiServiceSpy.getAllDriverPrices.and.returnValue(of(drivers));
    spyOn(component, "getAllTeams");
    spyOn(component, "getInfoDriver");

    component.getAllDrivers(1);

    expect(component.drivers[0].driver).toEqual(driversExpected[0].driver);
  });

  it("should thrown an error getting all drivers", () => {
    fantasyApiServiceSpy.getAllDriverPrices.and.returnValue(throwError(() => ERROR_DRIVER_FETCH));

    component.getAllDrivers(1);

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_DRIVER_FETCH);
  });

  it("should get driver info correctly", () => {
    const drivers = [
      new FantasyPriceDriver(
        1,
        new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        100000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceDriver(
        2,
        new Driver(1, "AlbertoMD", 22, new Team(1, "Williams", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        100000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceDriver(
        3,
        new Driver(1, "Bubapu", 1, new Team(1, "Ferrari", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        100000,
        new Season(1, "Season 1", 1)
      ),
    ];
    component.drivers = drivers;
    const fantasyInfo = new FantasyInfo(10, 10);
    fantasyApiServiceSpy.getInfoByDriver.and.returnValue(of(fantasyInfo));

    component.getInfoDriver(drivers[0], 0);

    expect(drivers[0].totalPoints).toBe(10);
    expect(drivers[0].differencePrice).toBe(10);

    component.races = [
      new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      new Race(1, new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1))
    ];

    component.getInfoDriver(drivers[0], 0);

    expect(drivers[0].totalPoints).toBe(10);
    expect(drivers[0].differencePrice).toBe(10);
  });

  it("should thrown an error getting driver info", () => {
    const driver = new FantasyPriceDriver(
      1,
      new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
      new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      100000,
      new Season(1, "Season 1", 1)
    );
    fantasyApiServiceSpy.getInfoByDriver.and.returnValue(throwError(() => ERROR_DRIVER_FETCH));

    component.getInfoDriver(driver, 0);

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_DRIVER_FETCH);
  });

  it("should get all teams correctly", () => {
    const teams = [
      new FantasyPriceTeam(
        0,
        new Team(0, "Ferrari", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceTeam(
        0,
        new Team(0, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceTeam(
        0,
        new Team(0, "Williams", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      ),
    ];
    fantasyApiServiceSpy.getAllTeamPrices.and.returnValue(of(teams));
    spyOn(component, "getInfoTeam");
    spyOn(component, "calculateTotalPrice");

    component.getAllTeams(1);

    expect(component.teams[0].team).toEqual(teams[1].team);
  });

  it("should thrown an error getting all teams", () => {
    fantasyApiServiceSpy.getAllTeamPrices.and.returnValue(throwError(() => ERROR_TEAM_FETCH));

    component.getAllTeams(1);

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_TEAM_FETCH);
  });

  it("should get team info correctly", () => {
    const teams = [
      new FantasyPriceTeam(
        0,
        new Team(0, "Ferrari", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceTeam(
        0,
        new Team(0, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceTeam(
        0,
        new Team(0, "Williams", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      ),
    ];
    component.teams = teams;
    const fantasyInfo = new FantasyInfo(10, 10);
    fantasyApiServiceSpy.getInfoByTeam.and.returnValue(of(fantasyInfo));

    component.getInfoTeam(teams[0], 0);

    expect(teams[0].totalPoints).toBe(10);
    expect(teams[0].differencePrice).toBe(10);

    component.races = [
      new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      new Race(1, new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1))
    ];

    component.getInfoTeam(teams[0], 0);

    expect(teams[0].totalPoints).toBe(10);
    expect(teams[0].differencePrice).toBe(10);
  });

  it("should thrown an error getting driver info", () => {
    const team = new FantasyPriceTeam(
      0,
      new Team(0, "Ferrari", "", "", new Season(1, "Season 1", 1)),
      new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      1000,
      new Season(1, "Season 1", 1)
    );
    fantasyApiServiceSpy.getInfoByTeam.and.returnValue(throwError(() => ERROR_TEAM_FETCH));

    component.getInfoTeam(team, 0);

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_TEAM_FETCH);
  });

  it("should not change race when raceSelected is undefined", () => {
    const race = new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1));
    component.raceSelected = undefined;
    spyOn(component, "getFantasyElection");

    component.changeRace();
    component.raceForm.setValue({ "race" : race });

    expect(component.getFantasyElection).not.toHaveBeenCalled();
  });

  it("should change race correctly", () =>  {
    const race = new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1));
    component.raceSelected = new Race(2, new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1));
    spyOn(component, "getFantasyElection");
    spyOn(component, "getAllDrivers");
    spyOn(component, "getAllTeams");

    component.changeRace();
    component.raceForm.setValue({ "race" : race });

    expect(component.raceSelected.circuit).toBe(race.circuit);
  });

  it("should remove the selected class from the previously selected element", () => {
    const previousElement = document.createElement("div");
    previousElement.classList.add("fantasySelection-mid-table-top-option", "selected");
    document.body.appendChild(previousElement);

    component.changeOptionSelected(null);
    expect(previousElement.classList.contains("selected")).toBeDefined();

    document.body.removeChild(previousElement);
  });

  it("should add the selected class to the newly selected element", () => {
    const newElement = document.createElement("div");
    newElement.classList.add("fantasySelection-mid-table-top-option");
    const child = document.createElement("div");
    child.innerHTML = "New Option";
    newElement.appendChild(child);
    document.body.appendChild(newElement);

    component.changeOptionSelected(newElement);
    expect(newElement.classList.contains("selected")).toBeTrue();

    document.body.removeChild(newElement);
  });

  it("should add selected class to the driver1 element", () => {
    component.optionSelected = "Pilotos";
    component.fantasyElection.driverOne = undefined;
    spyOn(component, "getAllRacesWithDriversAndTeams");

    component.changeOptionFormSelected();
    fixture.detectChanges();

    const driver1Element = fixture.nativeElement.querySelector(".driver1");
    expect(driver1Element.classList.contains("selected")).toBeDefined();
  });

  it("should add selected class to the driver2 element", () => {
    component.optionSelected = "Pilotos";
    component.fantasyElection.driverOne = new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1));
    spyOn(component, "getAllRacesWithDriversAndTeams");

    component.changeOptionFormSelected();
    fixture.detectChanges();

    const driver2Element = fixture.nativeElement.querySelector(".driver2");
    expect(driver2Element.classList.contains("selected")).toBeDefined();
  });

  it("should add selected class to the driver3 element", () => {
    component.optionSelected = "Pilotos";
    component.fantasyElection.driverOne = new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1));
    component.fantasyElection.driverTwo = new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1));
    spyOn(component, "getAllRacesWithDriversAndTeams");

    component.changeOptionFormSelected();
    fixture.detectChanges();

    const driver3Element = fixture.nativeElement.querySelector(".driver3");
    expect(driver3Element.classList.contains("selected")).toBeDefined();
  });

  it("should add selected class to the team1 element", () => {
    component.optionSelected = "Equipos";
    component.fantasyElection.teamOne = undefined;
    spyOn(component, "getAllRacesWithDriversAndTeams");

    component.changeOptionFormSelected();
    fixture.detectChanges();

    const team1Element = fixture.nativeElement.querySelector(".team1");
    expect(team1Element.classList.contains("selected")).toBeDefined();
  });

  it("should add selected class to the team2 element", () => {
    component.optionSelected = "Equipos";
    component.fantasyElection.teamOne = new Team(1, "Ferrari", "", "", new Season(1, "Season 1", 1));
    spyOn(component, "getAllRacesWithDriversAndTeams");

    component.changeOptionFormSelected();
    fixture.detectChanges();

    const team2Element = fixture.nativeElement.querySelector(".team2");
    expect(team2Element.classList.contains("selected")).toBeDefined();
  });

  it("should change driver finder correctly", () => {
    const drivers = [
      new FantasyPriceDriver(
        1,
        new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        100000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceDriver(
        2,
        new Driver(1, "AlbertoMD", 22, new Team(1, "Williams", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        100000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceDriver(
        3,
        new Driver(1, "Bubapu", 1, new Team(1, "Ferrari", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        100000,
        new Season(1, "Season 1", 1)
      ),
    ];
    component.drivers = drivers;

    component.changeDriverFinder();
    component.driverFinderForm.setValue({ finder: "Avan" });

    expect(component.driversList[0]).toBe(drivers[0]);
  });

  it("should change team finder correctly", () => {
    const teams = [
      new FantasyPriceTeam(
        0,
        new Team(0, "Ferrari", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceTeam(
        0,
        new Team(0, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      )
    ];
    component.teams = teams;

    component.changeTeamFinder();
    component.teamFinderForm.setValue({ finder: "Ferr" });

    expect(component.teamsList[0]).toBe(teams[0]);
  });

  it("should changeOrder nombre pilotos ASC correctly", () => {
    const drivers = [
      new FantasyPriceDriver(
        1,
        new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        100000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceDriver(
        2,
        new Driver(1, "AlbertoMD", 22, new Team(1, "Williams", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        100000,
        new Season(1, "Season 1", 1)
      )
    ];
    const driversExpected = [
      new FantasyPriceDriver(
        1,
        new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        100000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceDriver(
        2,
        new Driver(1, "AlbertoMD", 22, new Team(1, "Williams", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        100000,
        new Season(1, "Season 1", 1)
      )
    ];
    component.driversList = drivers;
    component.optionSelected = "Pilotos";
    const orderBy = new OrderBy("Nombre", "ASC");

    component.changeOrder(orderBy);

    expect(component.driversList[0].driver).toEqual(driversExpected[0].driver);
  });

  it("should changeOrder nombre pilotos DESC correctly", () => {
    const drivers = [
      new FantasyPriceDriver(
        1,
        new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        100000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceDriver(
        2,
        new Driver(1, "AlbertoMD", 22, new Team(1, "Williams", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        100000,
        new Season(1, "Season 1", 1)
      )
    ];
    const driversExpected = [
      new FantasyPriceDriver(
        2,
        new Driver(1, "AlbertoMD", 22, new Team(1, "Williams", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        100000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceDriver(
        1,
        new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        100000,
        new Season(1, "Season 1", 1)
      )
    ];
    component.driversList = drivers;
    component.optionSelected = "Pilotos";
    const orderBy = new OrderBy("Nombre", "DESC");

    component.changeOrder(orderBy);

    expect(component.driversList[0].driver).toEqual(driversExpected[0].driver);
  });

  it("should changeOrder nombre equipo ASC correctly", () => {
    const teams = [
      new FantasyPriceTeam(
        0,
        new Team(0, "Ferrari", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceTeam(
        0,
        new Team(0, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      )
    ];
    const teamsExpected = [
      new FantasyPriceTeam(
        0,
        new Team(0, "Ferrari", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceTeam(
        0,
        new Team(0, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      )
    ];
    component.teamsList = teams;
    component.optionSelected = "Equipos";
    const orderBy = new OrderBy("Nombre", "ASC");

    component.changeOrder(orderBy);

    expect(component.teamsList[0].team).toEqual(teamsExpected[0].team);
  });

  it("should changeOrder nombre equipo DESC correctly", () => {
    const teams = [
      new FantasyPriceTeam(
        0,
        new Team(0, "Ferrari", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceTeam(
        0,
        new Team(0, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      )
    ];
    const teamsExpected = [
      new FantasyPriceTeam(
        0,
        new Team(0, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceTeam(
        0,
        new Team(0, "Ferrari", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      )
    ];
    component.teamsList = teams;
    component.optionSelected = "Equipos";
    const orderBy = new OrderBy("Nombre", "DESC");

    component.changeOrder(orderBy);

    expect(component.teamsList[0].team).toEqual(teamsExpected[0].team);
  });

  it("should changeOrder price piloto ASC correctly", () => {
    const drivers = [
      new FantasyPriceDriver(
        1,
        new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceDriver(
        2,
        new Driver(1, "AlbertoMD", 22, new Team(1, "Williams", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        99999,
        new Season(1, "Season 1", 1)
      )
    ];
    const driversExpected = [
      new FantasyPriceDriver(
        2,
        new Driver(1, "AlbertoMD", 22, new Team(1, "Williams", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        99999,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceDriver(
        1,
        new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      )
    ];
    component.driversList = drivers;
    component.optionSelected = "Pilotos";
    const orderBy = new OrderBy("Precio", "ASC");

    component.changeOrder(orderBy);

    expect(component.driversList[0].driver).toEqual(driversExpected[0].driver);
  });

  it("should changeOrder price piloto DESC correctly", () => {
    const drivers = [
      new FantasyPriceDriver(
        1,
        new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceDriver(
        2,
        new Driver(1, "AlbertoMD", 22, new Team(1, "Williams", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        99999,
        new Season(1, "Season 1", 1)
      )
    ];
    const driversExpected = [
      new FantasyPriceDriver(
        1,
        new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceDriver(
        2,
        new Driver(1, "AlbertoMD", 22, new Team(1, "Williams", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        99999,
        new Season(1, "Season 1", 1)
      )
    ];
    component.driversList = drivers;
    component.optionSelected = "Pilotos";
    const orderBy = new OrderBy("Precio", "DESC");

    component.changeOrder(orderBy);

    expect(component.driversList[0].driver).toEqual(driversExpected[0].driver);
  });

  it("should changeOrder price equipo ASC correctly", () => {
    const teams = [
      new FantasyPriceTeam(
        0,
        new Team(0, "Ferrari", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        99999,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceTeam(
        0,
        new Team(0, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      )
    ];
    const teamsExpected = [
      new FantasyPriceTeam(
        0,
        new Team(0, "Ferrari", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        99999,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceTeam(
        0,
        new Team(0, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      )
    ];
    component.teamsList = teams;
    component.optionSelected = "Equipos";
    const orderBy = new OrderBy("Precio", "ASC");

    component.changeOrder(orderBy);

    expect(component.teamsList[0].team).toEqual(teamsExpected[0].team);
  });

  it("should changeOrder price equipo DESC correctly", () => {
    const teams = [
      new FantasyPriceTeam(
        0,
        new Team(0, "Ferrari", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        99999,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceTeam(
        0,
        new Team(0, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      )
    ];
    const teamsExpected = [
      new FantasyPriceTeam(
        0,
        new Team(0, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1),
      ),
      new FantasyPriceTeam(
        0,
        new Team(0, "Ferrari", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        99999,
        new Season(1, "Season 1", 1)
      )
    ];
    component.teamsList = teams;
    component.optionSelected = "Equipos";
    const orderBy = new OrderBy("Precio", "DESC");

    component.changeOrder(orderBy);

    expect(component.teamsList[0].team).toEqual(teamsExpected[0].team);
  });

  it("should changeOrder puntos totales piloto ASC correctly", () => {
    const drivers = [
      new FantasyPriceDriver(
        1,
        new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceDriver(
        2,
        new Driver(1, "AlbertoMD", 22, new Team(1, "Williams", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        99999,
        new Season(1, "Season 1", 1)
      )
    ];
    drivers[0].totalPoints = 10;
    drivers[1].totalPoints = 20;
    const driversExpected = [
      new FantasyPriceDriver(
        2,
        new Driver(1, "AlbertoMD", 22, new Team(1, "Williams", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        99999,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceDriver(
        1,
        new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      ),
    ];
    component.driversList = drivers;
    component.optionSelected = "Pilotos";
    const orderBy = new OrderBy("Puntos totales", "ASC");

    component.changeOrder(orderBy);

    expect(component.driversList[0].driver).toEqual(driversExpected[0].driver);
  });

  it("should changeOrder puntos totales piloto DESC correctly", () => {
    const drivers = [
      new FantasyPriceDriver(
        1,
        new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceDriver(
        2,
        new Driver(1, "AlbertoMD", 22, new Team(1, "Williams", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        99999,
        new Season(1, "Season 1", 1)
      )
    ];
    drivers[0].totalPoints = 10;
    drivers[1].totalPoints = 20;
    const driversExpected = [
      new FantasyPriceDriver(
        1,
        new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceDriver(
        2,
        new Driver(1, "AlbertoMD", 22, new Team(1, "Williams", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        99999,
        new Season(1, "Season 1", 1)
      )
    ];
    component.driversList = drivers;
    component.optionSelected = "Pilotos";
    const orderBy = new OrderBy("Puntos totales", "DESC");

    component.changeOrder(orderBy);

    expect(component.driversList[0].driver).toEqual(driversExpected[0].driver);
  });

  it("should changeOrder puntos totales equipo ASC correctly", () => {
    const teams = [
      new FantasyPriceTeam(
        0,
        new Team(0, "Ferrari", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        99999,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceTeam(
        0,
        new Team(0, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      )
    ];
    teams[0].totalPoints = 10;
    teams[1].totalPoints = 20;
    const teamsExpected = [
      new FantasyPriceTeam(
        0,
        new Team(0, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceTeam(
        0,
        new Team(0, "Ferrari", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        99999,
        new Season(1, "Season 1", 1)
      )
    ];
    component.teamsList = teams;
    component.optionSelected = "Equipos";
    const orderBy = new OrderBy("Puntos totales", "ASC");

    component.changeOrder(orderBy);

    expect(component.teamsList[0].team).toEqual(teamsExpected[0].team);
  });

  it("should changeOrder puntos totales equipo DESC correctly", () => {
    const teams = [
      new FantasyPriceTeam(
        0,
        new Team(0, "Ferrari", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        99999,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceTeam(
        0,
        new Team(0, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      )
    ];
    teams[0].totalPoints = 10;
    teams[1].totalPoints = 20;
    const teamsExpected = [
      new FantasyPriceTeam(
        0,
        new Team(0, "Ferrari", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        99999,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceTeam(
        0,
        new Team(0, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1),
      )
    ];
    component.teamsList = teams;
    component.optionSelected = "Equipos";
    const orderBy = new OrderBy("Puntos totales", "DESC");

    component.changeOrder(orderBy);

    expect(component.teamsList[0].team).toEqual(teamsExpected[0].team);
  });

  it("should changeOrder media de puntos piloto ASC correctly", () => {
    const drivers = [
      new FantasyPriceDriver(
        1,
        new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceDriver(
        2,
        new Driver(1, "AlbertoMD", 22, new Team(1, "Williams", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        99999,
        new Season(1, "Season 1", 1)
      )
    ];
    drivers[0].averagePoints = 10;
    drivers[1].averagePoints = 20;
    const driversExpected = [
      new FantasyPriceDriver(
        2,
        new Driver(1, "AlbertoMD", 22, new Team(1, "Williams", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        99999,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceDriver(
        1,
        new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      ),
    ];
    component.driversList = drivers;
    component.optionSelected = "Pilotos";
    const orderBy = new OrderBy("Media puntos", "ASC");

    component.changeOrder(orderBy);

    expect(component.driversList[0].driver).toEqual(driversExpected[0].driver);
  });

  it("should changeOrder media de puntos piloto DESC correctly", () => {
    const drivers = [
      new FantasyPriceDriver(
        1,
        new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceDriver(
        2,
        new Driver(1, "AlbertoMD", 22, new Team(1, "Williams", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        99999,
        new Season(1, "Season 1", 1)
      )
    ];
    drivers[0].averagePoints = 10;
    drivers[1].averagePoints = 20;
    const driversExpected = [
      new FantasyPriceDriver(
        1,
        new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceDriver(
        2,
        new Driver(1, "AlbertoMD", 22, new Team(1, "Williams", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        99999,
        new Season(1, "Season 1", 1)
      )
    ];
    component.driversList = drivers;
    component.optionSelected = "Pilotos";
    const orderBy = new OrderBy("Media puntos", "DESC");

    component.changeOrder(orderBy);

    expect(component.driversList[0].driver).toEqual(driversExpected[0].driver);
  });

  it("should changeOrder media de puntos equipo ASC correctly", () => {
    const teams = [
      new FantasyPriceTeam(
        0,
        new Team(0, "Ferrari", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        99999,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceTeam(
        0,
        new Team(0, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      )
    ];
    teams[0].averagePoints = 10;
    teams[1].averagePoints = 20;
    const teamsExpected = [
      new FantasyPriceTeam(
        0,
        new Team(0, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceTeam(
        0,
        new Team(0, "Ferrari", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        99999,
        new Season(1, "Season 1", 1)
      )
    ];
    component.teamsList = teams;
    component.optionSelected = "Equipos";
    const orderBy = new OrderBy("Media puntos", "ASC");

    component.changeOrder(orderBy);

    expect(component.teamsList[0].team).toEqual(teamsExpected[0].team);
  });

  it("should changeOrder price equipo DESC correctly", () => {
    const teams = [
      new FantasyPriceTeam(
        0,
        new Team(0, "Ferrari", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        99999,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceTeam(
        0,
        new Team(0, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1)
      )
    ];
    teams[0].averagePoints = 10;
    teams[1].averagePoints = 20;
    const teamsExpected = [
      new FantasyPriceTeam(
        0,
        new Team(0, "Ferrari", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        99999,
        new Season(1, "Season 1", 1)
      ),
      new FantasyPriceTeam(
        0,
        new Team(0, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        1000,
        new Season(1, "Season 1", 1),
      )
    ];
    component.teamsList = teams;
    component.optionSelected = "Equipos";
    const orderBy = new OrderBy("Media puntos", "DESC");

    component.changeOrder(orderBy);

    expect(component.teamsList[0].team).toEqual(teamsExpected[0].team);
  });

  it("should not change driver team selected if event is null", () => {
    spyOn(component, "comprobateOptionFantasySelection");

    component.changeDriverTeamSelected(null);

    expect(component.comprobateOptionFantasySelection).not.toHaveBeenCalled();
  });

  it("should remove selected class from previous element and add it to the new one", () => {
    const previousElement = document.createElement("div");
    previousElement.className = "fantasySelection-optionForm selected";
    document.body.appendChild(previousElement);
    const newElement = document.createElement("div");
    newElement.className = "fantasySelection-optionForm";
    document.body.appendChild(newElement);

    component.changeDriverTeamSelected(newElement);

    expect(newElement.classList.contains("selected")).toBe(true);
  });

  it("should return early when optionFormSelected is null", () => {
    document.body.innerHTML = "";
    spyOn(component, "changeOptionSelected");
    const element = document.createElement("div");
    element.className = "fantasySelection-optionForm";
    document.body.appendChild(element);

    component.comprobateOptionFantasySelection();

    expect(component.changeOptionSelected).not.toHaveBeenCalled();
  });

  it("should set optionSelected to Pilotos when optionFormSelected contains driver", () => {
    document.body.innerHTML = "";
    component.optionSelected = "Pilotos";
    const element = document.createElement("div");
    element.className = "fantasySelection-optionForm driver selected";
    const element2 = document.createElement("div");
    element2.className = "fantasySelection-mid-table-top-option";
    const paragraph = document.createElement("p");
    paragraph.innerHTML = "Pilotos";
    element2.appendChild(paragraph);
    document.body.appendChild(element);
    document.body.appendChild(element2);

    component.comprobateOptionFantasySelection();

    expect(component.optionSelected).toBe("Pilotos");
  });

  it("should set optionSelected to Pilotos when optionFormSelected contains driver", () => {
    document.body.innerHTML = "";
    const element = document.createElement("div");
    element.className = "fantasySelection-optionForm team selected";
    document.body.appendChild(element);

    component.comprobateOptionFantasySelection();

    expect(component.optionSelected).toBe("Equipos");
  });

  it("should not add driver to selection if optionFormSelected is null", () => {
    document.body.innerHTML = "";
    const driver = new FantasyPriceDriver(
      0,
      new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
      new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      100000,
      new Season(1, "Season 1", 1)
    );
    spyOn(component, "comprobateOptionFantasySelection");

    component.addDriverToSelection(driver);

    expect(component.comprobateOptionFantasySelection).not.toHaveBeenCalled();
  });

  it("should add driver to selection correctly", () => {
    document.body.innerHTML = "";
    const driver = new FantasyPriceDriver(
      0,
      new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
      new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      100000,
      new Season(1, "Season 1", 1)
    );
    const element = document.createElement("div");
    element.className = "fantasySelection-optionForm driver1 selected";
    document.body.appendChild(element);
    spyOn(component, "comprobateOptionFantasySelection");
    spyOn(component, "setOrderDriver");
    spyOn(component, "putDriverSelected");

    component.addDriverToSelection(driver);

    expect(component.comprobateOptionFantasySelection).toHaveBeenCalled();
  });

  it("should thrown an error setting order driver", () => {
    document.body.innerHTML = "";
    const element = document.createElement("div");
    element.className = "fantasySelection-optionForm team1 selected";
    document.body.appendChild(element);
    const driver = new FantasyPriceDriver(
      0,
      new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
      new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      100000,
      new Season(1, "Season 1", 1)
    );

    component.setOrderDriver(driver, element);

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_FANTASY_DRIVER_IN_TEAM);
  });

  it("should set order driver in driver1 correctly", () => {
    document.body.innerHTML = "";
    const element = document.createElement("div");
    element.className = "fantasySelection-optionForm driver1 selected";
    document.body.appendChild(element);
    component.drivers = [
      new FantasyPriceDriver(
        0,
        new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        100000,
        new Season(1, "Season 1", 1)
      )
    ];
    const driver = new FantasyPriceDriver(
      0,
      new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
      new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      100000,
      new Season(1, "Season 1", 1)
    );

    component.setOrderDriver(driver, element);

    expect(component.fantasyElection.driverOne).toBe(driver.driver);
  });

  it("should set order driver in driver2 correctly", () => {
    document.body.innerHTML = "";
    const element = document.createElement("div");
    element.className = "fantasySelection-optionForm driver2 selected";
    document.body.appendChild(element);
    component.drivers = [
      new FantasyPriceDriver(
        0,
        new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        100000,
        new Season(1, "Season 1", 1)
      )
    ];
    const driver = new FantasyPriceDriver(
      0,
      new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
      new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      100000,
      new Season(1, "Season 1", 1)
    );

    component.setOrderDriver(driver, element);

    expect(component.fantasyElection.driverTwo).toBe(driver.driver);
  });

  it("should set order driver in driver3 correctly", () => {
    document.body.innerHTML = "";
    const element = document.createElement("div");
    element.className = "fantasySelection-optionForm driver3 selected";
    document.body.appendChild(element);
    component.drivers = [
      new FantasyPriceDriver(
        0,
        new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        100000,
        new Season(1, "Season 1", 1)
      )
    ];
    const driver = new FantasyPriceDriver(
      0,
      new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
      new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      100000,
      new Season(1, "Season 1", 1)
    );

    component.setOrderDriver(driver, element);

    expect(component.fantasyElection.driverThree).toBe(driver.driver);
  });

  it("should select first driver when no driver is selected", () => {
    const element = fixture.debugElement.query(By.css(".driver1")).nativeElement;
    spyOn(component, "getAllRacesWithDriversAndTeams");

    component.putDriverSelected(element);
    fixture.detectChanges();

    expect(element.classList).toContain("selected");
  });

  it("should select second driver when driverOne is selected", () => {
    component.fantasyElection.driverOne = new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1));
    const element = fixture.debugElement.query(By.css(".driver2")).nativeElement;
    spyOn(component, "getAllRacesWithDriversAndTeams");

    component.putDriverSelected(element);
    fixture.detectChanges();

    expect(element.classList).toContain("selected");
  });

  it("should select third driver when driverTwo is selected", () => {
    component.fantasyElection.driverOne = new Driver(1, "Avantifer", 18,new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1));
    component.fantasyElection.driverTwo = new Driver(2, "AlbertoMD", 18,new Team(2, "Williams", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1));
    const element = fixture.debugElement.query(By.css(".driver3")).nativeElement;
    spyOn(component, "getAllRacesWithDriversAndTeams");

    component.putDriverSelected(element);
    fixture.detectChanges();

    expect(element.classList).toContain("selected");
  });

  it("should select first team when driverThree is selected", () => {
    component.fantasyElection.driverOne = new Driver(1, "Avantifer", 18,new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1));
    component.fantasyElection.driverTwo = new Driver(2, "AlbertoMD", 18,new Team(2, "Williams", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1));
    component.fantasyElection.driverThree = new Driver(3, "Bubapu", 18,new Team(3, "Ferrari", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1));
    component.fantasyElection.teamOne = undefined;
    const element = fixture.debugElement.query(By.css(".team1")).nativeElement;
    spyOn(component, "getAllRacesWithDriversAndTeams");

    component.putDriverSelected(element);
    fixture.detectChanges();

    expect(element.classList).toContain("selected");
  });

  it("should select second team when teamOne is selected and update optionSelected elements", () => {
    component.fantasyElection.driverOne = new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1));
    component.fantasyElection.driverTwo = new Driver(2, "AlbertoMD", 18, new Team(2, "Williams", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1));
    component.fantasyElection.driverThree = new Driver(3, "Bubapu", 18, new Team(3, "Ferrari", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1));
    component.fantasyElection.teamOne = new Team(3, "Ferrari", "", "", new Season(1, "Season 1", 1));
    component.optionSelected = "Equipos";
    const element = fixture.debugElement.query(By.css(".team2")).nativeElement;
    spyOn(component, "getAllRacesWithDriversAndTeams");

    component.putDriverSelected(element);
    fixture.detectChanges();

    expect(element.classList).toContain("selected");
  });

  it("should not add team to selection when optionFormSeleceted is null", () => {
    document.body.innerHTML = "";
    const team = new FantasyPriceTeam(
      0,
      new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
      new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      100000,
      new Season(1, "Season 1", 1)
    );
    spyOn(component, "setOrderTeam");

    component.addTeamToSelection(team);

    expect(component.setOrderTeam).not.toHaveBeenCalled();
  });

  it("should add team to selection correctly", () => {
    document.body.innerHTML = "";
    const previousElement = document.createElement("div");
    previousElement.className = "fantasySelection-optionForm selected";
    const team = new FantasyPriceTeam(
      0,
      new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
      new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      100000,
      new Season(1, "Season 1", 1)
    );
    document.body.appendChild(previousElement);
    spyOn(component, "setOrderTeam");
    spyOn(component, "putTeamSelected");

    component.addTeamToSelection(team);

    expect(previousElement.classList.contains("selected")).toBe(false);
  });


  it("should thrown an error setting order driver", () => {
    document.body.innerHTML = "";
    const element = document.createElement("div");
    element.className = "fantasySelection-optionForm driver selected";
    document.body.appendChild(element);
    const team = new FantasyPriceTeam(
      0,
      new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
      new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      100000,
      new Season(1, "Season 1", 1)
    );

    component.setOrderTeam(team, element);

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_FANTASY_TEAM_IN_DRIVER);
  });

  it("should set order team in team1 correctly", () => {
    document.body.innerHTML = "";
    const element = document.createElement("div");
    element.className = "fantasySelection-optionForm team1 selected";
    document.body.appendChild(element);
    component.teams = [
      new FantasyPriceTeam(
        0,
        new Team(3, "Ferrari", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        100000,
        new Season(1, "Season 1", 1)
      )
    ];
    const team = new FantasyPriceTeam(
      0,
      new Team(3, "Ferrari", "", "", new Season(1, "Season 1", 1)),
      new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      100000,
      new Season(1, "Season 1", 1)
    );

    component.setOrderTeam(team, element);

    expect(component.fantasyElection.teamOne).toBe(team.team);
  });

  it("should set order driver in team2 correctly", () => {
    document.body.innerHTML = "";
    const element = document.createElement("div");
    element.className = "fantasySelection-optionForm team2 selected";
    document.body.appendChild(element);
    component.teams = [
      new FantasyPriceTeam(
        0,
        new Team(3, "Ferrari", "", "", new Season(1, "Season 1", 1)),
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        100000,
        new Season(1, "Season 1", 1)
      )
    ];
    const team = new FantasyPriceTeam(
      0,
      new Team(3, "Ferrari", "", "", new Season(1, "Season 1", 1)),
      new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      100000,
      new Season(1, "Season 1", 1)
    );

    component.setOrderTeam(team, element);

    expect(component.fantasyElection.teamTwo).toBe(team.team);
  });

  it("should select first team", () => {
    component.fantasyElection.teamOne = undefined;
    component.optionSelected = "Equipos";
    const element = fixture.debugElement.query(By.css(".team1")).nativeElement;
    spyOn(component, "getAllRacesWithDriversAndTeams");

    component.putTeamSelected(element);
    fixture.detectChanges();

    expect(element.classList).toContain("selected");
  });

  it("should select second team when teamOne is defined", () => {
    component.fantasyElection.teamOne = new Team(3, "Ferrari", "", "", new Season(1, "Season 1", 1));
    component.optionSelected = "Equipos";
    const element = fixture.debugElement.query(By.css(".team2")).nativeElement;
    spyOn(component, "getAllRacesWithDriversAndTeams");

    component.putTeamSelected(element);
    fixture.detectChanges();

    expect(element.classList).toContain("selected");
  });

  it("should return true when comprobate if driver is selected", () => {
    const driver = new FantasyPriceDriver(
      0,
      new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
      new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      100000,
      new Season(1, "Season 1", 1)
    );

    const notSelected = component.comprobateIfDriverIsElected(driver);

    expect(notSelected).toBe(true);
  });

  it("should return false when comprobate if driver is selected", () => {
    const driver = new FantasyPriceDriver(
      0,
      new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
      new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      100000,
      new Season(1, "Season 1", 1)
    );
    component.fantasyElection.driverOne = driver.driver;

    const notSelected = component.comprobateIfDriverIsElected(driver);

    expect(notSelected).toBe(false);
  });

  it("should return true when comprobate if team is selected", () => {
    const team = new FantasyPriceTeam(
      0,
      new Team(3, "Ferrari", "", "", new Season(1, "Season 1", 1)),
      new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      100000,
      new Season(1, "Season 1", 1)
    );

    const notSelected = component.comprobateIfTeamIsElected(team);

    expect(notSelected).toBe(true);
  });

  it("should return false when comprobate if team is selected", () => {
    const team = new FantasyPriceTeam(
      0,
      new Team(3, "Ferrari", "", "", new Season(1, "Season 1", 1)),
      new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      100000,
      new Season(1, "Season 1", 1)
    );
    component.fantasyElection.teamOne = team.team;

    const notSelected = component.comprobateIfTeamIsElected(team);

    expect(notSelected).toBe(false);
  });

  it("should return if event is null", () => {
    spyOn(component, "deleteDriverOfTheSelection");
    spyOn(component, "deleteDriverTeamBackground");

    component.removeDriverSelected(null);

    expect(component.deleteDriverOfTheSelection).not.toHaveBeenCalled();
    expect(component.deleteDriverTeamBackground).not.toHaveBeenCalled();
  });

  it("should call deleteDriverOfTheSelection and deleteDriverTeamBackground with the element", () => {
    const element = document.createElement("div");
    spyOn(component, "deleteDriverOfTheSelection");
    spyOn(component, "deleteDriverTeamBackground");
    component.removeDriverSelected(element);
    expect(component.deleteDriverOfTheSelection).toHaveBeenCalledWith(element);
    expect(component.deleteDriverTeamBackground).toHaveBeenCalledWith(element);
  });

  it("should update optionSelected and call related methods if input class includes driver1", () => {
    const element = document.createElement("div");
    const parentElement = document.createElement("div");
    const nextElementSibling = document.createElement("input");
    nextElementSibling.classList.add("fantasySelection-optionForm", "driver1");
    parentElement.appendChild(element);
    document.body.appendChild(parentElement);
    document.body.appendChild(nextElementSibling);
    spyOn(component, "changeOptionSelected");
    spyOn(component, "setOptionSelected");

    component.removeDriverSelected(element);

    expect(component.optionSelected).toBe("Pilotos");
    expect(component.changeOptionSelected).toHaveBeenCalledWith(null);
    expect(component.setOptionSelected).toHaveBeenCalled();
  });

  it("should update optionSelected and call related methods if input class includes driver2", () => {
    const element = document.createElement("div");
    const parentElement = document.createElement("div");
    const nextElementSibling = document.createElement("input");
    nextElementSibling.classList.add("fantasySelection-optionForm", "driver2");
    parentElement.appendChild(element);
    document.body.appendChild(parentElement);
    document.body.appendChild(nextElementSibling);
    spyOn(component, "changeOptionSelected");
    spyOn(component, "setOptionSelected");

    component.removeDriverSelected(element);

    expect(component.optionSelected).toBe("Pilotos");
    expect(component.changeOptionSelected).toHaveBeenCalledWith(null);
    expect(component.setOptionSelected).toHaveBeenCalled();
  });

  it("should update optionSelected and call related methods if input class includes driver3", () => {
    const element = document.createElement("div");
    const parentElement = document.createElement("div");
    const nextElementSibling = document.createElement("input");
    nextElementSibling.classList.add("fantasySelection-optionForm", "driver3");
    parentElement.appendChild(element);
    document.body.appendChild(parentElement);
    document.body.appendChild(nextElementSibling);
    spyOn(component, "changeOptionSelected");
    spyOn(component, "setOptionSelected");

    component.removeDriverSelected(element);

    expect(component.optionSelected).toBe("Pilotos");
    expect(component.changeOptionSelected).toHaveBeenCalledWith(null);
    expect(component.setOptionSelected).toHaveBeenCalled();
  });

  it("should handle undefined driver classes correctly", () => {
    const element = document.createElement("div");
    const parentElement = document.createElement("div");
    const nextElementSibling = document.createElement("div");
    parentElement.appendChild(nextElementSibling);
    element.appendChild(parentElement);

    component.deleteDriverOfTheSelection(element);

    expect(component.fantasyElection.driverOne).toBeUndefined();
    expect(component.fantasyElection.driverTwo).toBeUndefined();
    expect(component.fantasyElection.driverThree).toBeUndefined();
  });

  it("should remove the last class from elementPhoto", () => {
    const element = document.createElement("div");
    const parentElement = document.createElement("div");
    const nextElementSibling = document.createElement("div");
    const nextNextElementSibling = document.createElement("div");
    nextNextElementSibling.classList.add("someClass", "toRemove");
    parentElement.appendChild(element);
    document.body.appendChild(parentElement);
    document.body.appendChild(nextElementSibling);
    document.body.appendChild(nextNextElementSibling);

    component.deleteDriverTeamBackground(element);

    expect(nextNextElementSibling.classList.contains("toRemove")).toBeFalse();
  });

  it("should return if event is null", () => {
    spyOn(component, "deleteDriverOfTheSelection");
    spyOn(component, "deleteDriverTeamBackground");

    component.removeTeamSelected(null);

    expect(component.deleteDriverOfTheSelection).not.toHaveBeenCalled();
    expect(component.deleteDriverTeamBackground).not.toHaveBeenCalled();
  });

  it("should return when driverNumberClass is undefined", () => {
    const element = document.createElement("div");
    const parentElement = document.createElement("div");
    const nextElementSibling = document.createElement("div");
    parentElement.appendChild(nextElementSibling);
    parentElement.appendChild(element);
    spyOn(component, "calculateTotalPrice");

    component.deleteTeamOfTheSelection(element);

    expect(component.calculateTotalPrice).not.toHaveBeenCalled();
  });

  it("should update optionSelected and call related methods if input class includes team1", () => {
    const element = document.createElement("div");
    const parentElement = document.createElement("div");
    const nextElementSibling = document.createElement("input");
    nextElementSibling.classList.add("fantasySelection-optionForm", "team1");
    parentElement.appendChild(element);
    document.body.appendChild(parentElement);
    document.body.appendChild(nextElementSibling);
    spyOn(component, "changeOptionSelected");
    spyOn(component, "setOptionSelected");

    component.removeTeamSelected(element);

    expect(component.optionSelected).toBe("Equipos");
    expect(component.changeOptionSelected).toHaveBeenCalledWith(null);
    expect(component.setOptionSelected).toHaveBeenCalled();
  });

  it("should update optionSelected and call related methods if input class includes team2", () => {
    const element = document.createElement("div");
    const parentElement = document.createElement("div");
    const nextElementSibling = document.createElement("input");
    nextElementSibling.classList.add("fantasySelection-optionForm", "team2");
    parentElement.appendChild(element);
    document.body.appendChild(parentElement);
    document.body.appendChild(nextElementSibling);
    spyOn(component, "changeOptionSelected");
    spyOn(component, "setOptionSelected");

    component.removeTeamSelected(element);

    expect(component.optionSelected).toBe("Equipos");
    expect(component.changeOptionSelected).toHaveBeenCalledWith(null);
    expect(component.setOptionSelected).toHaveBeenCalled();
  });

  it("should set option selected correctly", () => {
    component.optionSelected = "Pilotos";
    document.body.innerHTML = `
      <div class="fantasySelection-mid-table-top-option">
        <div>Pilotos</div>
      </div>
      <div class="fantasySelection-mid-table-top-option">
        <div>Equipos</div>
      </div>
    `;

    component.setOptionSelected();

    const selectedElements = document.querySelectorAll(".selected");
    expect(selectedElements[0].children[0].innerHTML).toBe("Pilotos");
  });

  it("should thrown a warning hour saving fantasyElection", () => {
    const currentDate = new Date();
    const lessThan12HoursFromNow = new Date(currentDate.getTime() + 10 * 60 * 60 * 1000);
    component.raceSelected = new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), lessThan12HoursFromNow, 1, new Season(1, "Season 1", 1));

    component.saveFantasyElection();

    expect(messageInfoServiceSpy.showWarn).toHaveBeenCalledWith(WARNING_FANTASY_SAVE_LATE);
  });

  it("should thrown a warning that fantasy election is not completed saving fantasy election", () => {
    const currentDate = new Date();
    const moreThan12HoursFromNow = new Date(currentDate.getTime() + 14 * 60 * 60 * 1000);
    component.raceSelected = new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), moreThan12HoursFromNow, 1, new Season(1, "Season 1", 1));

    component.saveFantasyElection();

    expect(messageInfoServiceSpy.showWarn).toHaveBeenCalledWith(WARNING_ELECTION_NOT_COMPLETED);
  });

  it("should thrown a warning when prices is below than 0 saving fantasy election", () => {
    const currentDate = new Date();
    const moreThan12HoursFromNow = new Date(currentDate.getTime() + 14 * 60 * 60 * 1000);
    component.raceSelected = new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), moreThan12HoursFromNow, 1, new Season(1, "Season 1", 1));
    component.fantasyElection = new FantasyElection(
      0,
      new Account(0, "Avantifer", "", "", 1),
      new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
      new Driver(2, "Bubapu", 1, new Team(2, "Ferrari", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
      new Driver(3, "AlbertoMD", 1, new Team(3, "Williams", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
      new Team(3, "Williams", "", "", new Season(1, "Season 1", 1)),
      new Team(2, "Ferrari", "", "", new Season(1, "Season 1", 1)),
      new Race(2, new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      new Season(1, "Season 1", 1)
    );
    component.price = -1;

    component.saveFantasyElection();

    expect(messageInfoServiceSpy.showWarn).toHaveBeenCalledWith(WARNING_MONEY_NEGATIVE);
  });

  it("should save fantasy correctly", () => {
    const currentDate = new Date();
    const moreThan12HoursFromNow = new Date(currentDate.getTime() + 14 * 60 * 60 * 1000);
    component.raceSelected = new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), moreThan12HoursFromNow, 1, new Season(1, "Season 1", 1));
    component.fantasyElection = new FantasyElection(
      0,
      new Account(0, "Avantifer", "", "", 1),
      new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
      new Driver(2, "Bubapu", 1, new Team(2, "Ferrari", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
      new Driver(3, "AlbertoMD", 1, new Team(3, "Williams", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
      new Team(3, "Williams", "", "", new Season(1, "Season 1", 1)),
      new Team(2, "Ferrari", "", "", new Season(1, "Season 1", 1)),
      new Race(2, new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      new Season(1, "Season 1", 1)
    );
    component.price = 1000;
    localStorage.setItem("auth", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBdmFudGlmZXIiLCJ1c2VySWQiOjIsImFkbWluIjoxLCJpYXQiOjE3MTM3MzIzOTEsImV4cCI6MTcxNjMyNDM5MX0.GrnIdQugE_D0RnWYs_U12ItrmVgploMk0B5SXzECdGw");
    fantasyApiServiceSpy.saveFantasyElection.and.returnValue(of("Save fantasy correctly"));

    component.saveFantasyElection();

    expect(messageInfoServiceSpy.showSuccess).toHaveBeenCalledWith("Save fantasy correctly");
  });

  it("should thrown an error saving fantasy election", () => {
    const currentDate = new Date();
    const moreThan12HoursFromNow = new Date(currentDate.getTime() + 14 * 60 * 60 * 1000);
    component.raceSelected = new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), moreThan12HoursFromNow, 1, new Season(1, "Season 1", 1));
    component.fantasyElection = new FantasyElection(
      0,
      new Account(0, "Avantifer", "", "", 1),
      new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
      new Driver(2, "Bubapu", 1, new Team(2, "Ferrari", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
      new Driver(3, "AlbertoMD", 1, new Team(3, "Williams", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
      new Team(3, "Williams", "", "", new Season(1, "Season 1", 1)),
      new Team(2, "Ferrari", "", "", new Season(1, "Season 1", 1)),
      new Race(2, new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      new Season(1, "Season 1", 1)
    );
    component.price = 1000;
    localStorage.setItem("auth", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBdmFudGlmZXIiLCJ1c2VySWQiOjIsImFkbWluIjoxLCJpYXQiOjE3MTM3MzIzOTEsImV4cCI6MTcxNjMyNDM5MX0.GrnIdQugE_D0RnWYs_U12ItrmVgploMk0B5SXzECdGw");
    fantasyApiServiceSpy.saveFantasyElection.and.returnValue(throwError(() => ERROR_FANTASY_ELECTION_SAVE));

    component.saveFantasyElection();

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_FANTASY_ELECTION_SAVE);
  });

  it("should get fantasyElection correctly", () => {
    const currentDate = new Date();
    const moreThan12HoursFromNow = new Date(currentDate.getTime() + 14 * 60 * 60 * 1000);
    const fantasyElection = new FantasyElection(
      0,
      new Account(0, "Avantifer", "", "", 1),
      new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
      new Driver(2, "Bubapu", 1, new Team(2, "Ferrari", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
      new Driver(3, "AlbertoMD", 1, new Team(3, "Williams", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
      new Team(3, "Williams", "", "", new Season(1, "Season 1", 1)),
      new Team(2, "Ferrari", "", "", new Season(1, "Season 1", 1)),
      new Race(2, new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      new Season(1, "Season 1", 1)
    );
    const fantasyPointsDriver = new FantasyPointsDriver(
      0,
      new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
      new Race(2, new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      10,
      new Season(1, "Season 1", 1)
    );
    const fantasyPointsTeam = new FantasyPointsTeam(
      0,
      new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
      new Race(2, new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      10,
      new Season(1, "Season 1", 1)
    );
    component.raceSelected = new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), moreThan12HoursFromNow, 1, new Season(1, "Season 1", 1));

    component.fantasyElection.race =  new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), moreThan12HoursFromNow, 1, new Season(1, "Season 1", 1));
    component.price = 1000;
    localStorage.setItem("auth", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBdmFudGlmZXIiLCJ1c2VySWQiOjIsImFkbWluIjoxLCJpYXQiOjE3MTM3MzIzOTEsImV4cCI6MTcxNjMyNDM5MX0.GrnIdQugE_D0RnWYs_U12ItrmVgploMk0B5SXzECdGw");
    fantasyApiServiceSpy.getFantasyElection.and.returnValue(of(fantasyElection));
    fantasyApiServiceSpy.getDriverPointsSpecificRace.and.returnValue(of(fantasyPointsDriver));
    fantasyApiServiceSpy.getTeamsPointsSpecificRace.and.returnValue(of(fantasyPointsTeam));

    component.getFantasyElection();

    expect(component.fantasyElection.driverOne).toEqual(fantasyElection.driverOne);
  });

  it("should get fantasyElection throwing error getting points correctly", () => {
    const currentDate = new Date();
    const moreThan12HoursFromNow = new Date(currentDate.getTime() + 14 * 60 * 60 * 1000);
    const fantasyElection = new FantasyElection(
      0,
      new Account(0, "Avantifer", "", "", 1),
      new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
      new Driver(2, "Bubapu", 1, new Team(2, "Ferrari", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
      new Driver(3, "AlbertoMD", 1, new Team(3, "Williams", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
      new Team(3, "Williams", "", "", new Season(1, "Season 1", 1)),
      new Team(2, "Ferrari", "", "", new Season(1, "Season 1", 1)),
      new Race(2, new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      new Season(1, "Season 1", 1)
    );
    component.raceSelected = new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), moreThan12HoursFromNow, 1, new Season(1, "Season 1", 1));
    component.price = 1000;
    localStorage.setItem("auth", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBdmFudGlmZXIiLCJ1c2VySWQiOjIsImFkbWluIjoxLCJpYXQiOjE3MTM3MzIzOTEsImV4cCI6MTcxNjMyNDM5MX0.GrnIdQugE_D0RnWYs_U12ItrmVgploMk0B5SXzECdGw");
    fantasyApiServiceSpy.getFantasyElection.and.returnValue(of(fantasyElection));
    fantasyApiServiceSpy.getDriverPointsSpecificRace.and.returnValue(throwError(() => ERROR_POINT_FETCH));
    fantasyApiServiceSpy.getTeamsPointsSpecificRace.and.returnValue(throwError(() => ERROR_POINT_FETCH));

    component.getFantasyElection();

    expect(component.fantasyElection.driverOne).toEqual(fantasyElection.driverOne);
  });

  it("should get fantasyElection from cache correctly", () => {
    const currentDate = new Date();
    const moreThan12HoursFromNow = new Date(currentDate.getTime() + 14 * 60 * 60 * 1000);
    const fantasyElection = new FantasyElection(
      0,
      new Account(0, "Avantifer", "", "", 1),
      new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
      new Driver(2, "Bubapu", 1, new Team(2, "Ferrari", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
      new Driver(3, "AlbertoMD", 1, new Team(3, "Williams", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
      new Team(3, "Williams", "", "", new Season(1, "Season 1", 1)),
      new Team(2, "Ferrari", "", "", new Season(1, "Season 1", 1)),
      undefined,
      new Season(1, "Season 1", 1)
    );
    component.raceSelected = new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), moreThan12HoursFromNow, 1, new Season(1, "Season 1", 1));
    component.price = 1000;
    localStorage.setItem("auth", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBdmFudGlmZXIiLCJ1c2VySWQiOjIsImFkbWluIjoxLCJpYXQiOjE3MTM3MzIzOTEsImV4cCI6MTcxNjMyNDM5MX0.GrnIdQugE_D0RnWYs_U12ItrmVgploMk0B5SXzECdGw");
    fantasyApiServiceSpy.getFantasyElection.and.returnValue(of(fantasyElection));

    component.getFantasyElection();

    expect(component.fantasyElection.driverOne).toEqual(undefined);
  });

  it("should reset selected item to driver1", () => {
    document.body.innerHTML = `
      <input class="selected" />
      <div class="driver1"></div>
      <div class="driver2"></div>
      <div class="driver3"></div>
      <div class="team1"></div>
      <div class="team2"></div>
    `;
    component.raceSelected = new Race(2, new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1)), new Date(), 0, new Season(1, "Season 1", 1));

    component.resetSelectedItem();

    expect(document.querySelector(".driver1")?.classList.contains("selected")).toBeTrue();
  });

  it("should reset selected item to driver2", () => {
    document.body.innerHTML = `
      <input class="selected" />
      <div class="driver1"></div>
      <div class="driver2"></div>
      <div class="driver3"></div>
      <div class="team1"></div>
      <div class="team2"></div>
    `;
    component.raceSelected = new Race(2, new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1)), new Date(), 0, new Season(1, "Season 1", 1));
    component.fantasyElection.driverOne = new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),

    component.resetSelectedItem();

    expect(document.querySelector(".driver2")?.classList.contains("selected")).toBeTrue();
  });

  it("should reset selected item to driver3", () => {
    document.body.innerHTML = `
      <input class="selected" />
      <div class="driver1"></div>
      <div class="driver2"></div>
      <div class="driver3"></div>
      <div class="team1"></div>
      <div class="team2"></div>
      `;
    component.raceSelected = new Race(2, new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1)), new Date(), 0, new Season(1, "Season 1", 1));
    component.fantasyElection.driverOne = new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
    component.fantasyElection.driverTwo = new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),

    component.resetSelectedItem();

    expect(document.querySelector(".driver3")?.classList.contains("selected")).toBeTrue();
  });

  it("should reset selected item to team1", () => {
    document.body.innerHTML = `
      <input class="selected" />
      <div class="driver1"></div>
      <div class="driver2"></div>
      <div class="driver3"></div>
      <div class="team1"></div>
      <div class="team2"></div>
    `;
    component.raceSelected = new Race(2, new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1)), new Date(), 0, new Season(1, "Season 1", 1));
    component.fantasyElection.driverOne = new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
    component.fantasyElection.driverTwo = new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
    component.fantasyElection.driverThree = new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),

    component.resetSelectedItem();

    expect(document.querySelector(".team1")?.classList.contains("selected")).toBeTrue();
  });

  it("should reset selected item to team2", () => {
    document.body.innerHTML = `
      <input class="selected" />
      <div class="driver1"></div>
      <div class="driver2"></div>
      <div class="driver3"></div>
      <div class="team1"></div>
      <div class="team2"></div>
    `;
    component.raceSelected = new Race(2, new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1)), new Date(), 0, new Season(1, "Season 1", 1));
    component.fantasyElection.driverOne = new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
    component.fantasyElection.driverTwo = new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
    component.fantasyElection.driverThree = new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
    component.fantasyElection.teamOne = new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1));

    component.resetSelectedItem();

    expect(document.querySelector(".team2")?.classList.contains("selected")).toBeTrue();
  });

  it("should open the driver price dialog with the correct parameters", () => {
    const driverId = 1;
    component.openDriverPriceDialog(driverId);

    expect(dialogServiceSpy.open).toHaveBeenCalledWith(FantasyTeamDialogPriceComponent, {
      header: "Gráfico de precio",
      data: { id: driverId, type: "drivers" },
      resizable: false,
      dismissableMask: true,
      width: "45rem",
      breakpoints: { "1199px": "94vw", "575px": "90vw" }
    });
  });

  it("should open the team price dialog with the correct parameters", () => {
    const teamId = 1;
    component.openTeamPriceDialog(teamId);

    expect(dialogServiceSpy.open).toHaveBeenCalledWith(FantasyTeamDialogPriceComponent, {
      header: "Gráfico de precio",
      data: { id: teamId, type: "teams" },
      resizable: false,
      dismissableMask: true,
      width: "45rem",
      breakpoints: { "1199px": "94vw", "575px": "90vw" }
    });
  });

  it("should open the driver point dialog with the correct parameters", () => {
    const driverId = 1;
    component.openDriverPointDialog(driverId);

    expect(dialogServiceSpy.open).toHaveBeenCalledWith(FantasyTeamDialogPointComponent, {
      header: "Gráfico de puntos",
      data: { id: driverId, type: "drivers" },
      resizable: false,
      dismissableMask: true,
      width: "45rem",
      breakpoints: { "1199px": "94vw", "575px": "90vw" }
    });
  });

  it("should open the team point dialog with the correct parameters", () => {
    const teamId = 1;
    component.openTeamPointDialog(teamId);

    expect(dialogServiceSpy.open).toHaveBeenCalledWith(FantasyTeamDialogPointComponent, {
      header: "Gráfico de puntos",
      data: { id: teamId, type: "teams" },
      resizable: false,
      dismissableMask: true,
      width: "45rem",
      breakpoints: { "1199px": "94vw", "575px": "90vw" }
    });
  });

  it("should parse average points correctly for integers", () => {
    const points = 10;
    const result = component.parseAveragePoints(points);
    expect(result).toBe("10");
  });

  it("should parse average points correctly for floating points", () => {
    const points = 10.5;
    const result = component.parseAveragePoints(points);
    expect(result).toBe("10.5");
  });

  it("should return 0 if points is undefined", () => {
    const result = component.parseAveragePoints(undefined);
    expect(result).toBe("0");
  });
});
