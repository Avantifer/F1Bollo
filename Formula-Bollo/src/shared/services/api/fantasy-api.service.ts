import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/enviroments/enviroment";
import { FantasyDriverInfo } from "src/shared/models/fantasyDriverInfo";
import { FantasyPointsDriver } from "src/shared/models/fantasyPointsDriver";
import { FantasyPointsTeam } from "src/shared/models/fantasyPointsTeam";
import { FantasyPriceDriver } from "src/shared/models/fantasyPriceDriver";
import { FantasyPriceTeam } from "src/shared/models/fantasyPriceTeam";

@Injectable({
  providedIn: 'root'
})

export class FantasyApiService {

  private endpoint: string = "/fantasy";

  constructor(private httpClient: HttpClient) { }

  saveAllPoints(raceId: number): Observable<string> {
    const params = new HttpParams().set('raceId', raceId);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const options = {
      headers: headers,
      params: params,
      responseType: 'text' as 'json'
    };

    const url = environment.apiUrl + this.endpoint + '/saveDriverTeamPoints';

    return this.httpClient.put<string>(url, {}, options);
  }

  saveAllPrices(raceId: number): Observable<string> {
    const params = new HttpParams().set('raceId', raceId);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const options = {
      headers: headers,
      params: params,
      responseType: 'text' as 'json'
    };

    const url = environment.apiUrl + this.endpoint + '/saveDriverTeamPrices';

    return this.httpClient.put<string>(url, {}, options);
  }

  getAllDriverPoints(raceId: number): Observable<FantasyPointsDriver[]> {
    const params = new HttpParams().set('raceId', raceId);
    return this.httpClient.get<FantasyPointsDriver[]>(environment.apiUrl + this.endpoint + '/allDriverPoints', {params});
  }

  getAllTeamPoints(raceId: number): Observable<FantasyPointsTeam[]> {
    const params = new HttpParams().set('raceId', raceId);
    return this.httpClient.get<FantasyPointsTeam[]>(environment.apiUrl + this.endpoint + '/allTeamPoints', {params});
  }

  getAllDriverPrices(raceId: number): Observable<FantasyPriceDriver[]> {
    const params = new HttpParams().set('raceId', raceId);
    return this.httpClient.get<FantasyPriceDriver[]>(environment.apiUrl + this.endpoint + '/allDriverPrices', {params});
  }

  getAllTeamPrices(raceId: number): Observable<FantasyPriceTeam[]> {
    const params = new HttpParams().set('raceId', raceId);
    return this.httpClient.get<FantasyPriceTeam[]>(environment.apiUrl + this.endpoint + '/allTeamPrices', {params});
  }

  getInfoByDriver(driverId: number): Observable<FantasyDriverInfo> {
    const params = new HttpParams().set('driverId', driverId);
    return this.httpClient.get<FantasyDriverInfo>(environment.apiUrl + this.endpoint + '/getInfobyDriver', {params});
  }
}
