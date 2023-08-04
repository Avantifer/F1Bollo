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
  penaltySelected: Penalty | undefined;
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
        if (this.driverForm.get('driver')?.value) {
          this.getPenaltyPerDriverAndRace(this.driverForm.get('driver')?.value, race[0]);
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
      if (this.driverSelected) {
        this.saveButtonActivated = true;
        this.raceService.getRacePerCircuit(this.circuitSelected!.id).subscribe((race: Race[]) => {
          this.getPenaltyPerDriverAndRace(data.driver, race[0]);
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
  getPenaltyPerDriverAndRace(driver: Driver, race: Race): void {
    this.penaltyService.getPenaltyByDriverAndRace(driver.id, race.id).subscribe((penalty: Penalty) => {
      if (penalty.driver != null) {
        this.penaltySelected = penalty;

        let selectedSeverity = this.penaltiesSeverity.find((penaltyseverity) => penaltyseverity.severity === penalty.severity.severity);

        if (selectedSeverity) {
          this.penaltySeveritySelected = selectedSeverity;
          this.penaltySeverityForm.get('penaltySeverity')?.setValue(selectedSeverity);

          this.reasonSelected = penalty.reason;
          this.reasonForm.get('reason')?.setValue(this.reasonSelected);
        }
      }else {
        this.penaltySeverityForm.get('penaltySeverity')?.setValue('');
        this.reasonForm.get('reason')?.setValue('');
      }
    });
  }

  /**
   * Save penalty
   * @memberof PenaltiesComponent
  */
  savePenalty(): void {
    this.reasonSelected = this.reasonForm.get('reason')?.value;

    if (!this.penaltySeveritySelected) {
      this.messageService.showInformation("Necesitas poner la gravedad");
      return;
    }

    if (this.reasonSelected === '' || this.reasonSelected === null) {
      this.messageService.showInformation("Necesitas poner la razón");
      return;
    }

    if (this.raceSelected && this.driverSelected) {
      let penalty: Penalty = new Penalty(0, this.raceSelected, this.driverSelected, this.penaltySeveritySelected, this.reasonSelected!);
       if (this.penaltySelected) {
        penalty = new Penalty(this.penaltySelected.id, this.raceSelected, this.driverSelected, this.penaltySeveritySelected, this.reasonSelected!);
      }

      this.penaltyService.savePenalties([penalty]).pipe(catchError((error) => {
        this.messageService.showInformation(error.error);
        return '';
      })).subscribe((success: string) => {
        this.messageService.showInformation(success);
        this.driverSelected = undefined;
        this.driverForm.get('driver')?.setValue('');
        this.saveButtonActivated = false;
      });
    }
  }

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
