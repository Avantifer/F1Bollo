import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/enviroments/enviroment';
import { Race } from '../models/race';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RaceService {

  private endpoint: string = "/races";

  constructor(private httpClient: HttpClient) { }

  getRacePerCircuit(circuitId: number): Observable<Race[]> {
    const params = new HttpParams().set('circuitId', circuitId.toString());
    const headers = new HttpHeaders().set('Content-type', 'application/json; charset=utf-8')
    return this.httpClient.get<Race[]>(environment.apiUrl + this.endpoint + '/circuit', {params, headers});
  }

  saveRace(race: Race): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'text/plain'
    });
    return this.httpClient.put<string>(environment.apiUrl + this.endpoint + "/save", race, {headers, responseType: 'text' as 'json'});
  }
}
