import { Driver } from "./driver";
import { RacePenalties } from "./racePenalty";

export class DriverPenalties {
  driver: Driver;
  racePenalties: RacePenalties[];

  constructor(driver: Driver, racePenalties: RacePenalties[]) {
    this.driver = driver;
    this.racePenalties = racePenalties;
  }
}
