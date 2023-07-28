import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/enviroments/enviroment';
import { Race } from '../models/race';

@Injectable({
  providedIn: 'root'
})
export class RaceService {

  private endpoint: string = "/races";

  constructor(private httpClient: HttpClient) { }

  getRacePerCircuit(circuitId: number) {
    const params = new HttpParams().set('circuitId', circuitId.toString());
    const headers = new HttpHeaders().set('Content-type', 'application/json')
    return this.httpClient.get<Race[]>(environment.apiUrl + this.endpoint + '/racesPerCircuit', {params, headers});
  }

  saveRace(race: Race) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'text/plain'
    });
    return this.httpClient.put<string>(environment.apiUrl + this.endpoint + "/saveRace", race, {headers, responseType: 'text' as 'json'});
  }
}
