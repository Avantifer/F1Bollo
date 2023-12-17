import { Race } from "./race";
import { Season } from "./season";
import { Team } from "./team";

export class FantasyPriceTeam {
  id: number;
  team: Team;
  race: Race;
  price: number;
  season: Season;

  constructor(id: number, team: Team, race: Race, price: number, season: Season) {
    this.id = id;
    this.team = team;
    this.race = race;
    this.price = price;
    this.season = season;
  }
}
