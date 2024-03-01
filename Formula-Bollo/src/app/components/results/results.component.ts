import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { Subject, takeUntil } from "rxjs";
import { Circuit } from "src/shared/models/circuit";
import { Result } from "src/shared/models/result";
import { CircuitApiService } from "src/shared/services/api/circuit-api.service";
import { ResultApiService } from "src/shared/services/api/result-api.service";
import { SeasonApiService } from "src/shared/services/api/season-api.service";
import { Season } from "src/shared/models/season";
import { environment } from "src/enviroments/enviroment";
import { ERROR_CIRCUIT_FETCH, ERROR_RESULT_FETCH, ERROR_SEASON_FETCH } from "src/app/constants";

@Component({
  selector: "app-results",
  templateUrl: "./results.component.html",
  styleUrls: ["./results.component.scss"],
})
export class ResultsComponent {
  circuits: Circuit[] = [];
  results: Result[] = [];
  seasons: Season[] = [];
  displayedColumns: string[] = ["position", "driverName", "teamName", "points"];

  circuitsForm: FormGroup = new FormGroup({
    circuit: new FormControl(""),
  });
  seasonForm: FormGroup = new FormGroup({
    season: new FormControl(""),
  });

  circuitSelected: Circuit | undefined;
  seasonSelected: Season | undefined;

  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private circuitApiService: CircuitApiService,
    private resultApiService: ResultApiService,
    private messagueInfoService: MessageInfoService,
    private seasonApiService: SeasonApiService,
  ) {}

  ngOnInit(): void {
    this.obtainAllSeasons();
    this.changeCircuitSelected();
    this.changeSeasonResults();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Fetch all circuits from the circuit API service and handle the response.
   */
  getAllCircuits(seasonNumber?: number): void {
    this.circuitApiService
      .getAllCircuits(seasonNumber)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (circuits: Circuit[]) => {
          this.circuits = circuits;
          this.circuitSelected = this.circuits[0];
          this.circuitsForm.get("circuit")?.setValue(this.circuitSelected);
          this.getAllResultsPerCircuit(
            this.circuitSelected.id,
            this.seasonSelected?.number,
          );
        },
        error: (error) => {
          this.messagueInfoService.showError(ERROR_CIRCUIT_FETCH);
          console.log(error);
          throw error;
        },
      });
  }

  /**
   * Subscribe to changes in the 'circuit' value of the circuits form and fetch results accordingly.
   */
  changeCircuitSelected(): void {
    this.circuitsForm.valueChanges
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (data) => {
          this.circuitSelected = data.circuit;
          if (this.circuitSelected != undefined) {
            if (this.seasonSelected != undefined) {
              this.getAllResultsPerCircuit(
                this.circuitSelected.id,
                this.seasonSelected.number,
              );
            } else {
              this.getAllResultsPerCircuit(this.circuitSelected.id);
            }
          }
        },
      });
  }

  /**
   * Fetch results for a specific circuit and update the component's results property.
   *
   * @param circuitId - The ID of the circuit for which to fetch results.
   */
  getAllResultsPerCircuit(circuitId: number, seasonNumber?: number): void {
    this.resultApiService
      .getAllResultsPerCircuit(circuitId, seasonNumber)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (results: Result[]) => {
          this.results = results;
        },
        error: (error) => {
          this.messagueInfoService.showError(ERROR_RESULT_FETCH);
          console.log(error);
          throw error;
        },
      });
  }

  /**
   * Fetch all seasons and set a default season in the form.
   */
  obtainAllSeasons(): void {
    this.seasonApiService
      .getSeasons()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (seasons: Season[]) => {
          this.seasons = seasons;

          // Put seasonActual on the season Form as default value and update seasonSelected's property
          this.seasonSelected = this.seasons.filter(
            (season: Season) =>
              season.number === environment.seasonActual.number,
          )[0];
          this.seasonForm.get("season")?.setValue(this.seasonSelected);
          this.getAllCircuits(this.seasonSelected.number);
        },
        error: (error) => {
          this.messagueInfoService.showError(ERROR_SEASON_FETCH);
          console.log(error);
          throw error;
        },
      });
  }

  /**
   * Listen for changes in the selected season and update the list of results with drivers points accordingly.
   */
  changeSeasonResults(): void {
    this.seasonForm.valueChanges
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((data) => {
        if (this.circuitSelected != undefined) {
          this.seasonSelected = data.season;
          this.getAllCircuits(this.seasonSelected!.number);
        }
      });
  }
}
