import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";
import { Driver } from "src/shared/models/driver";
import { DriverPenalties } from "src/shared/models/driverPenalty";
import { Penalty } from "src/shared/models/penalty";
import { PenaltySeverity } from "src/shared/models/penaltySeverity";
import { Race } from "src/shared/models/race";
import { DriverApiService } from "src/shared/services/api/driver-api.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { PenaltyApiService } from "src/shared/services/api/penalty-api.service";
import { PenaltySeverityApiService } from "src/shared/services/api/penaltySeverity-api.service";
import { RaceApiService } from "src/shared/services/api/race-api.service";
import { ERROR_DRIVER_FETCH, ERROR_PENALTIES_FETCH, ERROR_PENALTY_TYPE_FETCH, ERROR_RACE_FETCH, ERROR_SAVE } from "src/app/constants";

@Component({
  selector: "app-penalties",
  templateUrl: "./admin-penalties.component.html",
  styleUrls: ["./admin-penalties.component.scss"],
})
export class AdminPenaltiesComponent {
  races: Race[] = [];
  drivers: Driver[] = [];
  penalties: DriverPenalties[] = [];
  penaltiesSeverity: PenaltySeverity[] = [];

  raceForm: FormGroup = new FormGroup({
    race: new FormControl(""),
  });
  driverForm: FormGroup = new FormGroup({
    driver: new FormControl(""),
  });
  reasonForm: FormGroup = new FormGroup({
    reason: new FormControl(""),
  });
  penaltySeverityForm: FormGroup = new FormGroup({
    penaltySeverity: new FormControl(""),
  });

