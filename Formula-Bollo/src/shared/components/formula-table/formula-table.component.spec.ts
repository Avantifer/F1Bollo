import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormulaTableComponent } from "./formula-table.component";
import { DialogService } from "primeng/dynamicdialog";
import { FantasyDialogTeamComponent } from "src/app/components/fantasy/fantasy-dialog-team/fantasy-dialog-team.component";
import { FantasyElection } from "src/shared/models/fantasyElection";
import { Account } from "src/shared/models/account";
import { Season } from "src/shared/models/season";
import { Team } from "src/shared/models/team";
import { Driver } from "src/shared/models/driver";
import { Race } from "src/shared/models/race";
import { Circuit } from "src/shared/models/circuit";

describe("FormulaTableComponent", () => {
  let component: FormulaTableComponent;
  let fixture: ComponentFixture<FormulaTableComponent>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;

  beforeEach(async () => {
    dialogServiceSpy = jasmine.createSpyObj("DialogService", ["open"]);

    await TestBed.configureTestingModule({
      declarations: [FormulaTableComponent],
      providers: [
        { provide: DialogService, useValue: dialogServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormulaTableComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should open team dialog", () => {
    const fantasyElection = new FantasyElection(
      1,
      new Account(1, "Ferchivon", "123", "fer123@gmail.com", 0),
      new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
      new Driver(1, "AlbertoMD", 20, new Team(1, "Williams", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
      new Driver(1, "Bubapu", 10, new Team(1, "Ferrari", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
      new Team(1, "Red Bull", "", "", new Season(1, "Season 1", 1)),
      new Team(1, "Ferrari", "", "", new Season(1, "Season 1", 1)),
      new Race(1, new Circuit(1, "Spa", "Belgica", null, "", new Season(0, "Temporada 1", 1)), new Date(), 0, new Season(1, "Season 1", 1)),
      new Season(1, "Season 1", 1)
    );

    component.openTeamDialog(fantasyElection);

    expect(dialogServiceSpy.open).toHaveBeenCalledWith(FantasyDialogTeamComponent, {
      header: "Su equipo",
      data: { fantasyElection: fantasyElection },
      resizable: false,
      dismissableMask: true,
      width: "45rem",
      breakpoints: { "1199px": "94vw", "575px": "90vw" }
    });
  });
});
