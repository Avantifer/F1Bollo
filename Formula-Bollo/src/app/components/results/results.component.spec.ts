import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ResultsComponent } from "./results.component";
import { CircuitApiService } from "src/shared/services/api/circuit-api.service";
import { ResultApiService } from "src/shared/services/api/result-api.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { SeasonApiService } from "src/shared/services/api/season-api.service";
import { PenaltyApiService } from "src/shared/services/api/penalty-api.service";
import { ButtonModule } from "primeng/button";
import { SidebarModule } from "primeng/sidebar";
import { of, throwError } from "rxjs";
import { Circuit } from "src/shared/models/circuit";
import { Season } from "src/shared/models/season";
import { ERROR_CIRCUIT_FETCH, ERROR_PENALTIES_FETCH, ERROR_RESULT_FETCH, ERROR_SEASON_FETCH } from "src/app/constants";
import { environment } from "src/enviroments/enviroment";
import { Penalty } from "src/shared/models/penalty";
import { Race } from "src/shared/models/race";
import { Driver } from "src/shared/models/driver";
import { Team } from "src/shared/models/team";
import { PenaltySeverity } from "src/shared/models/penaltySeverity";

describe("ResultsComponent", () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;
  let circuitApiServiceSpy: jasmine.SpyObj<CircuitApiService>;
  let resultApiServiceSpy: jasmine.SpyObj<ResultApiService>;
  let messageInfoServiceSpy: jasmine.SpyObj<MessageInfoService>;
  let seasonApiServiceSpy: jasmine.SpyObj<SeasonApiService>;
  let penaltyApiServiceSpy: jasmine.SpyObj<PenaltyApiService>;

  beforeEach(async () => {
    circuitApiServiceSpy = jasmine.createSpyObj("CircuitApiService", ["getAllCircuits"]);
    resultApiServiceSpy = jasmine.createSpyObj("ResultApiService", ["getAllResultsPerCircuit"]);
    messageInfoServiceSpy = jasmine.createSpyObj("MessageInfoService", ["showError", "showInfo", "showWarn", "showSuccess"]);
    seasonApiServiceSpy = jasmine.createSpyObj("SeasonApiService", ["getSeasons"]);
    penaltyApiServiceSpy = jasmine.createSpyObj("PenaltyApiService", ["getAllPenaltiesPerCircuit"]);

    await TestBed.configureTestingModule({
      declarations: [ResultsComponent],
      imports: [
        ButtonModule,
        SidebarModule
      ],
      providers: [
        { provide: CircuitApiService, useValue: circuitApiServiceSpy },
        { provide: ResultApiService, useValue: resultApiServiceSpy },
        { provide: MessageInfoService, useValue: messageInfoServiceSpy },
        { provide: SeasonApiService, useValue: seasonApiServiceSpy },
        { provide: PenaltyApiService, useValue: penaltyApiServiceSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call some methods on ngOnInit", () => {
    spyOn(component, "obtainAllSeasons");
    spyOn(component, "changeCircuitSelected");
    spyOn(component, "changeSeasonResults");

    component.ngOnInit();

    expect(component.obtainAllSeasons).toHaveBeenCalled();
    expect(component.changeCircuitSelected).toHaveBeenCalled();
    expect(component.changeSeasonResults).toHaveBeenCalled();
  });

  it("should fetch circuits and update the form", () => {
    const mockCircuits: Circuit[] = [
      new Circuit(1, "Montreal", "Canada", null, "", new Season(0, "Temporada 1", 1)),
      new Circuit(1, "Spa", "Belgica", null, "", new Season(0, "Temporada 1", 1))
    ];
    circuitApiServiceSpy.getAllCircuits.and.returnValue(of(mockCircuits));
    resultApiServiceSpy.getAllResultsPerCircuit.and.returnValue(of([]));

    component.getAllCircuits();

    expect(circuitApiServiceSpy.getAllCircuits).toHaveBeenCalled();
    expect(component.circuits).toEqual(mockCircuits);
    expect(component.circuitSelected).toEqual(mockCircuits[0]);
    expect(component.circuitsForm.get("circuit")?.value).toEqual(mockCircuits[0]);
  });

  it("should handle errors when fetching circuits", () => {
    const errorResponse = new Error(ERROR_CIRCUIT_FETCH);
    circuitApiServiceSpy.getAllCircuits.and.returnValue(throwError(() => errorResponse));
    spyOn(console, "log");

    component.getAllCircuits();

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_CIRCUIT_FETCH);
    expect(console.log).toHaveBeenCalledWith(errorResponse);
  });

  it("should handle errors when fetching results for a circuit", () => {
    const errorResponse = new Error(ERROR_RESULT_FETCH);
    resultApiServiceSpy.getAllResultsPerCircuit.and.returnValue(throwError(() => errorResponse));
    spyOn(console, "log");

    component.getAllResultsPerCircuit(1);

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_RESULT_FETCH);
    expect(console.log).toHaveBeenCalledWith(errorResponse);
  });

  it("should subscribe to form value changes and fetch results when circuit is selected", () => {
    const circuits: Circuit[] = [new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1))];
    component.circuits = circuits;
    component.seasonSelected = new Season(1, "Temporada 1", 1);

    spyOn(component.circuitsForm.valueChanges, "pipe").and.callThrough();
    spyOn(component.circuitsForm.valueChanges, "subscribe").and.callThrough();
    resultApiServiceSpy.getAllResultsPerCircuit.and.returnValue(of([]));

    component.changeCircuitSelected();
    component.circuitsForm.setValue({ circuit: circuits[0] });

    expect(component.circuitsForm.valueChanges.pipe).toHaveBeenCalled();
    expect(component.circuitsForm.valueChanges.subscribe).toHaveBeenCalled();
    expect(component.circuitSelected).toEqual(circuits[0]);
    expect(resultApiServiceSpy.getAllResultsPerCircuit).toHaveBeenCalledWith(1, 1);
  });

  it("should handle error when fetching results for selected circuit", () => {
    resultApiServiceSpy.getAllResultsPerCircuit.and.returnValue(throwError(() => ERROR_RESULT_FETCH));
    const circuits: Circuit[] = [ new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1))];
    component.circuits = circuits;
    component.seasonSelected = new Season(1, "Temporada 1", 1);

    component.changeCircuitSelected();
    component.circuitsForm.setValue({ circuit: circuits[0] });

    expect(resultApiServiceSpy.getAllResultsPerCircuit).toHaveBeenCalledWith(1, 1);
    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_RESULT_FETCH);
  });

  it("should handle error when fetching results for selected circuit without season", () => {
    resultApiServiceSpy.getAllResultsPerCircuit.and.returnValue(throwError(() => ERROR_RESULT_FETCH));
    const circuits: Circuit[] = [ new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1))];
    component.circuits = circuits;
    component.seasonSelected = undefined;

    component.changeCircuitSelected();
    component.circuitsForm.setValue({ circuit: circuits[0] });

    expect(resultApiServiceSpy.getAllResultsPerCircuit).toHaveBeenCalledWith(1, undefined);
    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_RESULT_FETCH);
  });

  it("should fetch all seasons and set default season on form", () => {
    const seasons: Season[] = [
      new Season(1, "Season 1", 1),
      new Season(2, "Season 2", 2)
    ];
    environment.seasonActual = new Season(2, "Season 2", 2);
    seasonApiServiceSpy.getSeasons.and.returnValue(of(seasons));
    circuitApiServiceSpy.getAllCircuits.and.returnValue(of([]));
    resultApiServiceSpy.getAllResultsPerCircuit.and.returnValue(of([]));

    component.obtainAllSeasons();

    expect(seasonApiServiceSpy.getSeasons).toHaveBeenCalled();
    expect(component.seasons).toEqual(seasons);
    expect(component.seasonSelected).toEqual(seasons.find(s => s.number === 2));
    expect(component.seasonForm.get("season")?.value).toEqual(seasons.find(s => s.number === 2));
    expect(circuitApiServiceSpy.getAllCircuits).toHaveBeenCalledWith(2);
  });

  it("should handle error when fetching seasons", () => {
    seasonApiServiceSpy.getSeasons.and.returnValue(throwError(() => ERROR_SEASON_FETCH));

    component.obtainAllSeasons();

    expect(seasonApiServiceSpy.getSeasons).toHaveBeenCalled();
    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_SEASON_FETCH);
  });

  it("should subscribe to season form value changes and fetch circuits when season is selected", () => {
    const season = new Season(2, "Season 2", 2);
    component.circuitSelected = new Circuit(1, "Circuit 1", "Country", null, "", season);
    component.changeSeasonResults();
    circuitApiServiceSpy.getAllCircuits.and.returnValue(of([]));
    resultApiServiceSpy.getAllResultsPerCircuit.and.returnValue(of([]));

    component.seasonForm.setValue({ season });

    expect(component.seasonSelected).toEqual(season);
    expect(circuitApiServiceSpy.getAllCircuits).toHaveBeenCalledWith(2);
  });

  it("should not fetch circuits if no circuit is selected", () => {
    const season = new Season(2, "Season 2", 2);
    component.circuitSelected = undefined;
    component.changeSeasonResults();

    component.seasonSelected = season;

    expect(component.seasonSelected).toEqual(season);
    expect(circuitApiServiceSpy.getAllCircuits).not.toHaveBeenCalled();
  });

  it("should fetch all penalties and display them", () => {
    const penalties: Penalty[] = [
      new Penalty(
        1,
        new Race(
          1,
          new Circuit(1, "Montreal", "Canada", null, "", new Season(0, "Temporada 1", 1)),
          new Date(),
          1,
          new Season(1, "Season 1", 1)
        ),
        new Driver(
          1,
          "Avantifer",
          18,
          new Team(
            1,
            "Aston Martin",
            "",
            "",
            new Season(1, "Season 1", 1)
          ),
          "",
          new Season(1, "Season 1", 1)
        ),
        new PenaltySeverity(
          1,
          "Leve"
        ),
        "Reason",
        new Season(1, "Season 1", 1)
      )
    ];
    const season = new Season(1, "Season 1", 1);
    const circuit = new Circuit(1, "Circuit 1", "Country", null, "", season);

    component.circuitSelected = circuit;
    component.seasonSelected = season;
    penaltyApiServiceSpy.getAllPenaltiesPerCircuit.and.returnValue(of(penalties));

    component.getAllPenaltiesDriver();

    expect(penaltyApiServiceSpy.getAllPenaltiesPerCircuit).toHaveBeenCalledWith(1, 1);
    expect(component.penalties).toEqual(penalties);
    expect(component.sidebarVisible).toBeTrue();
  });

  it("should handle error when fetching penalties", () => {
    const season = new Season(1, "Season 1", 1);
    const circuit = new Circuit(1, "Circuit 1", "Country", null, "", season);

    component.circuitSelected = circuit;
    component.seasonSelected = season;
    penaltyApiServiceSpy.getAllPenaltiesPerCircuit.and.returnValue(throwError("error"));

    component.getAllPenaltiesDriver();

    expect(penaltyApiServiceSpy.getAllPenaltiesPerCircuit).toHaveBeenCalledWith(1, 1);
    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_PENALTIES_FETCH);
  });
});
