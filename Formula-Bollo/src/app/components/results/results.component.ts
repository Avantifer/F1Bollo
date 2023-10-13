import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'src/shared/services/message.service';
import { Subject, takeUntil } from 'rxjs';
import { Circuit } from 'src/shared/models/circuit';
import { Result } from 'src/shared/models/result';
import { CircuitApiService } from 'src/shared/services/api/circuit-api.service';
import { ResultApiService } from 'src/shared/services/api/result-api.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent {

  circuits: Circuit[] = [];
  results: Result[] = [];
  displayedColumns: string[] = ["position", "driverName", "teamName", "points"];

  circuitsForm: FormGroup = new FormGroup({
    circuit: new FormControl(''),
  });

  circuitSelected: Circuit | undefined;

  private _unsubscribe = new Subject<void>();

  constructor(
    private circuitApiService: CircuitApiService,
    private resultApiService: ResultApiService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getAllCircuits();
    this.getResultsOfCircuitSelected();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Fetch all circuits from the circuit API service and handle the response.
  */
  getAllCircuits(): void {
    this.circuitApiService.getAllCircuits()
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (circuits: Circuit[]) => {
          this.circuits = circuits;
          this.circuitSelected = this.circuits[0];
          this.circuitsForm.get('circuit')?.setValue(this.circuitSelected);
          this.getAllResultsPerCircuit(this.circuitSelected.id);
        },
        error: (error) => {
          this.messageService.showInformation('Hubo un problema al recoger los circuitos');
          console.log(error);
          throw error
        }
      });
  }

  /**
   * Subscribe to changes in the 'circuit' value of the circuits form and fetch results accordingly.
  */
  getResultsOfCircuitSelected(): void {
    this.circuitsForm.valueChanges
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (data: any) => {
          this.circuitSelected = data.circuit;
          if (this.circuitSelected != undefined) {
            this.getAllResultsPerCircuit(this.circuitSelected.id);
          }
        }
      });
  }

  /**
   * Fetch results for a specific circuit and update the component's results property.
   *
   * @param circuitId - The ID of the circuit for which to fetch results.
  */
  getAllResultsPerCircuit(circuitId: number): void {
    this.resultApiService.getAllResultsPerCircuit(circuitId)
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (results: Result[]) => {
          this.results = results;
        },
        error: (error) => {
          this.messageService.showInformation('No se ha podido recoger los resultados');
          console.log(error);
          throw error;
        }
      });
  }
}
