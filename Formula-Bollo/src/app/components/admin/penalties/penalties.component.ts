import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { catchError } from 'rxjs';
import { Circuit } from 'src/shared/models/circuit';
import { Driver } from 'src/shared/models/driver';
import { DriverPenalties } from 'src/shared/models/driverPenalty';
import { Penalty } from 'src/shared/models/penalty';
import { PenaltySeverity } from 'src/shared/models/penaltySeverity';
import { Race } from 'src/shared/models/race';
import { CircuitService } from 'src/shared/services/circuit-api.service';
import { DriverService } from 'src/shared/services/driver-api.service';
import { MessageService } from 'src/shared/services/message.service';
import { PenaltyService } from 'src/shared/services/penalty-api.service';
import { PenaltySeverityService } from 'src/shared/services/penaltySeverity-api.service';
import { RaceService } from 'src/shared/services/race-api.service';

@Component({
  selector: 'app-penalties',
  templateUrl: './penalties.component.html',
  styleUrls: ['./penalties.component.scss']
})
export class PenaltiesComponent {

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

  constructor(
    private circuitService: CircuitService,
    private driverService: DriverService,
    private penaltyService: PenaltyService,
    private penaltySeverityService: PenaltySeverityService,
    private raceService: RaceService,
    private messageService: MessageService
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

  /**
   * Get all circuits
   * @memberof ModifyResultsComponent
   * @memberof PenaltiesComponent
  */
  getAllCircuits(): void {
    this.circuitService.getAllCircuits().subscribe((circuits: Circuit[]) => {
      this.circuits = circuits;
    });
  }

  /**
   * Get all penalties Severity
   * @memberof PenaltiesComponent
  */
  getAllPenaltiesSeverity(): void {
    this.penaltySeverityService.getAllPenalties().subscribe((penaltiesSeverity: PenaltySeverity[]) => {
      this.penaltiesSeverity = penaltiesSeverity;
    });
  }

  /**
   * Get the circuit selected
   * @memberof PenaltiesComponent
  */
  getCircuitSelected(): void {
    this.circuitsForm.valueChanges.subscribe((data: any) => {
      this.circuitSelected = data.circuit;
      this.raceService.getRacePerCircuit(this.circuitSelected!.id).subscribe((race: Race[]) => {
        this.raceSelected = race[0];
        if (this.driverSelected && this.penaltySeveritySelected) {
          this.getPenaltyPerDriverAndRaceAndSeverity(this.driverSelected, race[0], this.penaltySeveritySelected);
        }
      })
    });
  }

  /**
   * Get all drivers
   * @memberof ModifyResultsComponent
   * @memberof PenaltiesComponent
  */
  getAllDrivers(): void {
    this.driverService.getAllDrivers().subscribe((drivers: Driver[]) => {
      this.drivers = drivers;
    });
  }

  /**
   * Get the driver selected
   * @memberof PenaltiesComponent
  */
  getDriverSelected(): void {
    this.driverForm.valueChanges.subscribe((data: any) => {
      this.driverSelected = data.driver;
      if (this.driverSelected && this.circuitSelected && this.penaltySeveritySelected) {
        this.raceService.getRacePerCircuit(this.circuitSelected.id).subscribe((race: Race[]) => {
          this.getPenaltyPerDriverAndRaceAndSeverity(this.driverSelected!, race[0], this.penaltySeveritySelected!);
        });
      }
    });
  }

  /**
   * Get the penalty's severity selected
   * @memberof PenaltiesComponent
  */
  getPenaltySeveritySelected(): void {
    this.penaltySeverityForm.valueChanges.subscribe((data : any) => {
      this.penaltySeveritySelected = data.penaltySeverity;
      if (this.penaltySeveritySelected && this.driverSelected && this.circuitSelected) {
        this.saveButtonActivated = true;
        this.raceService.getRacePerCircuit(this.circuitSelected.id).subscribe((race: Race[]) => {
          this.getPenaltyPerDriverAndRaceAndSeverity(this.driverSelected!, race[0], this.penaltySeveritySelected!);
        });
      }
    });
  }

  /**
   * Get all penalties
   * @memberof PenaltiesComponent
  */
  getAllPenaltiesPerDriver(): void {
    this.penaltyService.getAllPenaltiesPerDriver().subscribe((penalties: DriverPenalties[]) => {
      this.penalties = penalties;
    });
  }

  /**
   * Get penalty of a driver and race
   * @memberof PenaltiesComponent
  */
  getPenaltyPerDriverAndRaceAndSeverity(driver: Driver, race: Race, penaltySeverity: PenaltySeverity): void {
    this.penaltyService.getPenaltyByDriverAndRaceAndSeverity(driver.id, race.id, penaltySeverity.id).subscribe((penalties: Penalty[]) => {
      this.reasonSelected = '';
      this.reasonForm.get('reason')?.setValue('');
      if (penalties.length === 0) return;

      this.penaltiesSelected = penalties;

      for (let i = 0; i < this.penaltiesSelected.length; i++) {
        if (i === this.penaltiesSelected.length - 1) {
          this.reasonSelected += this.penaltiesSelected[i].reason;
        }else {
          this.reasonSelected += this.penaltiesSelected[i].reason + '\r\n\r';
        }
      }

      if (this.reasonSelected?.includes('undefined')) {
        this.reasonSelected = this.reasonSelected.replace('undefined', '');
      }

      this.reasonForm.get('reason')?.setValue(this.reasonSelected);
    });
  }

  /**
   * Save penalty
   * @memberof PenaltiesComponent
  */
  savePenalty(): void {
    this.reasonSelected = this.reasonForm.get('reason')?.value;
    let penaltiesToSave: Penalty[] = [];

    // Check if the reason selected is empty
    if (this.reasonSelected === '') {
      // This delete all penalties previously saved
      let penaltyToSave: Penalty = new Penalty(0, this.raceSelected!, this.driverSelected!, this.penaltySeveritySelected!, '');
      penaltiesToSave.push(penaltyToSave);
    } else {
      // Check if the reason selected contains line breaks and remove it
      if (this.reasonSelected?.includes('\r')) {
        this.reasonSelected = this.reasonSelected.replace(/\r/g, '');
      }

      let reasonsArray: string[] = this.reasonSelected!.split('\n');

      for(let reason of reasonsArray) {
        let penaltyToSave: Penalty = new Penalty(0, this.raceSelected!, this.driverSelected!, this.penaltySeveritySelected!, reason);
        penaltiesToSave.push(penaltyToSave);
      }
    }

    // Save the penalties using the penalty service
    this.penaltyService.savePenalties(penaltiesToSave).pipe(catchError((error) => {
      // Show an error message if there is an error saving the penalties
      this.messageService.showInformation(error.error);
      return '';
    })).subscribe((success: string) => {
      // Show a success message if the penalties are saved successfully
      this.messageService.showInformation(success);

      // Reset selected values and form fields
      this.driverSelected = undefined;
      this.driverForm.get('driver')?.setValue('');
      this.penaltySeveritySelected = undefined;
      this.penaltySeverityForm.get('penaltySeverity')?.setValue('');

      // Deactivate the save button
      this.saveButtonActivated = false;
    });
  }

  /**
   * Show reason correctly to HTML
   * @memberof PenaltiesComponent
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
