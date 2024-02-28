import { Race } from "./race";
import { Season } from "./season";
import { Team } from "./team";

export class FantasyPriceTeam {
  id: number;
  team: Team;
  race: Race;
  price: number;
  season: Season;
  totalPoints: number = 0;
  averagePoints: number = 0;
  differencePrice?: number;

  constructor(
    id: number,
    team: Team,
    race: Race,
    price: number,
    season: Season,
  ) {
    this.id = id;
    this.team = team;
    this.race = race;
    this.price = price;
    this.season = season;
  }
}
