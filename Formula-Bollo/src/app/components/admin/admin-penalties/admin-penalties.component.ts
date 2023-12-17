import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Circuit } from 'src/shared/models/circuit';
import { Driver } from 'src/shared/models/driver';
import { DriverPenalties } from 'src/shared/models/driverPenalty';
import { Penalty } from 'src/shared/models/penalty';
import { PenaltySeverity } from 'src/shared/models/penaltySeverity';
import { Race } from 'src/shared/models/race';
import { CircuitApiService } from 'src/shared/services/api/circuit-api.service';
import { DriverApiService } from 'src/shared/services/api/driver-api.service';
import { MessageService } from 'src/shared/services/message.service';
import { PenaltyApiService } from 'src/shared/services/api/penalty-api.service';
import { PenaltySeverityApiService } from 'src/shared/services/api/penaltySeverity-api.service';
import { RaceApiService } from 'src/shared/services/api/race-api.service';
import { RacePenalties } from 'src/shared/models/racePenalty';

@Component({
  selector: 'app-penalties',
  templateUrl: './admin-penalties.component.html',
  styleUrls: ['./admin-penalties.component.scss']
})
export class AdminPenaltiesComponent {

  circuits: Circuit[] = [];
  drivers: Driver[] = [];
  penalties: DriverPenalties[] = [];
  penaltiesSeverity: PenaltySeverity[] = [];

  circuitsForm: FormGroup = new FormGroup({
    circuit: new FormControl(''),
  });
  driverForm: FormGroup = new FormGroup({
    driver: new FormControl('')
  });
  reasonForm: FormGroup = new FormGroup({
    reason: new FormControl('')
  });
  penaltySeverityForm: FormGroup = new FormGroup({
    penaltySeverity: new FormControl('')
  });

  circuitSelected: Circuit | undefined;
  driverSelected: Driver | undefined;
  penaltiesSelected: Penalty[] | undefined;
  penaltySeveritySelected: PenaltySeverity | undefined;
  reasonSelected: string | undefined;
  raceSelected: Race | undefined;

