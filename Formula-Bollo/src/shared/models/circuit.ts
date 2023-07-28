export class Circuit {
  id : number;
  name : string;
  country : string;
  flagImage : string | null;
  circuitImage : string | null;

  constructor(id : number, name : string, country : string, flagImage : string | null, circuitImage : string | null) {
    this.id = id;
    this.name = name;
    this.country = country;
    this.flagImage = flagImage;
    this.circuitImage = circuitImage;
  }
}
