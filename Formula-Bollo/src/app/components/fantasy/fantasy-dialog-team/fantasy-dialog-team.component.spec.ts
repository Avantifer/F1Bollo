import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FantasyDialogTeamComponent } from "./fantasy-dialog-team.component";
import { FantasyService } from "src/shared/services/fantasy.service";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { FantasyElection } from "src/shared/models/fantasyElection";
import { Account } from "src/shared/models/account";
import { Driver } from "src/shared/models/driver";
import { Team } from "src/shared/models/team";
import { Season } from "src/shared/models/season";
import { Race } from "src/shared/models/race";
import { Circuit } from "src/shared/models/circuit";

describe("FantasyDialogTeamComponent", () => {
  let component: FantasyDialogTeamComponent;
  let fixture: ComponentFixture<FantasyDialogTeamComponent>;
  let fantasyServiceSpy: jasmine.SpyObj<FantasyService>;
  let configSpy: jasmine.SpyObj<DynamicDialogConfig>;

  beforeEach(async () => {
    fantasyServiceSpy = jasmine.createSpyObj("FantasyService", ["getSpecificPointsPerDriver", "getSpecificPointsPerTeam"]);
    configSpy = jasmine.createSpyObj("DynamicDialogConfig", ["data"]);

    await TestBed.configureTestingModule({
      declarations: [FantasyDialogTeamComponent],
      providers:[
        { provide: FantasyService, useValue: fantasyServiceSpy },
        { provide: DynamicDialogConfig, useValue: configSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FantasyDialogTeamComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call some methods on ngOnInit", () => {
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
    component.config.data = fantasyElection;
    spyOn(component, "getSpecificPointsPerDriver");
    spyOn(component, "getSpecificPointsPerTeam");

    component.ngOnInit();

    expect(component.getSpecificPointsPerDriver).toHaveBeenCalled();
    expect(component.getSpecificPointsPerTeam).toHaveBeenCalled();
  });

  it("should get specific points per driver correctly", () => {
    fantasyServiceSpy.getSpecificPointsPerDriver.and.returnValue([1]);
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

    component.getSpecificPointsPerDriver(fantasyElection);

    expect(component.pointsDriverArray).toEqual([1]);
  });

  it("should get specific points per team correctly", () => {
    fantasyServiceSpy.getSpecificPointsPerTeam.and.returnValue([1]);
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

    component.getSpecificPointsPerTeam(fantasyElection);

    expect(component.pointsTeamArray).toEqual([1]);
  });
});
