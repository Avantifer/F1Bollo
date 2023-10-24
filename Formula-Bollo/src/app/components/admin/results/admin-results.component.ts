import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Circuit } from 'src/shared/models/circuit';
import { Driver } from 'src/shared/models/driver';
import { Position } from 'src/shared/models/position';
import { Race } from 'src/shared/models/race';
import { Result } from 'src/shared/models/result';
import { CircuitApiService } from 'src/shared/services/api/circuit-api.service';
import { DriverApiService } from 'src/shared/services/api/driver-api.service';
import { MessageService } from 'src/shared/services/message.service';
import { RaceApiService } from 'src/shared/services/api/race-api.service';
import { ResultApiService } from 'src/shared/services/api/result-api.service';

@Component({
  selector: 'app-modify-results',
  templateUrl: './admin-results.component.html',
  styleUrls: ['./admin-results.component.scss'],
})
export class AdminResultsComponent {

  saveButtonActivated: boolean = false;
  drivers: Driver[] = [];
  circuits: Circuit[] = [];
  results: Result[] = [];

  circuitsForm: FormGroup = new FormGroup({
    circuit: new FormControl(''),
  });
  fastLapForm: FormGroup = new FormGroup({
    fastlap: new FormControl(''),
  });
  raceForm: FormGroup = new FormGroup({
    raceDate: new FormControl('')
  });
  resultsForm: FormGroup = new FormGroup({ });

  circuitSelected: Circuit | undefined;
  fastLapSelected: Result | undefined;
  raceSelected: Race | undefined;
  raceDate: Date = new Date();

  private _unsubscribe = new Subject<void>();

