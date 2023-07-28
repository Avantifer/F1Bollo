import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroments/enviroment';
import { Admin } from '../models/admin';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private endpoint: string = "/admin";

  constructor(private httpClient: HttpClient) { }

  login(admin: Admin): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'text/plain'
    });
    return this.httpClient.post<string>(environment.apiUrl + this.endpoint + "/login", admin, {headers, responseType: 'text' as 'json'});
  }
}
