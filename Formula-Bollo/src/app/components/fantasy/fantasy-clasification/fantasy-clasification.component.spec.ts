import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FantasyClasificationComponent } from "./fantasy-clasification.component";
import { FantasyApiService } from "src/shared/services/api/fantasy-api.service";
import { RaceApiService } from "src/shared/services/api/race-api.service";
import { SeasonApiService } from "src/shared/services/api/season-api.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { DropdownModule } from "primeng/dropdown";
import { Season } from "src/shared/models/season";
import { Circuit } from "src/shared/models/circuit";
import { Race } from "src/shared/models/race";
import { of, throwError } from "rxjs";
import { ERROR_POINT_FETCH, ERROR_RACE_FETCH, ERROR_SEASON_FETCH } from "src/app/constants";
import { FantasyPointsUser } from "src/shared/models/fantasyPointsUser";
import { Account } from "src/shared/models/account";
import { FantasyElection } from "src/shared/models/fantasyElection";
import { Driver } from "src/shared/models/driver";
import { Team } from "src/shared/models/team";

describe("FantasyClasificationComponent", () => {
  let component: FantasyClasificationComponent;
  let fixture: ComponentFixture<FantasyClasificationComponent>;
  let raceApiServiceSpy: jasmine.SpyObj<RaceApiService>;
  let messageInfoServiceSpy: jasmine.SpyObj<MessageInfoService>;
  let fantasyApiServiceSpy: jasmine.SpyObj<FantasyApiService>;
  let seasonApiServiceSpy: jasmine.SpyObj<SeasonApiService>;

  beforeEach(async () => {
    raceApiServiceSpy = jasmine.createSpyObj("RaceApiService", ["getAllPrevious"]);
    messageInfoServiceSpy = jasmine.createSpyObj("MessageInfoService", ["showError"]);
    fantasyApiServiceSpy = jasmine.createSpyObj("FantasyApiService", ["getFantasyPoints"]);
    seasonApiServiceSpy = jasmine.createSpyObj("SeasonApiService", ["getSeasonOfFantasy"]);

    await TestBed.configureTestingModule({
      declarations: [FantasyClasificationComponent],
      imports: [
        DropdownModule
      ],
      providers: [
        { provide: RaceApiService, useValue: raceApiServiceSpy },
        { provide: MessageInfoService, useValue: messageInfoServiceSpy },
        { provide: FantasyApiService, useValue: fantasyApiServiceSpy },
        { provide: SeasonApiService, useValue: seasonApiServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FantasyClasificationComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call some methods", () => {
    spyOn(component, "getAllSeasons");
    spyOn(component, "changeRace");
    spyOn(component, "changeSeason");

    component.ngOnInit();

    expect(component.getAllSeasons).toHaveBeenCalled();
    expect(component.changeRace).toHaveBeenCalled();
    expect(component.changeSeason).toHaveBeenCalled();
  });

  it("should not get all races when sesasonSelected is undefined", () => {
    component.seasonSelected = undefined;

    component.getAllRaces();
  });

  it("should get all races correctly", () => {
    component.seasonSelected = new Season(1, "Season 1", 1);
    const racesExpected = [
      new Race(0, new Circuit(0, "Total", "", "", "", undefined), new Date(), 0, undefined),
      new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1))
    ];
    const races = [
      new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1))
    ];
    raceApiServiceSpy.getAllPrevious.and.returnValue(of(races));
    fantasyApiServiceSpy.getFantasyPoints.and.returnValue(of([]));
    component.getAllRaces();

    racesExpected.forEach((expectedRace, index) => {
      expect(component.races[index].id).toEqual(expectedRace.id);
      expect(component.races[index].circuit.name).toEqual(expectedRace.circuit.name);
    });
  });

  it("should thrown an error getting all races", () => {
    component.seasonSelected = new Season(1, "Season 1", 1);
    raceApiServiceSpy.getAllPrevious.and.returnValue(throwError(() => ERROR_RACE_FETCH));

    component.getAllRaces();

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_RACE_FETCH);
  });

  it("should get all season correctly", () => {
    const seasons = [
      new Season(1, "Season 1", 1),
      new Season(2, "Season 2", 2)
    ];
    component.raceSelected = new Race(2, new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1));
    component.seasonSelected = new Season(2, "Season 2", 2);
    seasonApiServiceSpy.getSeasonOfFantasy.and.returnValue(of(seasons));
    fantasyApiServiceSpy.getFantasyPoints.and.returnValue(of([]));
    raceApiServiceSpy.getAllPrevious.and.returnValue(of([]));

    component.getAllSeasons();

    expect(component.seasons).toBe(seasons);
  });

  it("should thrown an error getting all seasons", () => {
    seasonApiServiceSpy.getSeasonOfFantasy.and.returnValue(throwError(() => ERROR_SEASON_FETCH));

    component.getAllSeasons();

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_SEASON_FETCH);
  });

  it("should get fantasy points correctly", () => {
    component.raceSelected = new Race(2, new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1));
    component.seasonSelected = new Season(2, "Season 2", 2);
    const fantasyPointsUser = [
      new FantasyPointsUser(
        new Account(0, "Avantifer", "", "", 1),
        new FantasyElection(
          0,
          new Account(0, "Avantifer", "", "", 1),
          new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
          new Driver(2, "Bubapu", 1, new Team(2, "Ferrari", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
          new Driver(3, "AlbertoMD", 1, new Team(3, "Williams", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
          new Team(3, "Williams", "", "", new Season(1, "Season 1", 1)),
          new Team(2, "Ferrari", "", "", new Season(1, "Season 1", 1)),
          new Race(2, new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
          new Season(1, "Season 1", 1)
        ),
        10
      )
    ];
    fantasyApiServiceSpy.getFantasyPoints.and.returnValue(of(fantasyPointsUser));
    raceApiServiceSpy.getAllPrevious.and.returnValue(of([]));

    component.getFantasyPoints();

    expect(component.fantasyPointsUsers).toBe(fantasyPointsUser);
  });

  it("should thrown an error getting all fantasy points", () => {
    component.raceSelected = new Race(2, new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1));
    component.seasonSelected = new Season(2, "Season 2", 2);
    fantasyApiServiceSpy.getFantasyPoints.and.returnValue(throwError(() => ERROR_POINT_FETCH));

    component.getFantasyPoints();

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_POINT_FETCH);
  });

  it("should not change race when raceSelected is undefined", () => {
    component.changeRace();

    expect(component.raceSelected).toBe(undefined);
  });

  it("should change race correctly", () => {
    const raceExpected = new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1));
    component.raceSelected = new Race(2, new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1));
    fantasyApiServiceSpy.getFantasyPoints.and.returnValue(of([]));
    component.raceSelected = new Race(2, new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1));
    component.seasonSelected = new Season(2, "Season 2", 2);

    component.changeRace();

    component.raceForm.setValue({ "race" : raceExpected});

    expect(component.raceSelected.circuit).toBe(raceExpected.circuit);
  });

  it("should not change season if seasonSelected is undefined", () => {
    component.changeSeason();

    expect(component.raceSelected).toBe(undefined);
  });

  it("should change season correctly", () => {
    const seasonExpected = new Season(1, "Season 1", 1);
    component.seasonSelected = new Season(2, "Season 2", 2);
    raceApiServiceSpy.getAllPrevious.and.returnValue(of([]));
    fantasyApiServiceSpy.getFantasyPoints.and.returnValue(of([]));
    component.raceSelected = new Race(2, new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1));
    component.seasonSelected = new Season(2, "Season 2", 2);

    component.changeSeason();

    component.seasonForm.setValue({ "season" : seasonExpected });

    expect(component.seasonSelected).toBe(seasonExpected);
  });
});
