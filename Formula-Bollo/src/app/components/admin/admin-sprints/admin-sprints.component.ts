import { Component } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";
import { ERROR_CIRCUIT_FETCH, ERROR_RESULT_FETCH, ERROR_DRIVER_FETCH, ERROR_RACE_FETCH, WARNING_DATE_RACE_NOT_SELECTED, WARNING_DRIVER_DUPLICATED } from "src/app/constants";
import { Circuit } from "src/shared/models/circuit";
import { Driver } from "src/shared/models/driver";
import { Position } from "src/shared/models/position";
import { Race } from "src/shared/models/race";
import { Sprint } from "src/shared/models/sprint";
import { CircuitApiService } from "src/shared/services/api/circuit-api.service";
import { DriverApiService } from "src/shared/services/api/driver-api.service";
import { RaceApiService } from "src/shared/services/api/race-api.service";
import { SprintApiService } from "src/shared/services/api/sprint-api.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";

@Component({
  selector: "app-admin-sprints",
  templateUrl: "./admin-sprints.component.html",
  styleUrl: "./admin-sprints.component.scss"
})
export class AdminSprintsComponent {
  drivers: Driver[] = [];
  circuits: Circuit[] = [];
  results: Sprint[] = [];
  positions: number[] = Array.from(Array(20).keys());

  circuitsForm: FormGroup = new FormGroup({
    circuit: new FormControl("")
  });
  raceForm: FormGroup = new FormGroup({
    raceDate: new FormControl("")
  });
  resultsForm: FormGroup = new FormGroup({});

  circuitSelected: Circuit | undefined;
  fastLapSelected: Driver | undefined;
  raceSelected: Race | undefined;
  poleSelected: Driver | undefined;

  raceDate: Date = new Date();

  private _unsubscribe: Subject<void> = new Subject<void>();
  loading: Subject<boolean> = new Subject<boolean>();

  constructor(
    private sprintApiService: SprintApiService,
    private circuitApiService: CircuitApiService,
    private driverApiService: DriverApiService,
    private raceApiService: RaceApiService,
    private messageInfoService: MessageInfoService
  ) {}

  ngOnInit(): void {
    this.createResultForm();
    this.getAllDrivers();
    this.getAllCircuits();
    this.getResultsOfCircuitSelected();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
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
          console.error(error);
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
            this.getAllResultsPerCircuit(this.circuitSelected.id);
          }
        },
      });
  }

  /**
   * Get all results by circuitId
   * @memberof ModifyResultsComponent
   * @memberof ResultsComponent
   */
  getAllResultsPerCircuit(circuitId: number): void {
    this.sprintApiService
      .getAllSprintPerCircuit(circuitId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (results: Sprint[]) => {
          this.results = results;
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
  private processResults(results: Sprint[], circuitId: number): void {
    this.getRacePerCircuit(circuitId);
    this.putResultsInResultForm(results);
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

    const resultsToSave: Sprint[] = [];
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
  private saveAllResults(results: Sprint[]): void {
    this.sprintApiService
      .saveSprints(results)
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
   * Identify disqualified drivers and create results for them.
   *
   * @param resultsToSave - Array of results to be saved.
   * @param race - The race for which results are being prepared.
   */
  private comprobateDriversToBeDisqualified(resultsToSave: Sprint[],race: Race): void {
    // Create a Set of disqualified driver names from the results to save
    const disqualifiedDriverNames: Set<string> = new Set(
      resultsToSave.map((result) => result.driver.name)
    );

    // Find drivers who are not disqualified
    const driversNotDisqualified: Driver[] = this.drivers.filter(
      (driver) => !disqualifiedDriverNames.has(driver.name),
    );


    // Create new results for disqualified drivers and append them to the existing results
    const newResultsToSave: Sprint[] = driversNotDisqualified.map(
      (driver) => {
        return new Sprint(0, race, driver, null);
      }
    );

    resultsToSave.push(...newResultsToSave);
  }

  /**
   * Create results for each driver based on the form data and fastest lap driver.
   *
   * @param resultsToSave - Array of results to be saved.
   * @param race - The race for which results are being prepared.
   */
  private createEveryResult(resultsToSave: Sprint[], race: Race): void {
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
   * All the parameters needed to update the result array to save
   *
   * @param results - Array of results to be saved.
   * @param race - The race for which results are being prepared.
   * @param controlValue - The information about the result.
   * @param positionActual - The position that driver will have.
   */
  private updateActionResult(results: Sprint[], race: Race, controlValue: Sprint, positionActual: number): void {

    let position: Position | null = null;

    if (positionActual <= this.findFirstDisqualifiedIndex()) {
      position = new Position(0, positionActual, 0);
    }

    const result: Sprint = new Sprint(0, race, controlValue.driver, position);
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
  private createActionResult(results: Sprint[], race: Race, controlValue: Driver, positionActual: number): void {
    const position: Position = new Position(0, positionActual, 0);

    const result: Sprint = new Sprint(0, race, controlValue, position);
    results.push(result);
  }

  /**
   * Check if there are duplicated drivers in the results array.
   *
   * @param results - Array of results to check for duplicates.
   * @returns true if duplicates exist, false otherwise.
   */
  private comprobateIfDuplicatedDriver(results: Sprint[]): boolean {
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
}
