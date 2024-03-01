import { Season } from "./season";
import { Team } from "./team";

export class Driver {
  id: number;
  name: string;
  number: number;
  team: Team;
  driverImage: string;
  season: Season;

  constructor(
    id: number,
    name: string,
    number: number,
    team: Team,
    driverImage: string,
    season: Season,
  ) {
    this.id = id;
    this.name = name;
    this.number = number;
    this.team = team;
    this.driverImage = driverImage;
    this.season = season;
  }
}
