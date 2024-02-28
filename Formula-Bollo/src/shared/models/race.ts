import { Circuit } from "./circuit";
import { Season } from "./season";

export class Race {
  id: number;
  circuit: Circuit;
  dateStart: Date;
  season: Season | undefined;
  finished: number;

  constructor(
    id: number,
    circuit: Circuit,
    dateStart: Date,
    finished: number,
    season?: Season,
  ) {
    this.id = id;
    this.circuit = circuit;
    this.dateStart = dateStart;
    this.finished = finished;
    this.season = season;
  }
}
