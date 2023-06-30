import { Team } from "./team";

export class Driver {
  id: number;
  name: string;
  number: number;
  team: Team;
  driverImage: string;

  constructor(id: number, name: string, number: number, team: Team, driverImage: string) {
    this.id = id;
    this.name = name;
    this.number = number;
    this.team = team;
    this.driverImage = driverImage;
  }
}
