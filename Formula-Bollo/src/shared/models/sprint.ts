import { Driver } from "./driver";
import { Position } from "./position";
import { Race } from "./race";
import { Season } from "./season";

export class Sprint {
  id: number;
  race: Race | null;
  driver: Driver;
  position: Position | null;
  season: Season | undefined;

  constructor(
    id: number,
    race: Race | null,
    driver: Driver,
    position: Position | null,
    season?: Season,
  ) {
    this.id = id;
    this.race = race;
    this.driver = driver;
    this.position = position;
    this.season = season;
  }
}
