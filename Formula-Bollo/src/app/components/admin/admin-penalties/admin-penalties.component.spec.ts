import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminPenaltiesComponent } from "./admin-penalties.component";
import { DriverApiService } from "src/shared/services/api/driver-api.service";
import { PenaltyApiService } from "src/shared/services/api/penalty-api.service";
import { PenaltySeverityApiService } from "src/shared/services/api/penaltySeverity-api.service";
import { RaceApiService } from "src/shared/services/api/race-api.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { DropdownModule } from "primeng/dropdown";
import { Race } from "src/shared/models/race";
import { Circuit } from "src/shared/models/circuit";
import { Season } from "src/shared/models/season";
import { of, throwError } from "rxjs";
import { ERROR_DRIVER_FETCH, ERROR_PENALTIES_FETCH, ERROR_PENALTY_TYPE_FETCH, ERROR_RACE_FETCH, ERROR_SAVE } from "src/app/constants";
import { PenaltySeverity } from "src/shared/models/penaltySeverity";
import { Driver } from "src/shared/models/driver";
import { Team } from "src/shared/models/team";
import { DriverPenalties } from "src/shared/models/driverPenalty";
import { RacePenalties } from "src/shared/models/racePenalty";
import { Penalty } from "src/shared/models/penalty";

describe("AdminPenaltiesComponent", () => {
  let component: AdminPenaltiesComponent;
  let fixture: ComponentFixture<AdminPenaltiesComponent>;
  let driverApiServiceSpy: jasmine.SpyObj<DriverApiService>;
  let penaltyApiServiceSpy: jasmine.SpyObj<PenaltyApiService>;
  let penaltySeverityApiServiceSpy: jasmine.SpyObj<PenaltySeverityApiService>;
  let raceApiServiceSpy: jasmine.SpyObj<RaceApiService>;
  let messageInfoServiceSpy: jasmine.SpyObj<MessageInfoService>;

  beforeEach(async () => {
    driverApiServiceSpy = jasmine.createSpyObj("DriverApiService", ["getAllDrivers"]);
    penaltyApiServiceSpy = jasmine.createSpyObj("PenaltyApiService", ["getAllPenaltiesPerDriver", "getPenaltyByDriverAndRaceAndSeverity", "savePenalties"]);
    penaltySeverityApiServiceSpy = jasmine.createSpyObj("PenaltySeverityApiService", ["getAllPenalties"]);
    raceApiServiceSpy = jasmine.createSpyObj("RaceApiService", ["getAllPrevious"]);
    messageInfoServiceSpy = jasmine.createSpyObj("MessageInfoService", ["showError", "showSuccess"]);

    await TestBed.configureTestingModule({
      declarations: [AdminPenaltiesComponent],
      imports: [ DropdownModule ],
      providers: [
        { provide: DriverApiService, useValue: driverApiServiceSpy },
        { provide: PenaltyApiService, useValue: penaltyApiServiceSpy },
        { provide: PenaltySeverityApiService, useValue: penaltySeverityApiServiceSpy },
        { provide: RaceApiService, useValue: raceApiServiceSpy },
        { provide: MessageInfoService, useValue: messageInfoServiceSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPenaltiesComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call some methods on ngOnInit", () => {
    spyOn(component, "getAllRaces");
    spyOn(component, "getAllDrivers");
    spyOn(component, "getAllPenaltiesSeverity");
    spyOn(component, "getAllPenaltiesPerDriver");
    spyOn(component, "getRaceSelected");
    spyOn(component, "getDriverSelected");
    spyOn(component, "getPenaltySeveritySelected");

    component.ngOnInit();

    expect(component.getAllRaces).toHaveBeenCalled();
    expect(component.getAllDrivers).toHaveBeenCalled();
    expect(component.getAllPenaltiesSeverity).toHaveBeenCalled();
    expect(component.getAllPenaltiesPerDriver).toHaveBeenCalled();
    expect(component.getRaceSelected).toHaveBeenCalled();
    expect(component.getDriverSelected).toHaveBeenCalled();
    expect(component.getPenaltySeveritySelected).toHaveBeenCalled();
  });

  it("should get all races correctly", () => {
    const races = [
      new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
      new Race(2, new Circuit(2, "Spa", "Belgica", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
    ];
    raceApiServiceSpy.getAllPrevious.and.returnValue(of(races));

    component.getAllRaces();

    expect(component.races).toBe(races);
  });

  it("should thrown an error when getting all races", () => {
    raceApiServiceSpy.getAllPrevious.and.returnValue(throwError(() => ERROR_RACE_FETCH));

    component.getAllRaces();

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_RACE_FETCH);
  });

  it("should get all penalties severity correctly", () => {
    const penaltySeverity = [
      new PenaltySeverity(1, "Aviso"),
      new PenaltySeverity(2, "Leve"),
      new PenaltySeverity(3, "Grave"),
    ];
    penaltySeverityApiServiceSpy.getAllPenalties.and.returnValue(of(penaltySeverity));

    component.getAllPenaltiesSeverity();

    expect(component.penaltiesSeverity).toBe(penaltySeverity);
  });

  it("should thrown an error getting all penalties severity", () => {
    penaltySeverityApiServiceSpy.getAllPenalties.and.returnValue(throwError(() => ERROR_PENALTY_TYPE_FETCH));

    component.getAllPenaltiesSeverity();

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_PENALTY_TYPE_FETCH);
  });

  it("should get race selected", () => {
    const race = new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1));
    component.getRaceSelected();
    component.raceForm.setValue({ race: race });

    expect(component.raceSelected).toBe(race);
  });

  it("should get race selected and call getPenaltyPerDriverAndRaceAndSeverity", () => {
    const race = new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1));
    spyOn(component, "getPenaltyPerDriverAndRaceAndSeverity");

    component.driverSelected = new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1));
    component.penaltySeveritySelected = new PenaltySeverity(1, "Leve");
    component.getRaceSelected();
    component.raceForm.setValue({ race: race });

    expect(component.raceSelected).toBe(race);
  });

  it("should get all drivers", () => {
    const drivers = [
      new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1))
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

  it("should get drivers selected", () => {
    const driver = new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1));

    component.getDriverSelected();
    component.driverForm.setValue({ driver: driver });

    expect(component.driverSelected).toBe(driver);
  });

  it("should get driver selected and call getPenaltyPerDriverAndRaceAndSeverity", () => {
    const driver = new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1));
    spyOn(component, "getPenaltyPerDriverAndRaceAndSeverity");

    component.raceSelected = new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1));
    component.penaltySeveritySelected = new PenaltySeverity(1, "Leve");
    component.getDriverSelected();
    component.driverForm.setValue({ driver: driver });

    expect(component.driverSelected).toBe(driver);
  });

  it("should get penalty severity selected", () => {
    const penaltySeverity = new PenaltySeverity(1, "Leve");

    component.getPenaltySeveritySelected();
    component.penaltySeverityForm.setValue({ penaltySeverity: penaltySeverity });

    expect(component.penaltySeveritySelected).toBe(penaltySeverity);
  });

  it("should get penalty severity selected and call getPenaltyPerDriverAndRaceAndSeverity", () => {
    const penaltySeverity = new PenaltySeverity(1, "Leve");
    spyOn(component, "getPenaltyPerDriverAndRaceAndSeverity");

    component.raceSelected = new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1));
    component.driverSelected = new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1));
    component.getPenaltySeveritySelected();
    component.penaltySeverityForm.setValue({ penaltySeverity: penaltySeverity });

    expect(component.penaltySeveritySelected).toBe(penaltySeverity);
  });

  it("should get all penalties per driver", () => {
    const driverPenalties = [
      new DriverPenalties(
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        [new RacePenalties(
          new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
          [ new Penalty(
            1,
            new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
            new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
            new PenaltySeverity(1, "Leve"),
            "Porque si",
            new Season(1, "Temporada 1", 1)
          )]
        )]
      )
    ];
    penaltyApiServiceSpy.getAllPenaltiesPerDriver.and.returnValue(of(driverPenalties));

    component.getAllPenaltiesPerDriver();

    expect(component.penalties).toBe(driverPenalties);
  });

  it("should thrown an error gettin all penalties per driver", () => {
    penaltyApiServiceSpy.getAllPenaltiesPerDriver.and.returnValue(throwError(() => ERROR_PENALTIES_FETCH));

    component.getAllPenaltiesPerDriver();

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_PENALTIES_FETCH);
  });

  it("should return early if driver.id, race.id, or penaltySeverity.id is undefined", () => {
    const driver = new Driver(1, "DriverName", 18, new Team(1, "TeamName", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1));
    const race = new Race(1, new Circuit(1, "CircuitName", "Country", null, "", new Season(1, "Season 1", 1)), new Date(), 1, new Season(1, "Season 1", 1));
    const penaltySeverity = new PenaltySeverity(1, "SeverityName");

    driver.id = undefined as unknown as number;
    component.getPenaltyPerDriverAndRaceAndSeverity(driver, race, penaltySeverity);
    expect(penaltyApiServiceSpy.getPenaltyByDriverAndRaceAndSeverity).not.toHaveBeenCalled();

    driver.id = 1;
    race.id = undefined  as unknown as number;
    component.getPenaltyPerDriverAndRaceAndSeverity(driver, race, penaltySeverity);
    expect(penaltyApiServiceSpy.getPenaltyByDriverAndRaceAndSeverity).not.toHaveBeenCalled();

    race.id = 1;
    penaltySeverity.id = undefined  as unknown as number;
    component.getPenaltyPerDriverAndRaceAndSeverity(driver, race, penaltySeverity);
    expect(penaltyApiServiceSpy.getPenaltyByDriverAndRaceAndSeverity).not.toHaveBeenCalled();
  });

  it("should set reasonSelected and reasonForm to empty strings when no penalties are returned", () => {
    const driver = new Driver(1, "DriverName", 18, new Team(1, "TeamName", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1));
    const race = new Race(1, new Circuit(1, "CircuitName", "Country", null, "", new Season(1, "Season 1", 1)), new Date(), 1, new Season(1, "Season 1", 1));
    const penaltySeverity = new PenaltySeverity(1, "SeverityName");

    penaltyApiServiceSpy.getPenaltyByDriverAndRaceAndSeverity.and.returnValue(of([]));
    component.getPenaltyPerDriverAndRaceAndSeverity(driver, race, penaltySeverity);

    expect(component.reasonSelected).toBe("");
    expect(component.reasonForm.get("reason")?.value).toBe("");
  });

  it("should replace undefined in reasonSelected if present", () => {
    const driver = new Driver(1, "DriverName", 18, new Team(1, "TeamName", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1));
    const race = new Race(1, new Circuit(1, "CircuitName", "Country", null, "", new Season(1, "Season 1", 1)), new Date(), 1, new Season(1, "Season 1", 1));
    const penaltySeverity = new PenaltySeverity(1, "SeverityName");
    const penalties = [
      new Penalty(1, race, driver, penaltySeverity, "Reason 1. undefined"),
      new Penalty(2, race, driver, penaltySeverity, "Reason 2."),
    ];

    penaltyApiServiceSpy.getPenaltyByDriverAndRaceAndSeverity.and.returnValue(of(penalties));
    component.getPenaltyPerDriverAndRaceAndSeverity(driver, race, penaltySeverity);

    expect(component.reasonSelected).toBe("Reason 1. \r\n\rReason 2.");
    expect(component.reasonForm.get("reason")?.value).toBe("Reason 1. \r\n\rReason 2.");
  });

  it("should set penaltiesSelected, format reasonSelected, and update reasonForm when penalties are returned", () => {
    const driver = new Driver(1, "DriverName", 18, new Team(1, "TeamName", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1));
    const race = new Race(1, new Circuit(1, "CircuitName", "Country", null, "", new Season(1, "Season 1", 1)), new Date(), 1, new Season(1, "Season 1", 1));
    const penaltySeverity = new PenaltySeverity(1, "SeverityName");
    const penalties = [
      new Penalty(1, race, driver, penaltySeverity, "Reason 1."),
      new Penalty(2, race, driver, penaltySeverity, "Reason 2."),
    ];

    penaltyApiServiceSpy.getPenaltyByDriverAndRaceAndSeverity.and.returnValue(of(penalties));
    component.getPenaltyPerDriverAndRaceAndSeverity(driver, race, penaltySeverity);

    expect(component.penaltiesSelected).toBe(penalties);
    expect(component.reasonSelected).toBe("Reason 1.\r\n\rReason 2.");
    expect(component.reasonForm.get("reason")?.value).toBe("Reason 1.\r\n\rReason 2.");
  });

  it("should call messageInfoService.showError on error", () => {
    const driver = new Driver(1, "DriverName", 18, new Team(1, "TeamName", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1));
    const race = new Race(1, new Circuit(1, "CircuitName", "Country", null, "", new Season(1, "Season 1", 1)), new Date(), 1, new Season(1, "Season 1", 1));
    const penaltySeverity = new PenaltySeverity(1, "SeverityName");

    penaltyApiServiceSpy.getPenaltyByDriverAndRaceAndSeverity.and.returnValue(throwError(() => ERROR_PENALTIES_FETCH));
    component.getPenaltyPerDriverAndRaceAndSeverity(driver, race, penaltySeverity);

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_PENALTIES_FETCH);
  });

  it("should call createPenaltiesToSave and savePenaltiesArray with the correct arguments", () => {
    const penalties = [
      new Penalty(
        0,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Season 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        new PenaltySeverity(1, "Leve"),
        "Reason"
      )
    ];
    component.reasonForm.setValue({ reason: "Reason"});
    spyOn(component, "createPenaltiesToSave").and.returnValue(penalties);
    spyOn(component, "savePenaltiesArray");

    component.savePenalty();

    expect(component.createPenaltiesToSave).toHaveBeenCalled();
    expect(component.savePenaltiesArray).toHaveBeenCalledWith(penalties);
  });

  it("should create a single penalty with an empty reason when reasonSelected is empty", () => {
    component.reasonSelected = "";
    const penalties = component.createPenaltiesToSave();
    expect(penalties.length).toBe(1);
    expect(penalties[0].reason).toBe("");
  });

  it("should create a single penalty with the given reason when there are no line breaks", () => {
    component.reasonSelected = "This is a single reason";
    const penalties = component.createPenaltiesToSave();
    expect(penalties.length).toBe(1);
    expect(penalties[0].reason).toBe("This is a single reason");
  });

  it("should create multiple penalties when reasonSelected has multiple reasons separated by line breaks", () => {
    component.reasonSelected = "First reason\nSecond reason\nThird reason";
    const penalties = component.createPenaltiesToSave();
    expect(penalties.length).toBe(3);
    expect(penalties[0].reason).toBe("First reason");
    expect(penalties[1].reason).toBe("Second reason");
    expect(penalties[2].reason).toBe("Third reason");
  });

  it("should remove \\r characters from reasonSelected before creating penalties", () => {
    component.reasonSelected = "Reason with\r carriage\r return";
    const penalties = component.createPenaltiesToSave();
    expect(penalties.length).toBe(1);
    expect(penalties[0].reason).toBe("Reason with carriage return");
  });

  it("should save penalties array", () => {
    const penalties = [
      new Penalty(
        1,
        new Race(1, new Circuit(1, "Montreal", "Canada", null, "", new Season(1, "Temporada 1", 1)), new Date(), 1, new Season(1, "Season 1", 1)),
        new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),
        new PenaltySeverity(1, "Leve"),
        "Porque si",
        new Season(1, "Temporada 1", 1)
      )
    ];
    spyOn(component, "resetFormAndValues");
    spyOn(component, "getAllPenaltiesPerDriver");
    penaltyApiServiceSpy.savePenalties.and.returnValue(of("Se ha guardado correctamente"));

    component.savePenaltiesArray(penalties);

    expect(messageInfoServiceSpy.showSuccess).toHaveBeenCalledWith("Se ha guardado correctamente");
  });

  it("should thrown an error saving penalties array", () => {
    penaltyApiServiceSpy.savePenalties.and.returnValue(throwError(() => ERROR_SAVE));

    component.savePenaltiesArray([]);

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_SAVE);
  });

  it("should resetForm and values", () => {
    const driver = new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1));
    const penaltySeverity = new PenaltySeverity(1, "Leve");
    component.driverSelected = driver;
    component.driverForm.setValue({ driver: driver });
    component.penaltySeveritySelected = penaltySeverity;
    component.penaltySeverityForm.setValue({ penaltySeverity: penaltySeverity });

    component.resetFormAndValues();

    expect(component.driverSelected).not.toBe(driver);
    expect(component.driverForm.get("driver")?.value).not.toBe(driver);
    expect(component.penaltySeveritySelected).not.toBe(penaltySeverity);
    expect(component.penaltySeverityForm.get("penaltySeverity")?.value).not.toBe(penaltySeverity);
  });

  it("should return the reason up to the first period", () => {
    const input = "This is a reason. More details here.";
    const expectedOutput = "This is a reason";
    expect(component.showReason(input)).toBe(expectedOutput);
  });

  it("should return the full reason if there is no period", () => {
    const input = "This is a reason without a period";
    const expectedOutput = "This is a reason without a period";
    expect(component.showReason(input)).toBe(expectedOutput);
  });
});
