import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/enviroments/enviroment";
import { Penalty } from "../models/penalty";
import { DriverPenalties } from "../models/driverPenalty";

@Injectable({
  providedIn: 'root'
})

export class PenaltyService {

  private endpoint: string = "/penalties";

  constructor(private httpClient: HttpClient) { }

  getAllPenalties(): Observable<Penalty[]> {
    return this.httpClient.get<Penalty[]>(environment.apiUrl + this.endpoint + "/all");
  }

  getAllPenaltiesPerDriver(): Observable<DriverPenalties[]> {
    return this.httpClient.get<DriverPenalties[]>(environment.apiUrl + this.endpoint + '/totalPerDriver');
  }

  getAllPenaltiesPerCircuit(circuitId: number): Observable<Penalty[]> {
    const params = new HttpParams().set('circuitId', circuitId.toString());
    const headers = new HttpHeaders().set('Content-type', 'application/json')
    return this.httpClient.get<Penalty[]>(environment.apiUrl + this.endpoint + '/circuit', {params, headers});
  }

  getPenaltyByDriverAndRace(driverId: number, raceId: number): Observable<Penalty> {
    const params = new HttpParams().set('driverId', driverId.toString()).set('raceId', raceId.toString());
    const headers = new HttpHeaders().set('Content-type', 'application/json')
    return this.httpClient.get<Penalty>(environment.apiUrl + this.endpoint + '/perDriverPerRace', {params, headers});
  }

  savePenalties(penalties: Penalty[]): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.httpClient.put<string>(environment.apiUrl + this.endpoint + "/save", penalties, {headers, responseType: 'text' as 'json'});
  }
}
