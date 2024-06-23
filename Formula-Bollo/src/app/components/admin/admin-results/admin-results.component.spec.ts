import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminResultsComponent } from "./admin-results.component";
import { Router } from "@angular/router";
import { CircuitApiService } from "src/shared/services/api/circuit-api.service";
import { DriverApiService } from "src/shared/services/api/driver-api.service";
import { FantasyApiService } from "src/shared/services/api/fantasy-api.service";
import { RaceApiService } from "src/shared/services/api/race-api.service";
import { ResultApiService } from "src/shared/services/api/result-api.service";
import { SprintApiService } from "src/shared/services/api/sprint-api.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { Subject, of, throwError } from "rxjs";
import { DropdownModule } from "primeng/dropdown";
import { Result } from "src/shared/models/result";
import { Race } from "src/shared/models/race";
import { Circuit } from "src/shared/models/circuit";
import { Season } from "src/shared/models/season";
import { Driver } from "src/shared/models/driver";
import { Team } from "src/shared/models/team";
import { Position } from "src/shared/models/position";
import { Sprint } from "src/shared/models/sprint";
import { ERROR_CIRCUIT_FETCH, ERROR_DRIVER_FETCH, ERROR_RACE_FETCH, ERROR_RESULT_FETCH, WARNING_DRIVER_DUPLICATED } from "src/app/constants";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";

