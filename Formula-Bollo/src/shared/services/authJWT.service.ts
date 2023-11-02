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

  checkAdmin(jwt: string): boolean {
    let isAdmin: boolean = false;
    let token: User | null = this.jwtService.decodeToken(jwt);

    if (token?.admin) isAdmin = true;

    return isAdmin;
  }

  isLogged(): boolean {
    let isLogged: boolean = false;
    let token: string | null = localStorage.getItem('auth');

    if (token) isLogged = true;

    return isLogged;
  }

  logOut(): void {
    localStorage.removeItem('auth');
    this.router.navigate(['/fantasy/login']);
    this.messageService.showInformation('Has cerrado sesión correctamnete');
  }
}
