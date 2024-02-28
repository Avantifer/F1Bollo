import { Driver } from "./driver";
import { Team } from "./team";

export class TeamWithDrivers {
  teamDTO: Team;
  driver1: Driver;
  driver2: Driver;
  totalPoints: number;

  constructor(
    teamDTO: Team,
    driver1: Driver,
    driver2: Driver,
    totalPoints: number,
  ) {
    this.teamDTO = teamDTO;
    this.driver1 = driver1;
    this.driver2 = driver2;
    this.totalPoints = totalPoints;
  }
}
