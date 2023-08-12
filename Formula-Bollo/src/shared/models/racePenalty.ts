import { Penalty } from "./penalty";
import { Race } from "./race";

export class RacePenalties {
  race: Race;
  penalties: Penalty[];

  constructor(race: Race, penalties: Penalty[]) {
    this.race = race;
    this.penalties = penalties;
  }
}
