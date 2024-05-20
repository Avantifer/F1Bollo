import { FantasyElection } from "./fantasyElection";
import { Account } from "./account";

export class FantasyPointsUser {
  user: Account;
  fantasyElection: FantasyElection;
  totalPoints: number;

  constructor(
    user: Account,
    fantasyElection: FantasyElection,
    totalPoints: number,
  ) {
    this.user = user;
    this.fantasyElection = fantasyElection;
    this.totalPoints = totalPoints;
  }
}
