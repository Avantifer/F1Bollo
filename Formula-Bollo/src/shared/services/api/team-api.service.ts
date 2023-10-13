import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  getAllTeams(): Observable<Team[]> {
    return this.httpClient.get<Team[]>(environment.apiUrl + this.endpoint  + '/all');
  }

  getAllTeamsWithDrivers(): Observable<TeamWithDrivers[]> {
    return this.httpClient.get<TeamWithDrivers[]>(environment.apiUrl + this.endpoint + '/withDrivers');
  }
}
