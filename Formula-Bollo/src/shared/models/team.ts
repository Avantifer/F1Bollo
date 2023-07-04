export class Team {
  id: number;
  name: string;
  carImage: string;
  teamImage: string;
  logoImage: string;

  constructor(id: number, name: string, carImage: string, teamImage: string, logoImage: string) {
    this.id = id;
    this.name = name;
    this.carImage = carImage;
    this.teamImage = teamImage;
    this.logoImage = logoImage;
  }
}
