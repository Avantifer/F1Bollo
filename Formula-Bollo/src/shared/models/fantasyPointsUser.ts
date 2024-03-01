import { FantasyElection } from "./fantasyElection";
import { User } from "./user";

export class FantasyPointsUser {
  user: User;
  fantasyElection: FantasyElection;
  totalPoints: number;

  constructor(
    user: User,
    fantasyElection: FantasyElection,
    totalPoints: number,
  ) {
    this.user = user;
    this.fantasyElection = fantasyElection;
    this.totalPoints = totalPoints;
  }
}
