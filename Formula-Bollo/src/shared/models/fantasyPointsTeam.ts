import { Race } from "./race";
import { Season } from "./season";
import { Team } from "./team";

export class FantasyPointsTeam {
  id: number;
  team: Team;
  race: Race;
  points: number;
  season: Season;

  constructor(id: number, team: Team, race: Race, points: number, season: Season) {
    this.id = id;
    this.team = team;
    this.race = race;
    this.points = points;
    this.season = season;
  }
}
