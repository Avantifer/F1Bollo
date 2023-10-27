import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from '../../models/team';
import { environment } from 'src/enviroments/enviroment';
import { TeamWithDrivers } from '../../models/teamWithDrivers';

@Injectable({
  providedIn: 'root'
})
export class TeamApiService {

  private endpoint: string = "/teams";

  constructor(private httpClient: HttpClient) { }

  getAllTeams(numberSeason?: number): Observable<Team[]> {
    const params = numberSeason ? new HttpParams().set('season', numberSeason) : undefined;
    return this.httpClient.get<Team[]>(environment.apiUrl + this.endpoint  + '/all', {params});
  }

  getAllTeamsWithDrivers(numberSeason?: number): Observable<TeamWithDrivers[]> {
    const params = numberSeason ? new HttpParams().set('season', numberSeason) : undefined;
    return this.httpClient.get<TeamWithDrivers[]>(environment.apiUrl + this.endpoint + '/withDrivers', {params});
  }
}
