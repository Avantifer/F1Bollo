import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";
import { Circuit } from "src/shared/models/circuit";
import { Driver } from "src/shared/models/driver";
import { Position } from "src/shared/models/position";
import { Race } from "src/shared/models/race";
import { Result } from "src/shared/models/result";
import { CircuitApiService } from "src/shared/services/api/circuit-api.service";
import { DriverApiService } from "src/shared/services/api/driver-api.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { RaceApiService } from "src/shared/services/api/race-api.service";
import { ResultApiService } from "src/shared/services/api/result-api.service";
import { FantasyApiService } from "src/shared/services/api/fantasy-api.service";
import { ERROR_CIRCUIT_FETCH, ERROR_DRIVER_FETCH, ERROR_RACE_FETCH, ERROR_RESULT_FETCH, WARNING_DATE_RACE_NOT_SELECTED, WARNING_DRIVER_DUPLICATED } from "src/app/constants";
import { Router } from "@angular/router";
import { Sprint } from "src/shared/models/sprint";
import { SprintApiService } from "src/shared/services/api/sprint-api.service";

@Component({
  selector: "app-modify-results",
  templateUrl: "./admin-results.component.html",
  styleUrls: ["./admin-results.component.scss"],
})
export class AdminResultsComponent {
  drivers: Driver[] = [];
  circuits: Circuit[] = [];
  results: Result[] = [];
  sprints: Sprint[] = [];
  positions: number[] = Array.from(Array(20).keys());

  circuitsForm: FormGroup = new FormGroup({
    circuit: new FormControl("")
  });
  fastLapForm: FormGroup = new FormGroup({
    fastlap: new FormControl("")
  });
  poleForm: FormGroup = new FormGroup({
    pole: new FormControl("")
  });
  raceForm: FormGroup = new FormGroup({
    raceDate: new FormControl("")
  });
  resultsForm: FormGroup = new FormGroup({});
  sprintsForm: FormGroup = new FormGroup({});

  circuitSelected: Circuit | undefined;
  fastLapSelected: Driver | undefined;
  raceSelected: Race | undefined;
  poleSelected: Driver | undefined;

  raceDate: Date = new Date();

  isSprint: boolean = false;

  private _unsubscribe: Subject<void> = new Subject<void>();
  loading: Subject<boolean> = new Subject<boolean>();

