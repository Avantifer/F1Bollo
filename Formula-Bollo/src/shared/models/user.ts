export class User {
  id: number;
  username?: string;
  password?: string;
  email?: string;
  admin?: number;

  constructor(id: number, username?: string, password?: string, email?: string, admin?: number) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
    this.admin = admin;
  }
}
