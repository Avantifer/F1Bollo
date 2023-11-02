import { Driver } from "./driver";

export class User {
  id: number;
  username: string;
  password: string;
  admin?: number;
  driver: Driver | undefined;

  constructor(id: number, username: string, password: string, admin?: number, driver?: Driver) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.admin = admin;
    this.driver = driver;
  }
}