  raceSelected: Race | undefined;
  driverSelected: Driver | undefined;
  penaltiesSelected: Penalty[] | undefined;
  penaltySeveritySelected: PenaltySeverity | undefined;
  reasonSelected: string | undefined;

  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private driverApiService: DriverApiService,
    private penaltyApiService: PenaltyApiService,
    private penaltySeverityApiService: PenaltySeverityApiService,
    private raceApiService: RaceApiService,
    private messageInfoService: MessageInfoService,
  ) {}

  ngOnInit(): void {
    this.getAllRaces();
    this.getAllDrivers();
    this.getAllPenaltiesSeverity();
    this.getAllPenaltiesPerDriver();
    this.getRaceSelected();
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
  getAllRaces(): void {
    this.raceApiService
      .getAllPrevious()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (races: Race[]) => {
          this.races = races;
        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_RACE_FETCH);
          console.log(error.error);
          throw error;
        },
      });
  }

  /**
   * Fetches all penalty severities from the penalty severity API service and updates the penaltiesSeverity property.
   */
  getAllPenaltiesSeverity(): void {
    this.penaltySeverityApiService
      .getAllPenalties()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (penaltiesSeverity: PenaltySeverity[]) => {
          this.penaltiesSeverity = penaltiesSeverity;
        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_PENALTY_TYPE_FETCH);
          console.log(error);
          throw error;
        },
      });
  }

  /**
   * Subscribes to changes in the circuitsForm and updates the selected circuit,
   * fetches the corresponding race, and gets penalties based on selected driver, race, and severity.
   */
  getRaceSelected(): void {
    this.raceForm.valueChanges
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (data) => {
          if (this.driverSelected && this.penaltySeveritySelected) {
            // Fetch penalties based on the selected driver, race, and severity.
            this.getPenaltyPerDriverAndRaceAndSeverity(
              this.driverSelected,
              data.race,
              this.penaltySeveritySelected,
            );
          }
        },
      });
  }

  /**
   * Fetches all drivers from the driver API service and updates the drivers property.
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
   * Subscribes to changes in the driverForm, updates the selected driver, and fetches penalties based on selected driver, circuit, and severity.
   */
  getDriverSelected(): void {
    this.driverForm.valueChanges.pipe(takeUntil(this._unsubscribe)).subscribe({
      next: (data) => {
        this.driverSelected = data.driver;

        if (this.raceSelected && this.penaltySeveritySelected) {
          this.getPenaltyPerDriverAndRaceAndSeverity(
            data.driver,
            this.raceSelected,
            this.penaltySeveritySelected,
          );
        }
      },
    });
  }

  /**
   * Subscribe to changes in the penaltySeverityForm, update the selected penalty severity, and fetch relevant data.
   */
  getPenaltySeveritySelected(): void {
    this.penaltySeverityForm.valueChanges
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (data) => {
          this.penaltySeveritySelected = data.penaltySeverity;

          if (this.driverSelected && this.raceSelected) {
            this.getPenaltyPerDriverAndRaceAndSeverity(
              this.driverSelected,
              this.raceSelected,
              data.penaltySeverity
            );
          }
        },
      });
  }

  /**
   * Fetch all penalties for the selected driver and update the 'penalties' property.
   */
  getAllPenaltiesPerDriver(): void {
    this.penaltyApiService
      .getAllPenaltiesPerDriver()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (penalties: DriverPenalties[]) => {
          this.penalties = penalties;
        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_PENALTIES_FETCH);
          console.log(error);
          throw error;
        },
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
    if(driver.id === undefined || race.id === undefined || penaltySeverity.id === undefined) return;

    this.penaltyApiService
      .getPenaltyByDriverAndRaceAndSeverity(
        driver.id,
        race.id,
        penaltySeverity.id,
      )
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (penalties: Penalty[]) => {
          this.reasonSelected = "";
          this.reasonForm.get("reason")?.setValue("");
          if (penalties.length === 0) return;

          this.penaltiesSelected = penalties;

          // Concatenate and format the reasons.
          this.reasonSelected = penalties
            .map((penalty) => penalty.reason)
            .join("\r\n\r");

          if (this.reasonSelected?.includes("undefined")) {
            this.reasonSelected = this.reasonSelected.replace("undefined", "");
          }

          this.reasonForm.get("reason")?.setValue(this.reasonSelected);
        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_PENALTIES_FETCH);
          console.log(error);
          throw error;
        },
      });
  }

  /**
   * Save penalties based on the selected driver, race, penalty severity, and reasons.
   */
  savePenalty(): void {
    this.reasonSelected = this.reasonForm.get("reason")?.value;
    const penaltiesToSave: Penalty[] = this.createPenaltiesToSave();
    this.savePenaltiesArray(penaltiesToSave);
  }

  /**
   * Create an array of penalties to be saved based on the selected driver, race, penalty severity, and reasons.
   * If the reasons are empty, it will return an array with a single penalty that deletes all previously saved penalties.
   *
   * @returns An array of penalties to be saved.
   */
  private createPenaltiesToSave(): Penalty[] {
    const penaltiesToSave: Penalty[] = [];

    // Check if the reason selected is empty
    if (!this.reasonSelected) {
      // This delete all penalties previously saved
      const penaltyToSave: Penalty = new Penalty(
        0,
        this.raceSelected!,
        this.driverSelected!,
        this.penaltySeveritySelected!,
        "",
      );
      penaltiesToSave.push(penaltyToSave);
    } else {
      // Check if the reason selected contains line breaks and remove it
      this.reasonSelected = this.reasonSelected.replace(/\r/g, "");

      const reasonsArray: string[] = this.reasonSelected.split("\n");

      for (const reason of reasonsArray) {
        penaltiesToSave.push(
          new Penalty(
            0,
            this.raceSelected!,
            this.driverSelected!,
            this.penaltySeveritySelected!,
            reason,
          ),
        );
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
    this.penaltyApiService
      .savePenalties(penaltiesToSave)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (success: string) => {
          this.messageInfoService.showSuccess(success);
          // Reset selected values and form fields
          this.resetFormAndValues();
        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_SAVE);
          console.log(error);
          throw error;
        },
        complete: () => {
          this.getAllPenaltiesPerDriver();
        }
      });
  }

  /**
   * Reset selected values and form fields.
   */
  private resetFormAndValues(): void {
    this.driverSelected = undefined;
    this.driverForm.get("driver")?.setValue("");
    this.penaltySeveritySelected = undefined;
    this.penaltySeverityForm.get("penaltySeverity")?.setValue("");
  }

  /**
   * Process a reason string by removing any characters after the first period ('.').
   *
   * @param reason - The reason string to be processed.
   * @returns The processed reason string.
   */
  showReason(reason: string): string {
    if (reason) {
      const indexPoint: number = reason.indexOf(".");
      if (indexPoint > 0) {
        reason = reason.substring(0, indexPoint);
      }
    }

    return reason;
  }
}
