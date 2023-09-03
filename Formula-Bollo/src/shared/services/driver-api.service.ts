import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroments/enviroment';
import { Driver } from '../models/driver';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  private endpoint: string = "/drivers";

  constructor(private httpClient: HttpClient) { }

  getAllDrivers(): Observable<Driver[]> {
    return this.httpClient.get<Driver[]>(environment.apiUrl + this.endpoint + "/all");
  }
}
