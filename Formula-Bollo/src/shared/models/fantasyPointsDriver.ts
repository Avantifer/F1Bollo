import { Driver } from "./driver";
import { Race } from "./race";
import { Season } from "./season";

export class FantasyPointsDriver {
  id: number;
  driver: Driver;
  race: Race;
  points: number;
  season: Season;
  totalPoints?: number;

  constructor(id: number, driver: Driver, race: Race, points: number, season: Season) {
    this.id = id;
    this.driver = driver;
    this.race = race;
    this.points = points;
    this.season = season;
  }
}
