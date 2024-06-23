/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TeamsInfoComponent } from "./teams-info.component";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { DriverApiService } from "src/shared/services/api/driver-api.service";
import { TeamApiService } from "src/shared/services/api/team-api.service";
import { SeasonApiService } from "src/shared/services/api/season-api.service";
import { ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Season } from "src/shared/models/season";
import { of, throwError } from "rxjs";
import { ERROR_DRIVER_TEAM_FETCH, ERROR_TEAM_INFO_FETCH, ERROR_TEAM_NAME_NOT_FOUND } from "src/app/constants";
import { TeamInfo } from "src/shared/models/teamInfo";
import { Team } from "src/shared/models/team";
import { Driver } from "src/shared/models/driver";

describe("TeamsInfoComponent", () => {
  let component: TeamsInfoComponent;
  let fixture: ComponentFixture<TeamsInfoComponent>;
  let seasonApiServiceSpy: jasmine.SpyObj<SeasonApiService>;
  let teamApiServiceSpy: jasmine.SpyObj<TeamApiService>;
  let driverApiServiceSpy: jasmine.SpyObj<DriverApiService>;
  let messageInfoServiceSpy: jasmine.SpyObj<MessageInfoService>;
  const routerSpy = { url: "/", navigate: jasmine.createSpy("navigate") };
  let routeSpy: any;

  beforeEach(async ()  => {
    seasonApiServiceSpy = jasmine.createSpyObj("SeasonApiService", ["getSeasonByTeamName"]);
    teamApiServiceSpy = jasmine.createSpyObj("TeamApiService", ["getInfoByTeamName"]);
    driverApiServiceSpy = jasmine.createSpyObj("DriverApiService", ["getDriversByTeam"]);
    messageInfoServiceSpy = jasmine.createSpyObj("MessageInfoService", ["showError"]);
    routeSpy = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy("get").and.returnValue("Aston_Martin")
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [TeamsInfoComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: DriverApiService, useValue: driverApiServiceSpy },
        { provide: TeamApiService, useValue: teamApiServiceSpy },
        { provide: SeasonApiService, useValue: seasonApiServiceSpy },
        { provide: MessageInfoService, useValue: messageInfoServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: routeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TeamsInfoComponent);
    component = fixture.componentInstance;
  });

  it ("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call getSeasonsByTeamName and changeSeasons on ngOnInit", () => {
    spyOn(component, "getSeasonsByTeamName");
    spyOn(component, "changeSeasons");

    component.ngOnInit();

    expect(component.name).toBe("Aston Martin");
    expect(component.getSeasonsByTeamName).toHaveBeenCalled();
    expect(component.changeSeasons).toHaveBeenCalled();
  });

  it("should fetch seasons by team name and handle response", () => {
    const seasons: Season[] = [new Season(1, "Season 1", 1), new Season(2, "Season 2", 2)];
    seasonApiServiceSpy.getSeasonByTeamName.and.returnValue(of(seasons));
    spyOn(component, "getInfoByTeamName");
    component.name = "Aston Martin";

    component.getSeasonsByTeamName("Aston Martin");

    expect(seasonApiServiceSpy.getSeasonByTeamName).toHaveBeenCalledWith("Aston Martin");
    expect(component.seasons).toEqual(seasons);
    expect(component.getInfoByTeamName).toHaveBeenCalledWith("Aston Martin");
  });

  it("should navigate to /teams and show error if seasons array is empty", () => {
    seasonApiServiceSpy.getSeasonByTeamName.and.returnValue(of([]));
    component.name = "Aston Martin";

    component.getSeasonsByTeamName("Aston Martin");

    expect(seasonApiServiceSpy.getSeasonByTeamName).toHaveBeenCalledWith("Aston Martin");
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/teams"]);
    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_TEAM_NAME_NOT_FOUND);
  });

  it("should handle error when fetching seasons by team name", () => {
    seasonApiServiceSpy.getSeasonByTeamName.and.returnValue(throwError(() => ERROR_TEAM_NAME_NOT_FOUND));
    component.name = "Aston Martin";
    component.getSeasonsByTeamName("Aston Martin");

    expect(seasonApiServiceSpy.getSeasonByTeamName).toHaveBeenCalledWith("Aston Martin");
    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_TEAM_NAME_NOT_FOUND);
  });

  it("should fetch team info by name and handle response", () => {
    spyOn(component, "getDriversbyTeam");
    const teamInfo: TeamInfo = new TeamInfo(
      new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
      5,
      5,
      5,
      100,
      1,
      0,
      1,
      5,
      5,
      5
    );
    teamApiServiceSpy.getInfoByTeamName.and.returnValue(of(teamInfo));

    component.getInfoByTeamName("Aston Martin");

    expect(teamApiServiceSpy.getInfoByTeamName).toHaveBeenCalledWith("Aston Martin", undefined);
    expect(component.teamInfo).toEqual(teamInfo);
    expect(component.getDriversbyTeam).toHaveBeenCalled();
  });

  it("should handle error when fetching team info", () => {
    teamApiServiceSpy.getInfoByTeamName.and.returnValue(throwError(() => ERROR_TEAM_INFO_FETCH));

    component.getInfoByTeamName("Aston Martin");

    expect(teamApiServiceSpy.getInfoByTeamName).toHaveBeenCalledWith("Aston Martin", undefined);
    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_TEAM_INFO_FETCH);
  });

  it("should subscribe to season form value changes and update driver info", () => {
    const season = new Season(2, "Season 2", 2);
    spyOn(component, "getInfoByTeamName");

    component.name = "Aston Martin";
    component.changeSeasons();
    component.seasonForm.setValue({ season });

    expect(component.getInfoByTeamName).toHaveBeenCalledWith("Aston Martin", 2);
  });

  it("should fetch info for total season if season id is 0", () => {
    const season = new Season(0, "Total", 0);
    spyOn(component, "getInfoByTeamName");

    component.name = "Aston Martin";
    component.changeSeasons();
    component.seasonForm.setValue({ season });

    expect(component.getInfoByTeamName).toHaveBeenCalledWith("Aston Martin");
  });

  it("should set drivers correctly on successful response", () => {
    const mockDrivers = [new Driver(1, "Dani Calde", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1))];
    driverApiServiceSpy.getDriversByTeam.and.returnValue(of(mockDrivers));

    component.getDriversbyTeam(1);

    expect(component.drivers).toEqual(mockDrivers);
  });

  it("should show error on API error", () => {
    driverApiServiceSpy.getDriversByTeam.and.returnValue(throwError(() => ERROR_DRIVER_TEAM_FETCH));

    component.getDriversbyTeam(1);

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_DRIVER_TEAM_FETCH);
  });

  it("should show error if no drivers are returned", () => {
    driverApiServiceSpy.getDriversByTeam.and.returnValue(of([]));

    component.getDriversbyTeam(1);

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_DRIVER_TEAM_FETCH);
  });

  it("should convert spaces to underscores", () => {
    const input = "Aston Martin";
    const expected = "Aston_Martin";
    expect(component.driverNameSpaceToUnderScore(input)).toBe(expected);
  });
});
