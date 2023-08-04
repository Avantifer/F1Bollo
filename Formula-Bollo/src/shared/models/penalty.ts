import { Driver } from "./driver";
import { PenaltySeverity } from "./penaltySeverity";
import { Race } from "./race";

export class Penalty {
  id: number;
  race: Race;
  driver: Driver;
  severity: PenaltySeverity;
  reason: string;

  constructor(id: number, race: Race, driver: Driver, severity: PenaltySeverity, reason: string) {
    this.id = id;
    this.race = race;
    this.driver = driver;
    this.severity = severity;
    this.reason = reason;
  }
}
