import { Season } from "./season";

export class Configuration {
  id: number;
  setting: string;
  value: string;
  season: Season;

  constructor(id: number, setting: string, value: string, season: Season) {
    this.id = id;
    this.setting = setting;
    this.value = value;
    this.season = season;
  }
}
