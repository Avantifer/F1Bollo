import { Season } from "./season";

export class Circuit {
  id : number;
  name : string;
  country : string;
  flagImage : string | null;
  circuitImage : string | null;
  season: Season | undefined;

  constructor(id : number, name : string, country : string, flagImage : string | null, circuitImage : string | null, season?: Season) {
    this.id = id;
    this.name = name;
    this.country = country;
    this.flagImage = flagImage;
    this.circuitImage = circuitImage;
    this.season = season;
  }
}