describe("AdminResultsComponent", () => {
  let component: AdminResultsComponent;
  let fixture: ComponentFixture<AdminResultsComponent>;
  let resultApiServiceSpy: jasmine.SpyObj<ResultApiService>;
  let circuitApiServiceSpy: jasmine.SpyObj<CircuitApiService>;
  let driverApiServiceSpy: jasmine.SpyObj<DriverApiService>;
  let raceApiServiceSpy: jasmine.SpyObj<RaceApiService>;
  let messageInfoServiceSpy: jasmine.SpyObj<MessageInfoService>;
  let fantasyApiServiceSpy: jasmine.SpyObj<FantasyApiService>;
  let sprintApiServiceSpy: jasmine.SpyObj<SprintApiService>;
  const routerSpy = { url: "/admin/results", navigate: jasmine.createSpy("navigate"), events: new Subject() };

  beforeEach(async () => {
    resultApiServiceSpy = jasmine.createSpyObj("ResultApiService", ["getAllResultsPerCircuit", "saveResults"]);
    circuitApiServiceSpy = jasmine.createSpyObj("CircuitApiService", ["getAllCircuits"]);
    driverApiServiceSpy = jasmine.createSpyObj("DriverApiService", ["getAllDrivers"]);
    raceApiServiceSpy = jasmine.createSpyObj("RaceApiService", ["getRacePerCircuit", "saveRace"]);
    messageInfoServiceSpy = jasmine.createSpyObj("MessageInfoService", ["showError", "showWarn", "showSuccess"]);
    fantasyApiServiceSpy = jasmine.createSpyObj("FantasyApiService", ["saveAllPoints", "saveAllPrices"]);
    sprintApiServiceSpy = jasmine.createSpyObj("SprintApiService", ["getAllSprintPerCircuit", "saveSprints"]);

    await TestBed.configureTestingModule({
      declarations: [AdminResultsComponent],
      imports: [
        DropdownModule,
        ReactiveFormsModule,
        CalendarModule
      ],
      providers: [
        { provide: ResultApiService, useValue: resultApiServiceSpy },
        { provide: CircuitApiService, useValue: circuitApiServiceSpy },
        { provide: DriverApiService, useValue: driverApiServiceSpy },
        { provide: RaceApiService, useValue: raceApiServiceSpy },
        { provide: MessageInfoService, useValue: messageInfoServiceSpy },
        { provide: FantasyApiService, useValue: fantasyApiServiceSpy },
        { provide: SprintApiService, useValue: sprintApiServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminResultsComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call some methods in ngOnInit", () => {
    spyOn(component, "checkIsSprint");
    spyOn(component, "getAllDrivers");
    spyOn(component, "getAllCircuits");
    spyOn(component, "createSprintForm");
    spyOn(component, "getSprintsOfCircuitSelected");
    spyOn(component, "createResultForm");
    spyOn(component, "getResultsOfCircuitSelected");

    component.ngOnInit();

    expect(component.checkIsSprint).toHaveBeenCalled();
    expect(component.getAllDrivers).toHaveBeenCalled();
    expect(component.getAllCircuits).toHaveBeenCalled();
    expect(component.createResultForm).toHaveBeenCalled();
    expect(component.getResultsOfCircuitSelected).toHaveBeenCalled();

    routerSpy.url = "admin/sprint";
    component.isSprint = true;
    component.ngOnInit();

    expect(component.createSprintForm).toHaveBeenCalled();
    expect(component.getSprintsOfCircuitSelected).toHaveBeenCalled();
  });

  it("should check if is sprint", () => {
    routerSpy.url = "admin/results";

    component.checkIsSprint();

    expect(component.isSprint).toBe(false);
  });

  it("should create resultsForm", () => {
    component.createResultForm();

    expect(component.resultsForm.controls["result20"].value).toBe("");
  });

  it("should create sprint form", () => {
    component.createSprintForm();

    expect(component.sprintsForm.controls["sprint20"].value).toBe("");
  });

  it("should find first disqualified index in results", () => {
    component.results = [
      new Result(
        1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 1, 25),
        1,
        1,
        new Season(1, "Temporada 1", 1)
      ),
      new Result(
        1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 2, 20),
        1,
        1,
        new Season(1, "Temporada 1", 1)
      ),
      new Result(
        1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        null,
        1,
        1,
        new Season(1, "Temporada 1", 1)
      ),
    ];

    expect(component.findFirstDisqualifiedIndex()).toBe(2);

    component.results = [
      new Result(
        1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 1, 25),
        1,
        1,
        new Season(1, "Temporada 1", 1)
      ),
      new Result(
        1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 2, 20),
        1,
        1,
        new Season(1, "Temporada 1", 1)
      ),
      new Result(
        1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 3, 18),
        1,
        1,
        new Season(1, "Temporada 1", 1)
      ),
    ];

    expect(component.findFirstDisqualifiedIndex()).toBe(component.results.length);
  });

  it("should find first disqualified index in sprints", () => {
    component.sprints = [
      new Sprint(1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 1, 25),
        new Season(1, "Temporada 1", 1)
      ),
      new Sprint(1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 2, 20),
        new Season(1, "Temporada 1", 1)
      ),
      new Sprint(1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        null,
        new Season(1, "Temporada 1", 1)
      ),
    ];

    expect(component.findFirstDisqualifiedIndexSprint()).toBe(2);

    component.sprints = [
      new Sprint(1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 1, 25),
        new Season(1, "Temporada 1", 1)
      ),
      new Sprint(1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 2, 20),
        new Season(1, "Temporada 1", 1)
      ),
      new Sprint(1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 3, 18),
        new Season(1, "Temporada 1", 1)
      ),
    ];

    expect(component.findFirstDisqualifiedIndexSprint()).toBe(component.sprints.length);
  });

  it("should put results in result form", () => {
    const results = [
      new Result(
        1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 1, 25),
        1,
        1,
        new Season(1, "Temporada 1", 1)
      ),
      new Result(
        1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 2, 20),
        1,
        1,
        new Season(1, "Temporada 1", 1)
      ),
      new Result(
        1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 3, 18),
        1,
        1,
        new Season(1, "Temporada 1", 1)
      ),
    ];

    component.putResultsInResultForm(results);
  });

  it("should put results in sprint form", () => {
    const sprints =[
      new Sprint(1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 1, 25),
        new Season(1, "Temporada 1", 1)
      ),
      new Sprint(1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 2, 20),
        new Season(1, "Temporada 1", 1)
      ),
      new Sprint(1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 3, 18),
        new Season(1, "Temporada 1", 1)
      ),
    ];

    component.putResultsInSprintForm(sprints);
  });

  it("should get all circuits correctly", () => {
    const circuits = [
      new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1))
    ];
    circuitApiServiceSpy.getAllCircuits.and.returnValue(of(circuits));

    component.getAllCircuits();

    expect(component.circuits).toBe(circuits);
  });

  it("should thrown an error when getting all circuits", () => {
    circuitApiServiceSpy.getAllCircuits.and.returnValue(throwError(() => ERROR_CIRCUIT_FETCH));

    component.getAllCircuits();

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_CIRCUIT_FETCH);
  });

  it("should get results of circuitSelected", () => {
    const circuit = new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1));
    spyOn(component, "getAllResultsPerCircuit");

    component.getResultsOfCircuitSelected();
    component.circuitsForm.setValue({ circuit: circuit });

    expect(component.circuitSelected).toBe(circuit);
  });

  it("should get sprints of circuit selected", () => {
    const circuit = new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1));
    spyOn(component, "getAllSprintsPerCircuit");

    component.getSprintsOfCircuitSelected();
    component.circuitsForm.setValue({ circuit: circuit });

    expect(component.circuitSelected).toBe(circuit);
  });

  it("should get all sprints per circuit correctly", () => {
    const sprints =[
      new Sprint(1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 1, 25),
        new Season(1, "Temporada 1", 1)
      ),
      new Sprint(1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 2, 20),
        new Season(1, "Temporada 1", 1)
      ),
      new Sprint(1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 3, 18),
        new Season(1, "Temporada 1", 1)
      ),
    ];
    spyOn(component, "processSprints");
    sprintApiServiceSpy.getAllSprintPerCircuit.and.returnValue(of(sprints));

    component.getAllSprintsPerCircuit(1);

    expect(component.sprints).toBe(sprints);
  });

  it("should thrown an error getting all sprints per circuit", () => {
    sprintApiServiceSpy.getAllSprintPerCircuit.and.returnValue(throwError(() => ERROR_RESULT_FETCH));

    component.getAllSprintsPerCircuit(1);

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_RESULT_FETCH);
  });

  it("should call some methods processing sprints", () => {
    const sprints =[
      new Sprint(1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 1, 25),
        new Season(1, "Temporada 1", 1)
      ),
      new Sprint(1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 2, 20),
        new Season(1, "Temporada 1", 1)
      ),
      new Sprint(1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 3, 18),
        new Season(1, "Temporada 1", 1)
      ),
    ];
    spyOn(component, "getRacePerCircuit");
    spyOn(component, "putResultsInSprintForm");

    component.processSprints(sprints, 1);

    expect(component.getRacePerCircuit).toHaveBeenCalledWith(1);
    expect(component.putResultsInSprintForm).toHaveBeenCalledWith(sprints);
  });

  it("should get all results per circuit", () =>{
    const results = [
      new Result(
        1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 1, 25),
        1,
        1,
        new Season(1, "Temporada 1", 1)
      ),
      new Result(
        1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 2, 20),
        1,
        1,
        new Season(1, "Temporada 1", 1)
      ),
      new Result(
        1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 3, 18),
        1,
        1,
        new Season(1, "Temporada 1", 1)
      ),
    ];
    spyOn(component, "processResults");
    resultApiServiceSpy.getAllResultsPerCircuit.and.returnValue(of(results));

    component.getAllResultsPerCircuit(1);

    expect(component.results).toBe(results);
  });

  it("should thrown an error getting all results per circuit", () => {
    resultApiServiceSpy.getAllResultsPerCircuit.and.returnValue(throwError(() => ERROR_RESULT_FETCH));

    component.getAllResultsPerCircuit(1);

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_RESULT_FETCH);
  });

  it("should call some methods processing results", () => {
    const results = [
      new Result(
        1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 1, 25),
        1,
        1,
        new Season(1, "Temporada 1", 1)
      ),
      new Result(
        1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 2, 20),
        1,
        1,
        new Season(1, "Temporada 1", 1)
      ),
      new Result(
        1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 3, 18),
        1,
        1,
        new Season(1, "Temporada 1", 1)
      ),
    ];
    spyOn(component, "getFastLapDriver");
    spyOn(component, "getPoleDriver");
    spyOn(component, "getRacePerCircuit");
    spyOn(component, "putResultsInResultForm");

    component.processResults(results, 1);

    expect(component.getFastLapDriver).toHaveBeenCalled();
    expect(component.getPoleDriver).toHaveBeenCalled();
    expect(component.getRacePerCircuit).toHaveBeenCalled();
    expect(component.putResultsInResultForm).toHaveBeenCalled();
  });

  it("should get fast lap driver", () => {
    const results = [
      new Result(
        1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 1, 25),
        1,
        1,
        new Season(1, "Temporada 1", 1)
      ),
      new Result(
        1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "AlbertoMD", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 2, 20),
        0,
        0,
        new Season(1, "Temporada 1", 1)
      ),
      new Result(
        1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Bubapu", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 3, 18),
        0,
        0,
        new Season(1, "Temporada 1", 1)
      ),
    ];

    const resultExpected = new Result(
      1,
      new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
      new Position(1, 1, 25),
      1,
      1,
      new Season(1, "Temporada 1", 1)
    );

    component.getFastLapDriver(results);

    expect(component.fastLapForm.get("fastlap")?.value.driver).toEqual(resultExpected.driver);
  });

  it("shouldn't get any fast lap driver", () => {
    const results = [
      new Result(
        1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 1, 25),
        0,
        0,
        new Season(1, "Temporada 1", 1)
      ),
    ];

    component.getFastLapDriver(results);
  });

  it("should get pole driver", () => {
    const results = [
      new Result(
        1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 1, 25),
        1,
        1,
        new Season(1, "Temporada 1", 1)
      ),
      new Result(
        1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "AlbertoMD", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 2, 20),
        0,
        0,
        new Season(1, "Temporada 1", 1)
      ),
      new Result(
        1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Bubapu", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 3, 18),
        0,
        0,
        new Season(1, "Temporada 1", 1)
      ),
    ];

    const resultExpected = new Result(
      1,
      new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
      new Position(1, 1, 25),
      1,
      1,
      new Season(1, "Temporada 1", 1)
    );

    component.getPoleDriver(results);

    expect(component.poleForm.get("pole")?.value.driver).toEqual(resultExpected.driver);
  });

  it("shouldn't get any pole driver", () => {
    const results = [
      new Result(
        1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(1, 1, 25),
        0,
        0,
        new Season(1, "Temporada 1", 1)
      ),
    ];

    component.getPoleDriver(results);
  });

  it("should get all drivers correctly", () => {
    const drivers = [
      new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1))
    ];
    driverApiServiceSpy.getAllDrivers.and.returnValue(of(drivers));

    component.getAllDrivers();

    expect(component.drivers).toBe(drivers);
  });

  it("should thrown an error getting all drivers", () => {
    driverApiServiceSpy.getAllDrivers.and.returnValue(throwError(() => ERROR_DRIVER_FETCH));

    component.getAllDrivers();

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_DRIVER_FETCH);
  });

  it("should get race per circuit correctly", () => {
    const races = [
      new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      new Race(2, new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
    ];
    raceApiServiceSpy.getRacePerCircuit.and.returnValue(of(races));

    component.getRacePerCircuit(1);

    expect(component.raceSelected).toBe(races[0]);
    expect(component.raceDate).toEqual(races[0].dateStart);
  });

  it("should get race per circuit empty", () => {
    raceApiServiceSpy.getRacePerCircuit.and.returnValue(of([]));

    component.getRacePerCircuit(1);

    expect(component.raceSelected).toBe(undefined);
  });

  it("should thrown an error getting race per circuit", () => {
    raceApiServiceSpy.getRacePerCircuit.and.returnValue(throwError(() => ERROR_RACE_FETCH));

    component.getRacePerCircuit(1);

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_RACE_FETCH);
  });

  it("should not create sprints if circuitSelected is undefined", () => {
    component.circuitSelected = undefined;
    component.createSprints();
    expect(raceApiServiceSpy.getRacePerCircuit).not.toHaveBeenCalled();
  });

  it("should create sprints correctly", () => {
    component.circuitSelected = new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1));
    const races = new Race(2, new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1));
    raceApiServiceSpy.getRacePerCircuit.and.returnValue(of([races]));
    driverApiServiceSpy.getAllDrivers.and.returnValue(of([]));
    circuitApiServiceSpy.getAllCircuits.and.returnValue(of([]));
    sprintApiServiceSpy.saveSprints.and.returnValue(of("success"));

    fixture.detectChanges();
    component.createSprints();

    expect(raceApiServiceSpy.getRacePerCircuit).toHaveBeenCalledWith(2);
  });

  it("should thrown error when creating sprints", () => {
    component.circuitSelected = new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1));
    raceApiServiceSpy.getRacePerCircuit.and.returnValue(throwError(() => ERROR_RACE_FETCH));

    component.createSprints();

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_RACE_FETCH);
  });

  it("should show warning if there are duplicated drivers", () => {
    component.circuitSelected = new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1));
    const race = new Race(2, new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1));
    raceApiServiceSpy.getRacePerCircuit.and.returnValue(of([race]));
    driverApiServiceSpy.getAllDrivers.and.returnValue(of([]));
    circuitApiServiceSpy.getAllCircuits.and.returnValue(of([]));
    sprintApiServiceSpy.saveSprints.and.returnValue(of("success"));
    spyOn(component, "comprobateIfDuplicatedDriverSprint").and.returnValue(true);

    component.createSprints();

    expect(messageInfoServiceSpy.showWarn).toHaveBeenCalledWith(WARNING_DRIVER_DUPLICATED);
  });

  it("should not create sprints if circuitSelected is undefined", () => {
    component.circuitSelected = undefined;
    component.createResults();
    expect(raceApiServiceSpy.getRacePerCircuit).not.toHaveBeenCalled();
  });

  it("should create results correctly", () => {
    const races = new Race(2, new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1));
    component.circuitSelected = new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1));
    component.raceSelected = races;
    raceApiServiceSpy.getRacePerCircuit.and.returnValue(of([races]));
    driverApiServiceSpy.getAllDrivers.and.returnValue(of([]));
    circuitApiServiceSpy.getAllCircuits.and.returnValue(of([]));
    fantasyApiServiceSpy.saveAllPoints.and.returnValue(of("success"));
    fantasyApiServiceSpy.saveAllPrices.and.returnValue(of("success"));
    resultApiServiceSpy.saveResults.and.returnValue(of("success"));

    fixture.detectChanges();
    component.createResults();

    expect(raceApiServiceSpy.getRacePerCircuit).toHaveBeenCalledWith(2);
  });

  it("should thrown error when creating results", () => {
    component.circuitSelected = new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1));
    raceApiServiceSpy.getRacePerCircuit.and.returnValue(throwError(() => ERROR_RACE_FETCH));

    component.createResults();

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_RACE_FETCH);
  });

  it("should show warning if there are duplicated drivers", () => {
    component.circuitSelected = new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1));
    const race = new Race(2, new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1));
    raceApiServiceSpy.getRacePerCircuit.and.returnValue(of([race]));
    driverApiServiceSpy.getAllDrivers.and.returnValue(of([]));
    circuitApiServiceSpy.getAllCircuits.and.returnValue(of([]));
    resultApiServiceSpy.saveResults.and.returnValue(of("success"));
    spyOn(component, "comprobateIfDuplicatedDriver").and.returnValue(true);

    component.createResults();

    expect(messageInfoServiceSpy.showWarn).toHaveBeenCalledWith(WARNING_DRIVER_DUPLICATED);
  });

  it("should handle error when saving sprints", () => {
    const sprints = [new Sprint(1, null, new Driver(1, "Driver1", 1, new Team(1, "Team1", "", "", new Season(1, "Season1", 1)), "", new Season(1, "Season1", 1)), null)];
    const errorResponse = { error: "Error saving sprints" };

    sprintApiServiceSpy.saveSprints.and.returnValue(throwError(() => errorResponse));

    component.saveAllSprints(sprints);

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith("Error saving sprints");
  });

  it("should handle error when saving results", () => {
    const results = [new Result( 1, new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)), new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)), null, 1, 1, new Season(1, "Temporada 1", 1) )];
    const errorResponse = { error: "Error saving results" };

    resultApiServiceSpy.saveResults.and.returnValue(throwError(() => errorResponse));

    component.saveAllResults(results);

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith("Error saving results");
  });

  it("should add non-disqualified drivers to sprintsToSave", () => {
    const race = new Race(1, new Circuit(1, "Circuit1", "Country1", null, null, new Season(1, "Season1", 1)), new Date(), 1, new Season(1, "Season1", 1));

    const driver1 = new Driver(1, "Driver1", 1, new Team(1, "Team1", "", "", new Season(1, "Season1", 1)), "", new Season(1, "Season1", 1));
    const driver2 = new Driver(2, "Driver2", 2, new Team(2, "Team2", "", "", new Season(1, "Season1", 1)), "", new Season(1, "Season1", 1));
    const driver3 = new Driver(3, "Driver3", 3, new Team(3, "Team3", "", "", new Season(1, "Season1", 1)), "", new Season(1, "Season1", 1));

    component.drivers = [driver1, driver2, driver3];

    const sprintsToSave: Sprint[] = [
      new Sprint(1, race, driver1, null)
    ];

    component.comprobateDriversToBeDisqualifiedSprint(sprintsToSave, race);

    expect(sprintsToSave.length).toBe(3);
    expect(sprintsToSave).toContain(jasmine.objectContaining({ driver: driver2 }));
    expect(sprintsToSave).toContain(jasmine.objectContaining({ driver: driver3 }));
  });

  it("should add non-disqualified drivers to resultsToSave", () => {
    const race = new Race(1, new Circuit(1, "Circuit1", "Country1", null, null, new Season(1, "Season1", 1)), new Date(), 1, new Season(1, "Season1", 1));

    const driver1 = new Driver(1, "Driver1", 1, new Team(1, "Team1", "", "", new Season(1, "Season1", 1)), "", new Season(1, "Season1", 1));
    const driver2 = new Driver(2, "Driver2", 2, new Team(2, "Team2", "", "", new Season(1, "Season1", 1)), "", new Season(1, "Season1", 1));
    const driver3 = new Driver(3, "Driver3", 3, new Team(3, "Team3", "", "", new Season(1, "Season1", 1)), "", new Season(1, "Season1", 1));

    component.drivers = [driver1, driver2, driver3];

    const resultsToSave: Result[] = [
      new Result(1, race, driver1, null, 0, 0)
    ];

    component.comprobateDriversToBeDisqualified(resultsToSave, race);

    expect(resultsToSave.length).toBe(3);
    expect(resultsToSave).toContain(jasmine.objectContaining({ driver: driver2 }));
    expect(resultsToSave).toContain(jasmine.objectContaining({ driver: driver3 }));
  });

  it("should correctly set fastlap and pole of drivers for disqualified drivers", () => {
    const race = new Race(1, new Circuit(1, "Circuit1", "Country1", null, null, new Season(1, "Season1", 1)), new Date(), 1, new Season(1, "Season1", 1));

    const driver1 = new Driver(1, "Driver1", 1, new Team(1, "Team1", "", "", new Season(1, "Season1", 1)), "", new Season(1, "Season1", 1));
    const driver2 = new Driver(2, "Driver2", 2, new Team(2, "Team2", "", "", new Season(1, "Season1", 1)), "", new Season(1, "Season1", 1));

    component.drivers = [driver1, driver2];

    component.fastLapForm.get("fastlap")?.setValue(driver1);
    component.poleForm.get("pole")?.setValue(driver2);

    const resultsToSave: Result[] = [
      new Result(1, race, driver1, null, 0, 0)
    ];

    component.comprobateDriversToBeDisqualified(resultsToSave, race);

    expect(resultsToSave.length).toBe(2);
    expect(resultsToSave).toContain(jasmine.objectContaining({ driver: driver2, fastlap: 0, pole: 1 }));
  });

  it("should correctly set fastlap and pole of results for disqualified drivers", () => {
    const race = new Race(1, new Circuit(1, "Circuit1", "Country1", null, null, new Season(1, "Season1", 1)), new Date(), 1, new Season(1, "Season1", 1));

    const driver1 = new Driver(1, "Driver1", 1, new Team(1, "Team1", "", "", new Season(1, "Season1", 1)), "", new Season(1, "Season1", 1));
    const driver2 = new Driver(2, "Driver2", 2, new Team(2, "Team2", "", "", new Season(1, "Season1", 1)), "", new Season(1, "Season1", 1));

    const result1 = new Result(1, race, driver1, null, 1, 1);
    const result2 = new Result(2, race, driver2, null, 0, 0);

    component.drivers = [driver1, driver2];

    component.fastLapForm.get("fastlap")?.setValue(result1);
    component.poleForm.get("pole")?.setValue(result2);

    const resultsToSave: Result[] = [
      new Result(2, race, driver2, null, 0, 0),
    ];

    component.comprobateDriversToBeDisqualified(resultsToSave, race);

    expect(resultsToSave.length).toBe(2);
  });

  it("should correctly set fastlap and pole when fastlap and pole values have driver property", () => {
    const race = new Race(1, new Circuit(1, "Circuit1", "Country1", null, null, new Season(1, "Season1", 1)), new Date(), 1, new Season(1, "Season1", 1));

    const driver1 = new Driver(1, "Driver1", 1, new Team(1, "Team1", "", "", new Season(1, "Season1", 1)), "", new Season(1, "Season1", 1));
    const driver2 = new Driver(2, "Driver2", 2, new Team(2, "Team2", "", "", new Season(1, "Season1", 1)), "", new Season(1, "Season1", 1));

    component.drivers = [driver1, driver2];

    component.fastLapForm.get("fastlap")?.setValue({ driver: driver1 });
    component.poleForm.get("pole")?.setValue({ driver: driver2 });

    const resultsToSave: Result[] = [
      new Result(1, race, driver1, null, 0, 0)
    ];

    component.comprobateDriversToBeDisqualified(resultsToSave, race);

    expect(resultsToSave.length).toBe(2);
    expect(resultsToSave).toContain(jasmine.objectContaining({ driver: driver2, fastlap: 0, pole: 1 }));
  });

  it("should correctly set fastlap and pole when fastlap and pole values have name property", () => {
    const race = new Race(1, new Circuit(1, "Circuit1", "Country1", null, null, new Season(1, "Season1", 1)), new Date(), 1, new Season(1, "Season1", 1));

    const driver1 = new Driver(1, "Driver1", 1, new Team(1, "Team1", "", "", new Season(1, "Season1", 1)), "", new Season(1, "Season1", 1));
    const driver2 = new Driver(2, "Driver2", 2, new Team(2, "Team2", "", "", new Season(1, "Season1", 1)), "", new Season(1, "Season1", 1));

    component.drivers = [driver2, driver1];

    component.fastLapForm.get("fastlap")?.setValue(driver2);
    component.poleForm.get("pole")?.setValue(driver2);

    const resultsToSave: Result[] = [
      new Result(1, race, driver1, null, 0, 0)
    ];

    component.comprobateDriversToBeDisqualified(resultsToSave, race);

    expect(resultsToSave.length).toBe(2);
  });

  it("should create sprints with multiple driver values", () => {
    const driver1 = new Driver(1, "Driver1", 1, new Team(1, "Team1", "", "", new Season(1, "Season1", 1)), "", new Season(1, "Season1", 1));
    const driver2 = new Driver(2, "Driver2", 2, new Team(2, "Team2", "", "", new Season(1, "Season1", 1)), "", new Season(1, "Season1", 1));
    const race = new Race(1, new Circuit(1, "Circuit1", "Country1", null, null, new Season(1, "Season1", 1)), new Date(), 1, new Season(1, "Season1", 1));

    component.sprintsForm = new FormGroup({
      sprint1: new FormControl(driver1),
      sprint2: new FormControl(driver2),
    });

    const resultsToSave: Sprint[] = [];

    component.createEverySprint(resultsToSave, race);

    expect(resultsToSave.length).toBe(2);
    expect(resultsToSave[0].driver).toBe(driver1);
    expect(resultsToSave[1].driver).toBe(driver2);
  });

  it("should not create sprints when the form is empty", () => {
    component.sprintsForm = new FormGroup({
      sprint1: new FormControl(null)
    });
    const race = new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Season 1", 1)), new Date(), 1, new Season(1, "Season 1", 1));
    const resultsToSave: Sprint[] = [];

    component.createEverySprint(resultsToSave, race);

    expect(resultsToSave.length).toBe(0);
  });

  it("should create sprints with multiple sprint values", () => {
    const sprints = [
      new Sprint(0,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Season 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(0, 1, 0),
        undefined
      ),
      new Sprint(0,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Season 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        null,
        undefined
      )
    ];
    const race = new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Season 1", 1)), new Date(), 1, new Season(1, "Season 1", 1));
    component.sprints = sprints;
    component.sprintsForm = new FormGroup({
      sprint1: new FormControl(sprints[0]),
      sprint2: new FormControl(sprints[1])
    });

    const resultsToSave: Sprint[] = [];

    component.createEverySprint(resultsToSave, race);

    expect(resultsToSave.length).toBe(2);
    expect(resultsToSave[0].race?.circuit.name).toEqual(sprints[0].race?.circuit.name);
  });

  it("should create results with multiple driver values", () => {
    const driver1 = new Driver(1, "Driver1", 1, new Team(1, "Team1", "", "", new Season(1, "Season1", 1)), "", new Season(1, "Season1", 1));
    const driver2 = new Driver(2, "Driver2", 2, new Team(2, "Team2", "", "", new Season(1, "Season1", 1)), "", new Season(1, "Season1", 1));
    const race = new Race(1, new Circuit(1, "Circuit1", "Country1", null, null, new Season(1, "Season1", 1)), new Date(), 1, new Season(1, "Season1", 1));

    component.resultsForm = new FormGroup({
      result1: new FormControl(driver1),
      result2: new FormControl(driver2),
    });
    component.fastLapForm.get("fastlap")?.setValue(driver1);
    component.poleForm.get("pole")?.setValue(driver1);

    const resultsToSave: Result[] = [];

    component.createEveryResult(resultsToSave, race);

    expect(resultsToSave.length).toBe(2);
    expect(resultsToSave[0].driver).toBe(driver1);
    expect(resultsToSave[1].driver).toBe(driver2);
  });

  it("should not create results when the form is empty", () => {
    component.resultsForm = new FormGroup({
      result1: new FormControl(null)
    });

    const race = new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Season 1", 1)), new Date(), 1, new Season(1, "Season 1", 1));
    const resultsToSave: Result[] = [];

    component.createEveryResult(resultsToSave, race);

    expect(resultsToSave.length).toBe(0);
  });

  it("should create results with multiple results values", () => {
    const results = [
      new Result(
        0,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(0, 3, 0),
        1,
        1,
        new Season(1, "Temporada 1", 1)
      ),
      new Result(
        0,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(2, "Bubapu", 30, new Team(1, "Ferrari", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        null,
        0,
        0,
        new Season(1, "Temporada 1", 1)
      ),
    ];
    const race = new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1));
    component.results = results;
    component.resultsForm = new FormGroup({
      result1: new FormControl(results[0]),
      result2: new FormControl(results[1]),
    });

    component.fastLapForm.get("fastlap")?.setValue(results[1]);
    component.poleForm.get("pole")?.setValue(results[1]);

    const resultsToSave: Result[] = [];

    component.createEveryResult(resultsToSave, race);

    expect(resultsToSave.length).toBe(2);
  });

  it("should comprobate if there is duplicated drivers in sprints", () => {
    const sprints = [
      new Sprint(0,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Season 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(0, 1, 0),
        undefined
      ),
      new Sprint(0,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Season 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        null,
        undefined
      )
    ];

    expect(component.comprobateIfDuplicatedDriverSprint(sprints)).toBeTrue();
  });

  it("it should comprobate if there is duplicated drivers in results", () =>{
    const results = [
      new Result(
        0,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new Position(0, 3, 0),
        1,
        1,
        new Season(1, "Temporada 1", 1)
      ),
      new Result(
        0,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        null,
        0,
        0,
        new Season(1, "Temporada 1", 1)
      ),
    ];

    expect(component.comprobateIfDuplicatedDriver(results)).toBeTrue();

  });

  it("should handle error when saving fantasy points", () => {
    const errorResponse = { error: "Error saving sprints" };

    fantasyApiServiceSpy.saveAllPoints.and.returnValue(throwError(() => errorResponse));

    component.saveAllFantasy(1);

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith("Error saving sprints");
  });

  it("should handle error when saving fantasy prices", () => {
    const errorResponse = { error: "Error saving results" };

    fantasyApiServiceSpy.saveAllPrices.and.returnValue(throwError(() => errorResponse));

    component.saveFantasyPrices(1);

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith("Error saving results");
  });
});