  constructor(
    private resultApiService: ResultApiService,
    private circuitApiService: CircuitApiService,
    private driverApiService: DriverApiService,
    private raceApiService: RaceApiService,
    private messageInfoService: MessageInfoService,
    private fantasyApiService: FantasyApiService,
    private sprintApiService: SprintApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkIsSprint();
    this.getAllDrivers();
    this.getAllCircuits();

    if (this.isSprint) {
      this.createSprintForm();
      this.getSprintsOfCircuitSelected();
    } else {
      this.createResultForm();
      this.getResultsOfCircuitSelected();
    }
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Check the current url to set if its sprints or not.
   */
  checkIsSprint(): void {
    this.isSprint = !!this.router.url.includes("sprint");
  }

  /**
   * Create form controls for result entries.
   */
  createResultForm(): void {
    const maxResultFormControl: number = 20;

    for (let i = 0; i <= maxResultFormControl; i++) {
      this.resultsForm.addControl("result" + i, new FormControl(""));
    }
  }

  /**
   * Create form controls for sprint entries.
   */
  createSprintForm(): void {
    const maxResultFormControl: number = 20;

    for (let i = 0; i <= maxResultFormControl; i++) {
      this.sprintsForm.addControl("sprint" + i, new FormControl(""));
    }
  }

  /**
   * Find the index of the first disqualified result in the 'results' array.
   *
   * @returns The index of the first disqualified result or the length of the array if no disqualifications are found.
   */
  findFirstDisqualifiedIndex(): number {
    return (
      this.results.findIndex((result) => !result.position) || this.results.length
    );
  }

  /**
   * Find the index of the first disqualified sprint in the 'sprints' array.
   *
   * @returns The index of the first disqualified sprint or the length of the array if no disqualifications are found.
   */
  findFirstDisqualifiedIndexSprint(): number {
    return (
      this.sprints.findIndex((sprint) => !sprint.position) || this.sprints.length
    );
  }

  /**
   * Complete the result form with result data.
   *
   * @param results - An array of result data.
   */
  putResultsInResultForm(results: Sprint[]): void {
    for (let i = 0; i <= 19; i++) {
      this.resultsForm.get(`result${i}`)?.setValue(results[i]);
    }
  }

  /**
   * Complete the result form with result data.
   *
   * @param results - An array of result data.
   */
  putResultsInSprintForm(sprints: Sprint[]): void {
    for (let i = 0; i <= 19; i++) {
      this.sprintsForm.get(`sprint${i}`)?.setValue(sprints[i]);
    }
  }

  /**
   * Fetch and set the list of circuits.
   */
  getAllCircuits(): void {
    this.circuitApiService
      .getAllCircuits()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (circuits: Circuit[]) => {
          this.circuits = circuits;
        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_CIRCUIT_FETCH);
          console.error("Error al obtener circuitos:", error);
          throw error;
        },
      });
  }

  /**
   * Subscribe to changes in the circuitsForm and perform actions based on the selected circuit.
   */
  getResultsOfCircuitSelected(): void {
    this.circuitsForm.valueChanges
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (data) => {
          this.circuitSelected = data.circuit;

          if (this.circuitSelected) {
            this.fetchDriversResultsAndRace(this.circuitSelected.id);
          }
        },
      });
  }

  /**
   * Subscribe to changes in the circuitsForm and perform actions based on the selected circuit.
   */
  getSprintsOfCircuitSelected(): void {
    this.circuitsForm.valueChanges
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (data) => {
          this.circuitSelected = data.circuit;

          if (this.circuitSelected) {
            this.getAllSprintsPerCircuit(this.circuitSelected.id);
          }
        },
      });
  }

  /**
   * Get all results by circuitId
   * @memberof ModifyResultsComponent
   * @memberof ResultsComponent
   */
  getAllSprintsPerCircuit(circuitId: number): void {
    this.sprintApiService
      .getAllSprintPerCircuit(circuitId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (sprints: Sprint[]) => {
          this.sprints = sprints;
          this.sprintsForm.reset();
          this.processSprints(sprints, circuitId);
        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_RESULT_FETCH);
          console.log(error);
          throw error;
        },
      });
  }

  /**
   * Process results data, including getting the fast lap driver and race data.
   *
   * @param results - An array of results data.
   * @param circuitId - The ID of the selected circuit.
   */
  private processSprints(sprints: Sprint[], circuitId: number): void {
    this.getRacePerCircuit(circuitId);
    this.putResultsInSprintForm(sprints);
  }

  /**
   * Fetch drivers, results, and race data for the selected circuit.
   *
   * @param circuitId - The ID of the selected circuit.
   */
  private fetchDriversResultsAndRace(circuitId: number): void {
    this.getAllResultsPerCircuit(circuitId);
  }

  /**
   * Get all results by circuitId
   * @memberof ModifyResultsComponent
   * @memberof ResultsComponent
   */
  getAllResultsPerCircuit(circuitId: number): void {
    this.resultApiService
      .getAllResultsPerCircuit(circuitId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (results: Result[]) => {
          this.results = results;

          // Reset the values of the fast lap, pole and race date form fields.
          this.fastLapForm.reset();
          this.poleForm.reset();
          this.raceForm.reset();

          this.processResults(results, circuitId);
        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_RESULT_FETCH);
          console.log(error);
          throw error;
        },
      });
  }

  /**
   * Process results data, including getting the fast lap driver and race data.
   *
   * @param results - An array of results data.
   * @param circuitId - The ID of the selected circuit.
   */
  private processResults(results: Result[], circuitId: number): void {
    this.getFastLapDriver(results);
    this.getPoleDriver(results);
    this.getRacePerCircuit(circuitId);
    this.putResultsInResultForm(results);
  }

  /**
   * Find and set the result with the fastest lap in the fastLapForm.
   *
   * @param results - An array of results.
   */
  getFastLapDriver(results: Result[]): void {
    const fastestResult: Result | undefined = results.find((result) => result.fastlap);
    if (!fastestResult) return;

    this.fastLapForm.get("fastlap")?.setValue(fastestResult);
  }

  /**
   * Find and set the result with the pole position in the poleForm.
   *
   * @param results - An array of results.
   */
  getPoleDriver(results: Result[]): void {
    const poleResult: Result | undefined = results.find((result) => result.pole);
    if (!poleResult) return;

    this.poleForm.get("pole")?.setValue(poleResult);
  }

  /**
   * Fetch and set the list of drivers.
   */
  getAllDrivers(): void {
    this.driverApiService
      .getAllDrivers()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (drivers: Driver[]) => {
          this.drivers = drivers;
        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_DRIVER_FETCH);
          console.log(error);
          throw error;
        },
      });
  }

  /**
   * Fetch and set the selected race and race date for the specified circuit.
   *
   * @param circuitId - The ID of the selected circuit.
   */
  getRacePerCircuit(circuitId: number): void {
    this.raceApiService
      .getRacePerCircuit(circuitId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (races: Race[]) => {
          if (races.length > 0) {
            // Set the first race as the selected race and set the race date
            this.raceSelected = races[0];
            this.raceDate = new Date(races[0].dateStart);
          } else {
            this.raceSelected = undefined;
          }
        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_RACE_FETCH);
          console.log(error);
          throw error;
        },
      });
  }

  /**
   * Save race data based on selected race or create a new race if necessary.
   */
  saveRace(): void {
    const race: Race | undefined = this.raceSelected ?? this.createRace();

    // Check if a race is available
    if (!race) return;
    // Set finished race
    race.finished = 1;
    this.raceApiService
      .saveRace(race)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        error: (error) => {
          this.messageInfoService.showError(error.error);
          console.log(error);
          throw error;
        },
        complete: () => {
          this.createResults();
        }
      });
  }

  /**
   * Save race data based on selected race or create a new race if necessary.
   */
  saveSprint(): void {
    const race: Race | undefined = this.raceSelected ?? this.createRace();

    // Check if a race is available
    if (!race) return;
    // Set finished race
    race.finished = 1;
    this.raceApiService
      .saveRace(race)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        error: (error) => {
          this.messageInfoService.showError(error.error);
          console.log(error);
          throw error;
        },
        complete: () => {
          this.createSprints();
        }
      });
  }

  /**
   * Create and save results based on selected circuit and date.
   */
  createSprints(): void {
    if (!this.circuitSelected) return;
    let everythingOK: boolean = true;

    const sprintsToSave: Sprint[] = [];
    this.raceApiService
      .getRacePerCircuit(this.circuitSelected.id)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (races: Race[]) => {
          this.createEverySprint(sprintsToSave, races[0]);
          this.comprobateDriversToBeDisqualifiedSprint(sprintsToSave, races[0]);

          if (this.comprobateIfDuplicatedDriverSprint(sprintsToSave)) {
            this.messageInfoService.showWarn(WARNING_DRIVER_DUPLICATED);
            everythingOK = false;
          }
        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_RACE_FETCH);
          console.log(error);
          throw error;
        },
        complete: () => {
          if (!everythingOK) return;
          this.saveAllSprints(sprintsToSave);
        }
      });
  }

  /**
   * Create a new race with circuit and race date.
   *
   * @returns The newly created race.
   */
  private createRace(): Race | undefined {
    if (!this.circuitSelected) {
      return undefined;
    }

    if (!this.raceDate) {
      this.messageInfoService.showWarn(WARNING_DATE_RACE_NOT_SELECTED);
      return undefined;
    }

    const newRace = new Race(0, this.circuitSelected, this.raceDate, 1);
    this.raceSelected = newRace;
    return newRace;
  }

  /**
   * Create and save results based on selected circuit and date.
   */
  createResults(): void {
    if (!this.circuitSelected) return;

    let everythingOK: boolean = true;

    const resultsToSave: Result[] = [];
    this.raceApiService
      .getRacePerCircuit(this.circuitSelected.id)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (races: Race[]) => {
          this.createEveryResult(resultsToSave, races[0]);
          this.comprobateDriversToBeDisqualified(resultsToSave, races[0]);

          if (this.comprobateIfDuplicatedDriver(resultsToSave)) {
            this.messageInfoService.showWarn(WARNING_DRIVER_DUPLICATED);
            everythingOK = false;
          }

        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_RACE_FETCH);
          console.log(error);
          throw error;
        },
        complete: () => {
          if (!everythingOK) return;
          this.saveAllResults(resultsToSave);
        }
      });
  }

  /**
   * Save all results.
   */
  private saveAllSprints(sprints: Sprint[]): void {
    this.sprintApiService
      .saveSprints(sprints)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (success: string) => {
          this.messageInfoService.showSuccess(success);
          this.circuitSelected = undefined;
          this.circuitsForm.get("circuit")?.setValue("");
        },
        error: (error) => {
          this.messageInfoService.showError(error.error);
          console.log(error);
          throw error;
        }
      });
  }

  /**
   * Save all results.
   */
  private saveAllResults(results: Result[]): void {
    this.resultApiService
      .saveResults(results)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (success: string) => {
          this.messageInfoService.showSuccess(success);
          this.circuitSelected = undefined;
          this.circuitsForm.get("circuit")?.setValue("");
        },
        error: (error) => {
          this.messageInfoService.showError(error.error);
          console.log(error);
          throw error;
        },
        complete: () => {
          this.saveAllFantasy(this.raceSelected!.id);
        }
      });
  }

  /**
   * Identify disqualified drivers and create sprints for them.
   *
   * @param resultsToSave - Array of sprints to be saved.
   * @param race - The race for which sprints are being prepared.
   */
  private comprobateDriversToBeDisqualifiedSprint(
    sprintsToSave: Sprint[],
    race: Race,
  ): void {
    // Create a Set of disqualified driver names from the sprints to save
    const disqualifiedDriverNames = new Set(
      sprintsToSave.map((sprint) => sprint.driver.name),
    );

    // Find drivers who are not disqualified
    const driversNotDisqualified: Driver[] = this.drivers.filter(
      (driver) => !disqualifiedDriverNames.has(driver.name),
    );

    // Create new sprints for disqualified drivers and append them to the existing sprints
    const newSprintsToSave: Sprint[] = driversNotDisqualified.map(
      (driver) => {
        return new Sprint(0, race, driver, null);
      }
    );

    sprintsToSave.push(...newSprintsToSave);
  }

  /**
   * Identify disqualified drivers and create results for them.
   *
   * @param resultsToSave - Array of results to be saved.
   * @param race - The race for which results are being prepared.
   */
  private comprobateDriversToBeDisqualified(
    resultsToSave: Result[],
    race: Race,
  ): void {
    // Create a Set of disqualified driver names from the results to save
    const disqualifiedDriverNames = new Set(
      resultsToSave.map((result) => result.driver.name),
    );

    // Find drivers who are not disqualified
    const driversNotDisqualified: Driver[] = this.drivers.filter(
      (driver) => !disqualifiedDriverNames.has(driver.name),
    );

    const fastLapValue = this.fastLapForm.get("fastlap")?.value;
    const poleValue = this.poleForm.get("pole")?.value;

    // Create new results for disqualified drivers and append them to the existing results
    const newResultsToSave: Result[] = driversNotDisqualified.map(
      (driver) => {
        let fastlap: number = 0;
        let pole: number = 0;
        if (fastLapValue.driver) {
          fastlap = fastLapValue?.driver.name === driver.name ? 1 : 0;
          pole = poleValue?.driver.name === driver.name ? 1 : 0;
        } else {
          fastlap = fastLapValue?.name === driver.name ? 1 : 0;
          pole = poleValue?.name === driver.name ? 1 : 0;
        }
        return new Result(0, race, driver, null, fastlap, pole);
      }
    );

    resultsToSave.push(...newResultsToSave);
  }

  /**
   * Create sprints for each driver based on the form data and fastest lap driver.
   *
   * @param resultsToSave - Array of results to be saved.
   * @param race - The race for which results are being prepared.
   */
  private createEverySprint(resultsToSave: Sprint[], race: Race): void {
    let positionActual: number = 1;

    for (const controlName of Object.keys(this.sprintsForm.controls)) {
      const controlValue = this.sprintsForm.controls[controlName].value;

      if (!controlValue) continue;

      if (controlValue.driver) {
        this.updateActionSprint(resultsToSave, race, controlValue, positionActual);
      } else if (controlValue.team){
        this.createActionSprint(resultsToSave, race, controlValue, positionActual);
      }

      console.log(resultsToSave);


      positionActual++;
    }
  }

  /**
   * Create results for each driver based on the form data and fastest lap driver.
   *
   * @param resultsToSave - Array of results to be saved.
   * @param race - The race for which results are being prepared.
   */
  private createEveryResult(resultsToSave: Result[], race: Race): void {
    let positionActual: number = 1;

    for (const controlName of Object.keys(this.resultsForm.controls)) {
      const controlValue = this.resultsForm.controls[controlName].value;

      if (!controlValue) continue;

      if (controlValue.driver) {
        this.updateActionResult(resultsToSave, race, controlValue, positionActual);
      } else if (controlValue.team){
        this.createActionResult(resultsToSave, race, controlValue, positionActual);
      }

      positionActual++;
    }
  }

  /**
   * All the parameters needed to update the sprint array to save
   *
   * @param sprints - Array of sprints to be saved.
   * @param race - The race for which sprints are being prepared.
   * @param controlValue - The information about the Sprint.
   * @param positionActual - The position that driver will have.
   */
  private updateActionSprint(sprints: Sprint[], race: Race, controlValue: Sprint, positionActual: number): void {
    let position: Position | null = null;

    if (positionActual <= this.findFirstDisqualifiedIndexSprint()) {
      position = new Position(0, positionActual, 0);
    }

    const result: Sprint = new Sprint(
      0,
      race,
      controlValue.driver,
      position
    );
    sprints.push(result);
  }

  /**
   * All the parameters needed to update the result array to save
   *
   * @param results - Array of results to be saved.
   * @param race - The race for which results are being prepared.
   * @param controlValue - The information about the result.
   * @param positionActual - The position that driver will have.
   */
  private updateActionResult(results: Result[], race: Race, controlValue: Result, positionActual: number): void {
    const fastLapValue: Result | undefined = this.fastLapForm.get("fastlap")?.value;
    const poleValue: Result | undefined = this.poleForm.get("pole")?.value;

    const fastlap: number = fastLapValue?.driver.name === controlValue.driver.name ? 1 : 0;
    const pole: number = poleValue?.driver.name === controlValue.driver.name ? 1 : 0;
    let position: Position | null = null;

    if (positionActual <= this.findFirstDisqualifiedIndex()) {
      position = new Position(0, positionActual, 0);
    }

    const result: Result = new Result(
      0,
      race,
      controlValue.driver,
      position,
      fastlap,
      pole,
    );
    results.push(result);
  }

  /**
   * All the parameters needed to create the result array to save.
   *
   * @param results - Array of results to be saved.
   * @param race - The race for which results are being prepared.
   * @param controlValue - The information about the result.
   * @param positionActual - The position that driver will have.
   */
  private createActionSprint(sprints: Sprint[], race: Race, controlValue: Driver, positionActual: number): void {
    const position: Position = new Position(0, positionActual, 0);
    const sprint: Sprint = new Sprint(
      0,
      race,
      controlValue,
      position
    );
    sprints.push(sprint);
  }

  /**
   * All the parameters needed to create the result array to save.
   *
   * @param results - Array of results to be saved.
   * @param race - The race for which results are being prepared.
   * @param controlValue - The information about the result.
   * @param positionActual - The position that driver will have.
   */
  private createActionResult(results: Result[], race: Race, controlValue: Driver, positionActual: number): void {
    const fastLapValue: Driver | undefined = this.fastLapForm.get("fastlap")?.value;
    const poleValue: Driver | undefined = this.poleForm.get("pole")?.value;
    const fastlap: number = fastLapValue?.name === controlValue.name ? 1 : 0;
    const pole: number = poleValue?.name === controlValue.name ? 1 : 0;
    const position: Position = new Position(0, positionActual, 0);
    const result: Result = new Result(
      0,
      race,
      controlValue,
      position,
      fastlap,
      pole,
    );
    results.push(result);
  }

  /**
   * Check if there are duplicated drivers in the results array.
   *
   * @param results - Array of results to check for duplicates.
   * @returns true if duplicates exist, false otherwise.
   */
  private comprobateIfDuplicatedDriverSprint(sprints: Sprint[]): boolean {
    const driverNames = new Set<string>();
    let duplicated = false;

    for (const sprint of sprints) {
      const driverName = sprint.driver.name;

      if (driverNames.has(driverName)) {
        duplicated = true;
        break;
      }

      driverNames.add(driverName);
    }

    return duplicated;
  }

  /**
   * Check if there are duplicated drivers in the results array.
   *
   * @param results - Array of results to check for duplicates.
   * @returns true if duplicates exist, false otherwise.
   */
  private comprobateIfDuplicatedDriver(results: Result[]): boolean {
    const driverNames = new Set<string>();
    let duplicated = false;

    for (const result of results) {
      const driverName = result.driver.name;

      if (driverNames.has(driverName)) {
        duplicated = true;
        break;
      }

      driverNames.add(driverName);
    }

    return duplicated;
  }

  /**
   * Save points and prices of drivers and teams.
   *
   * @param raceId - The number of the race.
   */
  saveAllFantasy(raceId: number): void {
    this.fantasyApiService
      .saveAllPoints(raceId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (success: string) => {
          this.messageInfoService.showSuccess(success);
        },
        error: (error) => {
          this.messageInfoService.showError(error.error);
        },
        complete: () => {
          this.saveFantasyPrices(raceId);
        },
      });
  }

  /**
   * Save prices of drivers and teams.
   *
   * @param raceId - The number of the race.
   */
  saveFantasyPrices(raceId: number): void {
    this.fantasyApiService
      .saveAllPrices(raceId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (success: string) => {
          this.messageInfoService.showSuccess(success);
        },
        error: (error) => {
          this.messageInfoService.showError(error.error);
        },
      });
  }
}
