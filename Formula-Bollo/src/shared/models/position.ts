import { Result } from "./result";

export class Position {
  id: number;
  positionNumber: number;
  points: number;

  constructor(id: number, positionNumber: number, points: number) {
    this.id = id;
    this.positionNumber = positionNumber;
    this.points = points;
  }
}
