import { Driver } from "./driver";

export class DriverInfo {
  driver: Driver;
  poles: number;
  fastlaps: number;
  racesFinished: number;
  totalPoints: number;
  championships: number;
  penalties: number;
  bestPosition: number;
  podiums: number;
  victories: number;

  constructor(
    driver: Driver,
    poles: number,
    fastlaps: number,
    racesFinished: number,
    totalPoints: number,
    championships: number,
    penalties: number,
    bestPosition: number,
    podiums: number,
    victories: number
  ) {
    this.driver = driver;
    this.poles = poles;
    this.fastlaps = fastlaps;
    this.racesFinished = racesFinished;
    this.totalPoints = totalPoints;
    this.championships = championships;
    this.penalties = penalties;
    this.bestPosition = bestPosition;
    this.podiums = podiums;
    this.victories = victories;
  }
}
