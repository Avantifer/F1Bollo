import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroments/enviroment';
import { Circuit } from '../models/circuit';

@Injectable({
  providedIn: 'root'
})
export class CircuitService {

  private endpoint: string = "/circuits";

  constructor(private httpClient: HttpClient) { }

  getAllCircuits(): Observable<Circuit[]> {
    return this.httpClient.get<Circuit[]>(environment.apiUrl + this.endpoint + "/all");
  }
}
