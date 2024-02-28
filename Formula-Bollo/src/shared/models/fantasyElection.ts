import { Driver } from "./driver";
import { Race } from "./race";
import { Season } from "./season";
import { Team } from "./team";
import { User } from "./user";

export class FantasyElection {
  id: number | undefined;
  user: User | undefined;
  driverOne: Driver | undefined;
  driverTwo: Driver | undefined;
  driverThree: Driver | undefined;
  teamOne: Team | undefined;
  teamTwo: Team | undefined;
  race: Race | undefined;
  season: Season | undefined;

  constructor(
    id?: number | undefined,
    user?: User | undefined,
    driverOne?: Driver | undefined,
    driverTwo?: Driver | undefined,
    driverThree?: Driver | undefined,
    teamOne?: Team | undefined,
    teamTwo?: Team | undefined,
    race?: Race | undefined,
    season?: Season | undefined,
  ) {
    this.id = id;
    this.user = user;
    this.driverOne = driverOne;
    this.driverTwo = driverTwo;
    this.driverThree = driverThree;
    this.teamOne = teamOne;
    this.teamTwo = teamTwo;
    this.race = race;
    this.season = season;
  }
}