  constructor(
    private resultApiService: ResultApiService,
    private circuitApiService: CircuitApiService,
    private driverApiService: DriverApiService,
    private raceApiService: RaceApiService,
    private messageService: MessageService,
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
      this.resultsForm.addControl('result' + i, new FormControl(''));
    }
  }

  /**
   * Find the index of the first disqualified result in the 'results' array.
   *
   * @returns The index of the first disqualified result or the length of the array if no disqualifications are found.
  */
  findFirstDisqualifiedIndex(): number {
    return this.results.findIndex((result) => !result.position) || this.results.length;
  }

  /**
   * Complete the result form with result data.
   *
   * @param results - An array of result data.
  */
  putResultsInResultForm(results: Result[]): void {
    for (let i = 0; i <= 19; i++) {
      this.resultsForm.get(`result${i}`)?.setValue(results[i]);
    }
  }

  /**
   * Fetch and set the list of circuits.
  */
  getAllCircuits(): void {
    this.circuitApiService.getAllCircuits()
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (circuits: Circuit[]) => {
          this.circuits = circuits;
        },
        error: (error) => {
          this.messageService.showInformation('Hubo un error al recoger los circuitos');
          console.error('Error al obtener circuitos:', error);
          throw error;
        }
      });
  }

  /**
   * Fetches all seasons from the season API service and updates the seasons property.
  */

  /**
   * Subscribe to changes in the circuitsForm and perform actions based on the selected circuit.
  */
  getResultsOfCircuitSelected(): void {
    this.circuitsForm.valueChanges
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (data: any) => {
          this.circuitSelected = data.circuit;

          if (this.circuitSelected) {
            this.fetchDriversResultsAndRace(this.circuitSelected.id);
          }
        }
      });
  }

  /**
   * Fetch drivers, results, and race data for the selected circuit.
   *
   * @param circuitId - The ID of the selected circuit.
  */
  private fetchDriversResultsAndRace(circuitId: number): void {
    this.getAllDrivers();
    this.getAllResultsPerCircuit(circuitId);
    this.getRacePerCircuit(circuitId);
  }

  /**
   * Get all results by circuitId
   * @memberof ModifyResultsComponent
   * @memberof ResultsComponent
  */
  getAllResultsPerCircuit(circuitId: number): void {
    this.resultApiService.getAllResultsPerCircuit(circuitId)
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (results: Result[]) => {
          this.results = results;

          // Reset the values of the fast lap and race date form fields.
          this.fastLapForm.get('fastlap')?.setValue('');
          this.raceForm.get('raceDate')?.setValue('');

          this.saveButtonActivated = true;
          this.processResults(results, circuitId);
        },
        error: (error) => {
          this.messageService.showInformation('No se han podido recoger los resultados del circuito');
          console.log(error);
          throw error;
        }
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

    this.fastLapForm.get('fastlap')?.setValue(fastestResult);
    this.fastLapSelected = fastestResult;
  }

  /**
   * Fetch and set the list of drivers.
  */
  getAllDrivers(): void {
    this.driverApiService.getAllDrivers()
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (drivers: Driver[]) => {
          this.drivers = drivers;
        },
        error: (error) => {
          this.messageService.showInformation('No se ha podido recoger los pilotos correctamente');
          console.log(error);
          throw error;
        }
      });
  }

  /**
   * Fetch and set the selected race and race date for the specified circuit.
   *
   * @param circuitId - The ID of the selected circuit.
  */
  getRacePerCircuit(circuitId: number): void {
    this.raceApiService.getRacePerCircuit(circuitId)
      .pipe(
        takeUntil(this._unsubscribe)
      )
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
          this.messageService.showInformation('No se ha podido recoger la carrera correctamente');
          console.log(error);
          throw error;
        }
      });
  }

  /**
   * Save data from race and results forms.
  */
  saveAllForms(): void {
    this.saveRace();

    setTimeout(() => {
      this.saveResults();
    }, 1000);
  }

  /**
   * Save race data based on selected race or create a new race if necessary.
  */
  saveRace(): void {
    let race = this.raceSelected ?? this.createRace();

    // Check if a race is available
    if (!race) return;

    this.raceApiService.saveRace(race)
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        error: (error) => {
          this.messageService.showInformation(error.error);
          console.log(error);
          throw error;
        }
      })
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
      this.messageService.showInformation('Tienes que seleccionar una fecha de inicio');
      return undefined;
    }

    const newRace = new Race(0, this.circuitSelected, this.raceDate);
    this.raceSelected = newRace;
    return newRace;
  }

  /**
   * Save results by either updating existing results or creating new results.
  */
  saveResults(): void {
    if (this.results.length > 0) {
      this.updateResult();
    }else {
      this.createResult();
    }
  }

  /**
   * Update existing results and save them.
  */
  updateResult(): void {
    // Get updated results
    let resultsToSave: Result[] = this.updateEveryResult();

    if (this.comprobateIfDuplicatedDriver(resultsToSave)) {
      this.messageService.showInformation('Hay un piloto duplicado en los resultados.');
      return;
    }

    this.resultApiService.saveResults(resultsToSave)
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (success: string) => {
          this.messageService.showInformation(success);
          this.circuitSelected = undefined;
          this.circuitsForm.get('circuit')?.setValue('');
          this.saveButtonActivated = false;
        },
        error: (error) => {
          this.messageService.showInformation(error.error);
          console.log(error);
          throw error;
        }
      });
  }

  /**
   * Update and prepare results based on the values in the results form.
   *
   * @returns An array of updated results.
  */
  updateEveryResult(): Result[] {
    let resultsToSave: Result[] = [];
    let positionActual: number = 1;

    for (let controlName of Object.keys(this.resultsForm.controls)) {
      let controlValue: Result = this.resultsForm.controls[controlName].value;

      if (controlValue?.position) {
        let fastlap: number = 0;
        // Check if the current driver has the fastest lap
        if (this.fastLapSelected?.driver.name == controlValue.driver.name) {
          fastlap = 1;
        }

        let newPosition: Position = new Position(controlValue.position.id, positionActual, controlValue.position.points);
        let newResult: Result = new Result(controlValue.id, controlValue.race, controlValue.driver, newPosition, fastlap);

        resultsToSave.push(newResult);
        positionActual++;
      }
    }

    return resultsToSave;
  }

  /**
   * Create and save results based on selected circuit and date.
  */
  createResult(): void {
    if (!this.circuitSelected) return;

    let resultsToSave: Result[] = [];
    let race: Race = new Race(0, this.circuitSelected, this.raceDate);

    this.createEveryResult(resultsToSave, race);
    this.comprobateDriversToBeDisqualified(resultsToSave, race);

    if (this.comprobateIfDuplicatedDriver(resultsToSave)) {
      this.messageService.showInformation('Hay un piloto duplicado en los resultados.');
      return;
    }

    this.resultApiService.saveResults(resultsToSave)
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (success: string) => {
          this.messageService.showInformation(success);
          this.circuitSelected = undefined;
          this.circuitsForm.get('circuit')?.setValue('');
          this.saveButtonActivated = false;
        },
        error: (error) => {
          this.messageService.showInformation(error.error);
          console.log(error);
          throw error;
        }
      })
  }

  /**
   * Identify disqualified drivers and create results for them.
   *
   * @param resultsToSave - Array of results to be saved.
   * @param race - The race for which results are being prepared.
  */
  private comprobateDriversToBeDisqualified(resultsToSave: Result[], race: Race): void {
    // Create a Set of disqualified driver names from the results to save
    const disqualifiedDriverNames = new Set(resultsToSave.map((result) => result.driver.name));

    // Find drivers who are not disqualified
    const driversNotDisqualified: Driver[] = this.drivers.filter((driver) => !disqualifiedDriverNames.has(driver.name));

    // Create new results for disqualified drivers and append them to the existing results
    const newResultsToSave = driversNotDisqualified.map((driver) => new Result(0, race, driver, null, 0));
    resultsToSave.push(...newResultsToSave);
  }

  /**
   * Create results for each driver based on the form data and fastest lap driver.
   *
   * @param resultsToSave - Array of results to be saved.
   * @param race - The race for which results are being prepared.
  */
  private createEveryResult(resultsToSave: Result[], race : Race): void {
    let positionActual: number = 1;
    const fastLapValue: Driver | undefined = this.fastLapForm.get('fastlap')?.value;

    for (let controlName of Object.keys(this.resultsForm.controls)) {
      let controlValue: Driver | undefined = this.resultsForm.controls[controlName].value;

      if (controlValue) {
        let fastlap: number = fastLapValue?.name === controlValue.name ? 1 : 0;
        let position: Position = new Position(0, positionActual, 0);
        let result: Result = new Result(0, race, controlValue, position, fastlap);
        resultsToSave.push(result);
        positionActual++;
      }
    }
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
      if (result.position) {
        const driverName = result.driver.name;

        if (driverNames.has(driverName)) {
          duplicated = true;
          break;
        }

        driverNames.add(driverName);
      }
    }

    return duplicated;
  }

  /**
   * Clear the value of a specific result in the results form.
   *
   * @param index - The index of the result to be cleared.
  */
  onMatSelectDelete(index: number): void {
    this.resultsForm.get('result' + index)?.setValue(null);
  }
}
