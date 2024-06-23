import { Season } from "./season";

export class Configuration {
  id: number;
  setting: string;
  settingValue: string;
  season: Season;

  constructor(id: number, setting: string, settingValue: string, season: Season) {
    this.id = id;
    this.setting = setting;
    this.settingValue = settingValue;
    this.season = season;
  }
}
