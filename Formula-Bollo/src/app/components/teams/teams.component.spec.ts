import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TeamsComponent } from "./teams.component";
import { SeasonService } from "src/shared/services/season.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { TeamApiService } from "src/shared/services/api/team-api.service";
import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { of, throwError } from "rxjs";
import { ERROR_TEAM_FETCH } from "src/app/constants";
import { TeamWithDrivers } from "src/shared/models/teamWithDrivers";
import { Team } from "src/shared/models/team";
import { Driver } from "src/shared/models/driver";
import { Season } from "src/shared/models/season";

describe("TeamsComponent", () => {
  let component: TeamsComponent;
  let fixture: ComponentFixture<TeamsComponent>;
  let teamApiServiceSpy: jasmine.SpyObj<TeamApiService>;
  let messageInfoServiceSpy: jasmine.SpyObj<MessageInfoService>;
  let seasonServiceSpy: jasmine.SpyObj<SeasonService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    teamApiServiceSpy = jasmine.createSpyObj("TeamApiService", ["getAllTeamsWithDrivers"]);
    messageInfoServiceSpy = jasmine.createSpyObj("MessageInfoService", ["showError"]);
    seasonServiceSpy = jasmine.createSpyObj("SeasonService", ["obtainAllSeasons"]);
    routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      declarations: [TeamsComponent],
      providers: [
        { provide: TeamApiService, useValue: teamApiServiceSpy },
        { provide: MessageInfoService, useValue: messageInfoServiceSpy },
        { provide: SeasonService, useValue: seasonServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TeamsComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call some methods on ngOnInit", () => {
    spyOn(component, "obtainAllSeasons");
    spyOn(component, "obtainAllTeamsWithDrivers");
    spyOn(component, "changeSeasonTeams");

    component.ngOnInit();

    expect(component.obtainAllSeasons).toHaveBeenCalled();
    expect(component.obtainAllTeamsWithDrivers).toHaveBeenCalled();
    expect(component.changeSeasonTeams).toHaveBeenCalled();
  });

  it("should obtain all teams with drivers successfully", () => {
    const mockTeamsWithDrivers: TeamWithDrivers[] = [
      new TeamWithDrivers(
        new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new Driver(1, "El Jupa", 10, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        100
      )
    ];
    teamApiServiceSpy.getAllTeamsWithDrivers.and.returnValue(of(mockTeamsWithDrivers));

    component.obtainAllTeamsWithDrivers(1);

    expect(teamApiServiceSpy.getAllTeamsWithDrivers).toHaveBeenCalledWith(1);
    expect(component.teamWithDrivers).toEqual(mockTeamsWithDrivers);
  });

  it("should handle error when obtaining all teams with drivers", () => {
    teamApiServiceSpy.getAllTeamsWithDrivers.and.returnValue(throwError(() => ERROR_TEAM_FETCH));

    component.obtainAllTeamsWithDrivers(1);

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_TEAM_FETCH);
  });

  it("should obtain all seasons", () => {
    component.obtainAllSeasons();

    expect(seasonServiceSpy.obtainAllSeasons).toHaveBeenCalledWith(component.seasons, component.seasonSelected, component.seasonForm);
  });

  it("should change season teams on season change", () => {
    const formBuilder: FormBuilder = TestBed.inject(FormBuilder);
    component.seasonForm = formBuilder.group({
      season: new Season(1, "Season 1", 1)
    });

    spyOn(component.seasonForm.valueChanges, "subscribe").and.callThrough();
    spyOn(component, "obtainAllTeamsWithDrivers");

    component.changeSeasonTeams();
    component.seasonForm.setValue({ season: new Season(2, "Season 2", 2) });

    expect(component.seasonSelected).toEqual(new Season(2, "Season 2", 2));
    expect(component.teamWithDrivers).toEqual([]);
    expect(component.obtainAllTeamsWithDrivers).toHaveBeenCalledWith(2);
  });

  it("should convert team name spaces to underscores", () => {
    const teamName = "Aston Martin";
    const result = component.teamNameSpaceToUnderScore(teamName);

    expect(result).toBe("Aston_Martin");
  });
});
