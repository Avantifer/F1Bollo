import { Driver } from "./driver";
import { Position } from "./position";
import { Race } from "./race"

export class Result {
  id: number
  race: Race | null;
  driver: Driver;
  position: Position | null;
  fastlap: number;

  constructor(id: number, race: Race | null, driver: Driver, position: Position | null, fastlap: number) {
    this.id = id
    this.race = race;
    this.driver = driver;
    this.position = position;
    this.fastlap = fastlap;
  }
}
