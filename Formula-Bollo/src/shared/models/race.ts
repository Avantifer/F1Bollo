import { Circuit } from "./circuit";
import { Season } from "./season";

export class Race {
  id: number;
  circuit: Circuit;
  dateStart: Date;
  season: Season | undefined;

  constructor( id: number, circuit: Circuit, dateStart: Date, season?: Season) {
    this.id = id;
    this.circuit = circuit;
    this.dateStart = dateStart;
    this.season = season;
  }
}
