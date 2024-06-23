import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HomeTeamsComponent } from "./home-teams.component";
import { Router } from "@angular/router";
import { TeamApiService } from "src/shared/services/api/team-api.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { ThemeService } from "src/shared/services/theme.service";
import { of, throwError } from "rxjs";
import { Team } from "src/shared/models/team";
import { Season } from "src/shared/models/season";
import { ERROR_TEAM_FETCH } from "src/app/constants";

describe("HomeTeamsComponent", () => {
  let component: HomeTeamsComponent;
  let fixture: ComponentFixture<HomeTeamsComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let teamApiServiceSpy: jasmine.SpyObj<TeamApiService>;
  let messageInfoServiceSpy: jasmine.SpyObj<MessageInfoService>;
  let themeServiceSpy: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
    teamApiServiceSpy = jasmine.createSpyObj("TeamApiService", ["getAllTeams"]);
    messageInfoServiceSpy = jasmine.createSpyObj("MessageInfoService", ["showError"]);
    themeServiceSpy = jasmine.createSpyObj("ThemeService", ["checkTheme"]);

    await TestBed.configureTestingModule({
      declarations: [HomeTeamsComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: TeamApiService, useValue: teamApiServiceSpy },
        { provide: MessageInfoService, useValue: messageInfoServiceSpy },
        { provide: ThemeService, useValue: themeServiceSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeTeamsComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call obtainAllTeams and theme", () => {
    spyOn(component, "obtainAllTeams");
    themeServiceSpy.theme$ = of(true);

    component.ngOnInit();

    expect(component.themeClass).toBe("dark-theme");
    expect(component.obtainAllTeams).toHaveBeenCalled();

    themeServiceSpy.theme$ = of(false);

    component.ngOnInit();

    expect(component.themeClass).toBe("light-theme");
  });

  it("should obtain all teams", () => {
    const teams = [
      new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1))
    ];
    teamApiServiceSpy.getAllTeams.and.returnValue(of(teams));

    component.obtainAllTeams();

    expect(component.teams).toBe(teams);
  });

  it("should thrown error obtaining all teams", () => {
    teamApiServiceSpy.getAllTeams.and.returnValue(throwError(() => ERROR_TEAM_FETCH));

    component.obtainAllTeams();

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_TEAM_FETCH);
  });

  it("should convert team name spaces to underscores", () => {
    const teamName = "Aston Martin";
    const result = component.teamNameSpaceToUnderScore(teamName);

    expect(result).toBe("Aston_Martin");
  });
});
