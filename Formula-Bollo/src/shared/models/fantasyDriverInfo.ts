export class FantasyDriverInfo {
  totalPoints: number;
  differencePrice: number = 0;

  constructor(totalPoints: number, differencePrice: number) {
    this.totalPoints = totalPoints;
    this.differencePrice = differencePrice;
  }
}
