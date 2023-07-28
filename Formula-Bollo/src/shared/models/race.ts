import { Circuit } from "./circuit";
import { Result } from "./result";

export class Race {
  id: number;
  circuit: Circuit;
  dateStart: Date;
  results: Set<Result> | null;

  constructor( id: number, circuit: Circuit, dateStart: Date, results: Set<Result> | null) {
    this.id = id;
    this.circuit = circuit;
    this.dateStart = dateStart;
    this.results = results;
  }
}