  saveButtonActivated: boolean = false;

  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private circuitApiService: CircuitApiService,
    private driverApiService: DriverApiService,
    private penaltyApiService: PenaltyApiService,
    private penaltySeverityApiService: PenaltySeverityApiService,
    private raceApiService: RaceApiService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.getAllCircuits();
    this.getAllDrivers();
    this.getAllPenaltiesPerDriver();
    this.getAllPenaltiesSeverity();
    this.getCircuitSelected();
    this.getDriverSelected();
    this.getPenaltySeveritySelected();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Fetches all circuits from the circuit API service and stores them.
  */
  getAllCircuits(): void {
    this.circuitApiService.getAllCircuits()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (circuits: Circuit[]) => {
          // Update the 'circuits' property with the fetched data.
          this.circuits = circuits;
        },
        error: (error) => {
          console.error('Error while fetching circuits:', error);
        }
      });
  }

  /**
   * Fetches all penalty severities from the penalty severity API service and updates the penaltiesSeverity property.
  */
  getAllPenaltiesSeverity(): void {
    this.penaltySeverityApiService.getAllPenalties()
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (penaltiesSeverity: PenaltySeverity[]) => {
          this.penaltiesSeverity = penaltiesSeverity;
        },
        error: (error) => {
          this.messageService.showInformation('No se han podido recoger los tipos de penalización');
          console.log(error);
          throw error;
        }
      })
  }

  /**
   * Subscribes to changes in the circuitsForm and updates the selected circuit,
   * fetches the corresponding race, and gets penalties based on selected driver, race, and severity.
  */
  getCircuitSelected(): void {
    this.circuitsForm.valueChanges.
      pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (data: any) => {
          this.circuitSelected = data.circuit;

          // Fetch the corresponding race for the selected circuit.
          this.raceApiService.getRacePerCircuit(this.circuitSelected!.id)
            .pipe(
              takeUntil(this._unsubscribe)
            )
            .subscribe({
              next: (race: Race[]) => {
                this.raceSelected = race[0];
                if (this.driverSelected && this.penaltySeveritySelected) {
                  // Fetch penalties based on the selected driver, race, and severity.
                  this.getPenaltyPerDriverAndRaceAndSeverity(this.driverSelected, race[0], this.penaltySeveritySelected);
                }
              },
              error: (error) => {
                this.messageService.showInformation('No se ha podido recoger la carrera correctamente');
                console.log(error);
                throw error;
              }
            });
        }
      });
  }

  /**
   * Fetches all drivers from the driver API service and updates the drivers property.
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
        this.messageService.showInformation('No se ha podido recoger correctamente los pilotos');
        console.log(error);
        throw error;
      }
    });
  }

  /**
   * Subscribes to changes in the driverForm, updates the selected driver, and fetches penalties based on selected driver, circuit, and severity.
  */
  getDriverSelected(): void {
    this.driverForm.valueChanges
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (data: any) => {
          this.driverSelected = data.driver;

          if (this.driverSelected && this.circuitSelected && this.penaltySeveritySelected) {
            this.raceApiService.getRacePerCircuit(this.circuitSelected.id).subscribe((race: Race[]) => {
              this.getPenaltyPerDriverAndRaceAndSeverity(this.driverSelected!, race[0], this.penaltySeveritySelected!);
            });
          }
        }
      });
  }

  /**
   * Subscribe to changes in the penaltySeverityForm, update the selected penalty severity, and fetch relevant data.
  */
  getPenaltySeveritySelected(): void {
    this.penaltySeverityForm.valueChanges
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (data : any) => {
          this.penaltySeveritySelected = data.penaltySeverity;

          if (this.penaltySeveritySelected && this.driverSelected && this.circuitSelected) {
            this.saveButtonActivated = true;
            this.raceApiService.getRacePerCircuit(this.circuitSelected.id).subscribe((race: Race[]) => {
              this.getPenaltyPerDriverAndRaceAndSeverity(this.driverSelected!, race[0], this.penaltySeveritySelected!);
            });
          }
        }
      });
  }

  /**
   * Fetch all penalties for the selected driver and update the 'penalties' property.
  */
  getAllPenaltiesPerDriver(): void {
    this.penaltyApiService.getAllPenaltiesPerDriver()
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next:(penalties: DriverPenalties[]) => {
          this.penalties = penalties;
        },
        error: (error) => {
          this.messageService.showInformation('No se ha podido recoger las penalizaciones del piloto');
          console.log(error)
          throw error;
        }
      });
  }

  /**
   * Fetch penalties for a specific driver, race, and penalty severity, and update relevant properties and form values.
   *
   * @param driver - The selected driver.
   * @param race - The selected race.
   * @param penaltySeverity - The selected penalty severity.
  */
  getPenaltyPerDriverAndRaceAndSeverity(driver: Driver, race: Race, penaltySeverity: PenaltySeverity): void {
    this.penaltyApiService.getPenaltyByDriverAndRaceAndSeverity(driver.id, race.id, penaltySeverity.id)
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (penalties: Penalty[]) => {
          this.reasonSelected = '';
          this.reasonForm.get('reason')?.setValue('');
          if (penalties.length === 0) return;

          this.penaltiesSelected = penalties;

          // Concatenate and format the reasons.
          this.reasonSelected = penalties.map(penalty => penalty.reason).join('\r\n\r');

          if (this.reasonSelected?.includes('undefined')) {
            this.reasonSelected = this.reasonSelected.replace('undefined', '');
          }

          this.reasonForm.get('reason')?.setValue(this.reasonSelected);
        },
        error: (error) => {
          this.messageService.showInformation('No se ha podido recoger la penalización del piloto');
          console.log(error)
          throw error;
        }
      });
  }

  /**
   * Save penalties based on the selected driver, race, penalty severity, and reasons.
  */
  savePenalty(): void {
    this.reasonSelected = this.reasonForm.get('reason')?.value;
    let penaltiesToSave: Penalty[] = this.createPenaltiesToSave();
    this.savePenaltiesArray(penaltiesToSave);
    this.updatePenalties(penaltiesToSave);
  }

  /**
   * Create an array of penalties to be saved based on the selected driver, race, penalty severity, and reasons.
   * If the reasons are empty, it will return an array with a single penalty that deletes all previously saved penalties.
   *
   * @returns An array of penalties to be saved.
  */
  private createPenaltiesToSave(): Penalty[] {
    let penaltiesToSave: Penalty[] = [];

    // Check if the reason selected is empty
    if (!this.reasonSelected) {
      // This delete all penalties previously saved
      let penaltyToSave: Penalty = new Penalty(0, this.raceSelected!, this.driverSelected!, this.penaltySeveritySelected!, '');
      penaltiesToSave.push(penaltyToSave);
    } else {
      // Check if the reason selected contains line breaks and remove it
      this.reasonSelected = this.reasonSelected.replace(/\r/g, '');

      let reasonsArray: string[] = this.reasonSelected.split('\n');

      for(let reason of reasonsArray) {
        penaltiesToSave.push(new Penalty(0, this.raceSelected!, this.driverSelected!, this.penaltySeveritySelected!, reason));
      }
    }

    return penaltiesToSave;
  }

  /**
   * Save an array of penalties using the penalty service and handle success and error cases.
   *
   * @param penaltiesToSave - An array of penalties to be saved.
  */
  private savePenaltiesArray(penaltiesToSave: Penalty[]): void {
    this.penaltyApiService.savePenalties(penaltiesToSave)
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (success: string) => {
          this.messageService.showInformation(success);
          // Reset selected values and form fields
          this.resetFormAndValues();
          this.saveButtonActivated = false;
        },
        error: (error) => {
          this.messageService.showInformation('No se ha podido guardar correctamente las penalizaciones');
          console.log(error);
          throw error;
        }
      });
  }

  /**
   * Update penalties in the data structure based on selected criteria.
   *
   * @param penaltiesToSave - An array of penalties to be updated in the data structure.
  */
  private updatePenalties(penaltiesToSave: Penalty[]) {
    // Find the selected driver and race penalties.
    let driverPenalty: DriverPenalties | undefined = this.penalties.find((penalty) => penalty.driver.name === penaltiesToSave[0].driver.name);

    if (driverPenalty) {
      let racePenalty: RacePenalties | undefined = driverPenalty.racePenalties.find((racePenalty) => racePenalty.race.circuit.name === this.circuitSelected?.name);

      if (racePenalty) {
        // Filter out penalties with the selected severity.
        racePenalty.penalties = racePenalty.penalties.filter((penalty) => penalty.severity.severity !== this.penaltySeveritySelected?.severity);

        // Filter and add new clean penalties.
        let cleanPenaltiesToSave: Penalty[] = penaltiesToSave.filter((penalty) => penalty.reason !== '');
        if (penaltiesToSave[0].reason === "") {
          driverPenalty.racePenalties = driverPenalty.racePenalties.filter((racePenalty: RacePenalties) => racePenalty.race.id != this.raceSelected!.id);
        } else {
          racePenalty.penalties.push(...cleanPenaltiesToSave);
        }
      } else {
        let racePenalty: RacePenalties = new RacePenalties(this.raceSelected!, penaltiesToSave);
        driverPenalty.racePenalties.push(racePenalty);
      }
    }
  }

  /**
   * Reset selected values and form fields.
  */
  private resetFormAndValues(): void {
    this.driverSelected = undefined;
    this.driverForm.get('driver')?.setValue('');
    this.penaltySeveritySelected = undefined;
    this.penaltySeverityForm.get('penaltySeverity')?.setValue('');
  }

  /**
   * Process a reason string by removing any characters after the first period ('.').
   *
   * @param reason - The reason string to be processed.
   * @returns The processed reason string.
  */
  showReason(reason: string): string {
    if (reason) {
      let indexPoint: number = reason.indexOf('.');
      if (indexPoint > 0) {
        reason = reason.substring(0, indexPoint);
      }
    }

    return reason;
  }
}
