export class Configuration {
  id: number;
  setting: string;
  value: string;

  constructor(id: number, setting: string, value: string) {
    this.id = id;
    this.setting = setting;
    this.value = value
  }
}
