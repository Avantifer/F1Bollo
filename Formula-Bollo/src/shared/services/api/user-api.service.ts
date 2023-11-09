import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroments/enviroment';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  private endpoint: string = "/user";

  constructor(private httpClient: HttpClient) { }

  login(user: User): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'text/plain'
    });
    return this.httpClient.post<string>(environment.apiUrl + this.endpoint + "/login", user, {headers, responseType: 'text' as 'json'});
  }

  register(user: User): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'text/plain'
    });
    return this.httpClient.post<string>(environment.apiUrl + this.endpoint + "/register", user, {headers, responseType: 'text' as 'json'});
  }

  recoverPassword(email: string): Observable<string> {
    const params = new HttpParams().set('email', email);
    return this.httpClient.post<string>(environment.apiUrl + this.endpoint + "/recoverPassword", params, {responseType: 'text' as 'json'});
  }

  changePassword(password: string, username: string): Observable<string> {
    const params = new HttpParams().set('password', password).set('username', username);
    return this.httpClient.post<string>(environment.apiUrl + this.endpoint + "/changePassword", params, {responseType: 'text' as 'json'});
  }
}
