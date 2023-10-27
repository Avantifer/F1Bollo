import { Season } from "./season";

export class Team {
  id: number;
  name: string;
  carImage: string;
  teamImage: string;
  logoImage: string;
  season: Season;

  constructor(id: number, name: string, carImage: string, teamImage: string, logoImage: string, season: Season) {
    this.id = id;
    this.name = name;
    this.carImage = carImage;
    this.teamImage = teamImage;
    this.logoImage = logoImage;
    this.season = season;
  }
}
