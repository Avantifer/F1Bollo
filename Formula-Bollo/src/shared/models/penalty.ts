import { Driver } from "./driver";
import { PenaltySeverity } from "./penaltySeverity";
import { Race } from "./race";
import { Season } from "./season";

export class Penalty {
  id: number;
  race: Race;
  driver: Driver;
  severity: PenaltySeverity;
  reason: string;
  season: Season | undefined;

  constructor(
    id: number,
    race: Race,
    driver: Driver,
    severity: PenaltySeverity,
    reason: string,
    season?: Season,
  ) {
    this.id = id;
    this.race = race;
    this.driver = driver;
    this.severity = severity;
    this.reason = reason;
    this.season = season;
  }
}
