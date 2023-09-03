import { Circuit } from "./circuit";

export class Race {
  id: number;
  circuit: Circuit;
  dateStart: Date;

  constructor( id: number, circuit: Circuit, dateStart: Date) {
    this.id = id;
    this.circuit = circuit;
    this.dateStart = dateStart;
  }
}
