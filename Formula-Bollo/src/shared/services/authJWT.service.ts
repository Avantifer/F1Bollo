import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class AuthJWTService {

  constructor(
    private jwtService: JwtHelperService,
    private router: Router,
    private messageService: MessageService
  ) { }

  /**
   * Checks if the user associated with the given JWT token is an admin.
   * @param jwt - The JWT token to check.
   * @returns A boolean indicating whether the user is an admin or not.
   */
  checkAdmin(jwt: string): boolean {
    let isAdmin: boolean = false;
    let token: User | null = this.jwtService.decodeToken(jwt);

    if (token?.admin) isAdmin = true;

    return isAdmin;
  }

  /**
   * Checks if a JWT token is valid.
   * @param token - The JWT token to be checked.
   * @returns A boolean indicating whether the token is valid or not.
   */
  checkTokenValid(token: string | null | undefined): boolean {
    let isValid: boolean = false;

    if (token) {
      let tokenDecoded = this.jwtService.decodeToken(token);

      if (!this.jwtService.isTokenExpired(token) && tokenDecoded.userId) {
        isValid = true;
      }
    }

    return isValid;
  }

  /**
   * Returns the username from a JWT token.
   * @param token - The JWT token.
   * @returns The username extracted from the token.
   */
  getUsernameFromToken(token: string): string {
    let username: string = '';
    let tokenDecoded = this.jwtService.decodeToken(token);

    if (tokenDecoded.userId) username = tokenDecoded.userId;

    return username;
  }

  /**
   * Checks if the user is currently logged in by verifying the presence of a JWT token in local storage.
   * @returns Returns true if the user is logged in, false otherwise.
   */
  isLogged(): boolean {
    let isLogged: boolean = false;
    let token: string | null = localStorage.getItem('auth');

    if (token) isLogged = true;

    return isLogged;
  }

  /**
   * Removes the 'auth' item from local storage, navigates to the login page, and displays a success message.
  */
  logOut(): void {
    localStorage.removeItem('auth');
    this.router.navigate(['/fantasy/login']);
    this.messageService.showInformation('Has cerrado sesión correctamnete');
  }
}
