import { FantasyElection } from "./fantasyElection";
import { User } from "./user";

export class FantasyPointsUser {
  private user: User;
  private fantasyElection: FantasyElection;
  private totalPoints: number;

  constructor(user: User, fantasyElection: FantasyElection, totalPoints: number) {
    this.user = user;
    this.fantasyElection = fantasyElection;
    this.totalPoints = totalPoints;
  }
}
