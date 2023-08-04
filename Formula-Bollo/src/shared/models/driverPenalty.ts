import { Driver } from "./driver";
import { Penalty } from "./penalty";

export class DriverPenalties {
  driver: Driver;
  penalties: Penalty[];

  constructor(driver: Driver, penalties: Penalty[]) {
    this.driver = driver;
    this.penalties = penalties;
  }
}
