import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { catchError } from 'rxjs';
import { Circuit } from 'src/shared/models/circuit';
import { Driver } from 'src/shared/models/driver';
import { Position } from 'src/shared/models/position';
import { Race } from 'src/shared/models/race';
import { Result } from 'src/shared/models/result';
import { CircuitService } from 'src/shared/services/circuit-api.service';
import { DriverService } from 'src/shared/services/driver-api.service';
import { MessageService } from 'src/shared/services/message.service';
import { RaceService } from 'src/shared/services/race-api.service';
import { ResultService } from 'src/shared/services/result-api.service';

@Component({
  selector: 'app-modify-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent {

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

  constructor(
    private resultService: ResultService,
    private circuitService: CircuitService,
    private driverService: DriverService,
    private raceService: RaceService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.createResultForm();
    this.getAllDrivers();
    this.getAllCircuits();
    this.getResultsOfCircuitSelected();
  }

  /**
   * creates a result form by adding form controls to the resultsForm
   * @memberof ModifyResultsComponent
  */
  createResultForm(): void {
    for (let i = 0; i <= 20; i++) {
      this.resultsForm.addControl('result' + i, new FormControl(''));
    }
  }

  /**
   * return the first index of the first driver qualified
   * @memberof ModifyResultsComponent
  */
  findFirstDisqualifiedIndex(): number {
    // Find the index of the first disqualified result
    const index = this.results.findIndex((result) => !result.position);
    // If a disqualified result is found, return its index
    // Otherwise, return the length of the results array
    return index >= 0 ? index : this.results.length;
  }

  /**
   * Put the results in the resultsForm
   * @memberof ModifyResultsComponent
  */
  putResultsInResultForm(results: Result[]): void {
    for (let i = 0; i <= 19; i++) {
      this.resultsForm.get(`result${i}`)?.setValue(results[i]);
    }
  }

  /**
   * Get all circuits
   * @memberof ModifyResultsComponent
  */
  getAllCircuits(): void {
    this.circuitService.getAllCircuits().subscribe((circuits: Circuit[]) => {
      this.circuits = circuits;
    });
  }

  /**
   * Get all results of the circuit selected
   * @memberof ModifyResultsComponent
  */
  getResultsOfCircuitSelected(): void {
    this.circuitsForm.valueChanges.subscribe((data: any) => {
      this.circuitSelected = data.circuit;
      // Check if a circuit is selected
      if (this.circuitSelected != undefined) {
        this.getAllDrivers();
        this.getAllResultsPerCircuit(this.circuitSelected.id);
        this.getRacePerCircuit(this.circuitSelected.id);
      }
    });
  }

  /**
   * Get all results by circuitId
   * @memberof ModifyResultsComponent
  */
  getAllResultsPerCircuit(circuitId: number): void {
    this.resultService.getAllResultsPerCircuit(circuitId).subscribe((results: Result[]) => {
      this.results = results;
      // Reset the value of the fast lap and race date form field
      this.fastLapForm.get('fastlap')?.setValue('');
      this.raceForm.get('raceDate')?.setValue('');
      // Activate the save button
      this.saveButtonActivated = true;

      this.getFastLapDriver(results);
      this.getRacePerCircuit(circuitId);
      this.putResultsInResultForm(results);
    });
  }

  /**
   * Get fastLapDriver
   * @param results - Results Array
   * @memberof ModifyResultsComponent
  */
  getFastLapDriver(results: Result[]): void {
    results.forEach((result: Result) => {
      // Check if the result has a fast lap
      if (result.fastlap) {
        // Set the fast lap value in the fastLapForm
        this.fastLapForm.get('fastlap')?.setValue(result);
        this.fastLapSelected = result;
      }
    });
  }

  /**
   * Get all drivers
   * @memberof ModifyResultsComponent
  */
  getAllDrivers(): void {
    this.driverService.getAllDrivers().subscribe((drivers: Driver[]) => {
      this.drivers = drivers;
    });
  }

  /**
   * Get the race of the circuitId
   * @param circuitId - Id of the circuit Selected.
   * @memberof ModifyResultsComponent
  */
  getRacePerCircuit(circuitId: number): void {
    this.raceService.getRacePerCircuit(circuitId).subscribe((races: Race[]) => {
      // Check if there are any races
      if (races.length > 0) {
        // Set the first race as the selected race and set the race date
        this.raceSelected = races[0];
        this.raceDate = new Date(races[0].dateStart);
      } else {
        // If there are no races, set the selected race to undefined
        this.raceSelected = undefined;
      }
    });
  }

  /**
   * Save AllForm in bbdd
   * @memberof ModifyResultsComponent
  */
  saveAllForms(): void {
    this.saveRace();
    setTimeout(() => {
      this.saveResults();
    }, 1000);
  }

  /**
   * Save Race in bbdd
   * @memberof ModifyResultsComponent
  */
  saveRace(): void {
    let race: Race;
     // Check if a race is selected
    if (this.raceSelected) {
      race = this.raceSelected;
    } else {
      // Check if a circuit and race date is selected
      if (!this.circuitSelected) return;
      if (!this.raceDate) {
        this.messageService.showInformation("Tienes que seleccionar una fecha de inicio");
        return;
      }

      race = new Race(0, this.circuitSelected, this.raceDate);
      this.raceSelected = race;
    }
    // Check if a race is available
    if (!race) return;

    // Save the race
    this.raceService.saveRace(race)
      .pipe(catchError((error) => {
        this.messageService.showInformation(error.error);
        return '';
      }))
      .subscribe();
  }

  /**
   * Save Results in bbdd
   * @memberof ModifyResultsComponent
  */
  saveResults(): void {
    if (this.results.length > 0) {
      this.updateResult();
    }else {
      this.createResult();
    }
  }

  /**
   * Update results to be saved in bbdd
   * @memberof ModifyResultsComponent
  */
  updateResult(): void {
    // Get updated results
    let resultsToSave: Result[] = this.updateEveryResult();

    // Save the results
    this.resultService.saveResults(resultsToSave)
      .pipe(catchError((error) => {
        this.messageService.showInformation(error.error);
        return '';
      }))
      .subscribe((success: string) => {
        this.messageService.showInformation(success);
        this.circuitSelected = undefined;
        this.circuitsForm.get('circuit')?.setValue('');
        this.saveButtonActivated = false;
      });
  }

  /**
   * Update every result one for one
   * @memberof ModifyResultsComponent
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
      }else if (controlValue) {
        let fastlap: number = 0;
        // Check if the current driver has the fastest lap
        if (this.fastLapSelected?.driver.name == controlValue.driver?.name) {
          fastlap = 1;
        }

        let newResult: Result = new Result(controlValue.id, controlValue.race, controlValue.driver, null, fastlap);
        resultsToSave.push(newResult);
      }
    }

    return resultsToSave;
  }

  /**
   * Create results to be saved in bbdd
   * @memberof ModifyResultsComponent
  */
  createResult(): void {
    // Check if a circuit is selected, if not, exit the function
    if (!this.circuitSelected) return;

    let resultsToSave: Result[] = [];
    let race: Race = new Race(0, this.circuitSelected, this.raceDate);

    this.createEveryResult(resultsToSave, race);
    this.comprobateDriversToBeDisqualified(resultsToSave, race);

    // Save the results
    this.resultService.saveResults(resultsToSave)
    .pipe(catchError((error) => {
      this.messageService.showInformation(error.error);
      return '';
    })).subscribe((success: string) => {
      this.messageService.showInformation(success);
      this.circuitSelected = undefined;
      this.circuitsForm.get('circuit')?.setValue('');
      this.saveButtonActivated = false;
    });
  }

  /**
   * Check drivers to know whose that need to be disqualified
   * @param resultsToSave - The array to save the results to.
   * @param race - The race object.
   * @memberof ModifyResultsComponent
  */
  comprobateDriversToBeDisqualified(resultsToSave: Result[], race : Race): void {
    // Create a Set of disqualified driver names from the results to save
    let disqualifiedDriverNames = new Set(resultsToSave.map((result: Result) => result.driver.name));
    // Filter out the disqualified drivers from the drivers array
    let driversDisqualified: Driver[] = this.drivers.filter((driver: Driver) => !disqualifiedDriverNames.has(driver.name));
    // Create new results to save for the disqualified drivers
    let newResultsToSave = driversDisqualified.map((driver: Driver) => new Result(0, race, driver, null, 0));
    // Append the new results to the existing results to save array
    resultsToSave.push(...newResultsToSave);
  }


  /**
   * Creates a result for each driver in the resultsForm and adds it to the resultsToSave array.
   * @param resultsToSave - The array to save the results to.
   * @param race - The race object.
  */
  createEveryResult(resultsToSave: Result[], race : Race): void {
    let positionActual: number = 1;
    const fastLapValue: Driver | undefined = this.fastLapForm.get('fastlap')?.value;

    for (let controlName of Object.keys(this.resultsForm.controls)) {
      let controlValue: Driver | undefined = this.resultsForm.controls[controlName].value;

      if (controlValue) {
        let fastlap: number = 0;
        // Check if the current driver has the fastest lap
        if (fastLapValue && fastLapValue.name === controlValue.name) {
          fastlap = 1;
        }

        let position: Position = new Position(0, positionActual, 0);
        let result: Result = new Result(0, race, controlValue, position, fastlap);
        resultsToSave.push(result);
        positionActual++;
      }
    }
  }
}
