export class Admin {
  id: number | undefined;
  username: string;
  password: string;

  constructor(id: number | undefined, username: string, password: string) {
    this.id = id;
    this.username = username;
    this.password = password
  }
}
