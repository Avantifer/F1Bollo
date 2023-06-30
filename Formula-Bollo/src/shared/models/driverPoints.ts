import { Driver } from "./driver";

export class DriverPoints {
  driver: Driver;
  totalPoints: number;

  constructor(driver: Driver, totalPoints: number) {
    this.driver = driver;
    this.totalPoints = totalPoints;
  }
}
