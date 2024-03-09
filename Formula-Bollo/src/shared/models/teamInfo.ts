import { Team } from "./team";

export class TeamInfo {
  team: Team;
  poles: number;
  fastlaps: number;
  racesFinished: number;
  totalPoints: number;
  championships: number;
  constructors: number;
  penalties: number;
  bestPosition: number;
  podiums: number;
  victories: number;

  constructor(
    team: Team,
    poles: number,
    fastlaps: number,
    racesFinished: number,
    totalPoints: number,
    championships: number,
    constructors: number,
    penalties: number,
    bestPosition: number,
    podiums: number,
    victories: number
  ) {
    this.team = team;
    this.poles = poles;
    this.fastlaps = fastlaps;
    this.racesFinished = racesFinished;
    this.totalPoints = totalPoints;
    this.championships = championships;
    this.constructors = constructors;
    this.penalties = penalties;
    this.bestPosition = bestPosition;
    this.podiums = podiums;
    this.victories = victories;
  }
}
