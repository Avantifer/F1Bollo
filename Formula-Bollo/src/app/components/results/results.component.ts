import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Circuit } from 'src/shared/models/circuit';
import { Result } from 'src/shared/models/result';
import { CircuitService } from 'src/shared/services/circuit-api.service';
import { ResultService } from 'src/shared/services/result-api.service';

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

  constructor(private circuitService: CircuitService, private resultService: ResultService) { }

  ngOnInit(): void {
    this.getAllCircuits();
    this.getResultsOfCircuitSelected();
  }

  /**
   * Get all circuits
   * @memberof ModifyResultsComponent
   * @memberof ResultsComponent
  */
  getAllCircuits(): void {
    this.circuitService.getAllCircuits().subscribe((circuits: Circuit[]) => {
      this.circuits = circuits;
      this.circuitSelected = this.circuits[0];
      this.circuitsForm.get('circuit')?.setValue(this.circuitSelected);
      this.getResultsDefault(this.circuitSelected);
    });
  }

  /**
   * Get all results of the circuit selected
   * @memberof ModifyResultsComponent
   * @memberof ResultsComponent
  */
  getResultsOfCircuitSelected(): void {
    this.circuitsForm.valueChanges.subscribe((data: any) => {
      this.circuitSelected = data.circuit;
      // Check if a circuit is selected
      if (this.circuitSelected != undefined) {
        this.getAllResultsPerCircuit(this.circuitSelected.id);
      }
    });
  }

  /**
   * Get all results by circuitId
   * @memberof ModifyResultsComponent
   * @memberof ResultsComponent
  */
  getAllResultsPerCircuit(circuitId: number): void {
    this.resultService.getAllResultsPerCircuit(circuitId).subscribe((results: Result[]) => {
      this.results = results;
    });
  }

  /**
   * Get results default (Bahrein)
   * @memberof ResultsComponent
   */
  getResultsDefault(circuit: Circuit): void {
    this.resultService.getAllResultsPerCircuit(circuit.id).subscribe((results: Result[]) => {
      this.results = results;
    });
  }

}
