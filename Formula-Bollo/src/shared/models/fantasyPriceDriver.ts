import { Driver } from "./driver";
import { Race } from "./race";
import { Season } from "./season";

export class FantasyPriceDriver {
  id: number;
  driver: Driver;
  race: Race;
  price: number;
  season: Season;
  totalPoints: number = 0;
  averagePoints: number = 0;
  differencePrice?: number;

  constructor(id: number, driver: Driver, race: Race, price: number, season: Season) {
    this.id = id;
    this.driver = driver;
    this.race = race;
    this.price = price;
    this.season = season;
  }
}
