import { Driver } from "./driver";
import { Position } from "./position";
import { Race } from "./race";
import { Season } from "./season";

export class Result {
  id: number;
  race: Race | null;
  driver: Driver;
  position: Position | null;
  fastlap: number;
  pole: number;
  season: Season | undefined;

  constructor(
    id: number,
    race: Race | null,
    driver: Driver,
    position: Position | null,
    fastlap: number,
    pole: number,
    season?: Season,
  ) {
    this.id = id;
    this.race = race;
    this.driver = driver;
    this.position = position;
    this.fastlap = fastlap;
    this.pole = pole;
    this.season = season;
  }
}
