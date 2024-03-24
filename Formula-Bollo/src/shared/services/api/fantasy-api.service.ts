import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/enviroments/enviroment";
import { FantasyElection } from "src/shared/models/fantasyElection";
import { FantasyInfo } from "src/shared/models/fantasyInfo";
import { FantasyPointsDriver } from "src/shared/models/fantasyPointsDriver";
import { FantasyPointsTeam } from "src/shared/models/fantasyPointsTeam";
import { FantasyPointsUser } from "src/shared/models/fantasyPointsUser";
import { FantasyPriceDriver } from "src/shared/models/fantasyPriceDriver";
import { FantasyPriceTeam } from "src/shared/models/fantasyPriceTeam";

@Injectable({
  providedIn: "root",
})
export class FantasyApiService {
  private endpoint: string = "/fantasy";

  constructor(private httpClient: HttpClient) {}

  saveAllPoints(raceId: number): Observable<string> {
    const params = new HttpParams().set("raceId", raceId);
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "application/json",
    });

    const options = {
      headers: headers,
      params: params,
      responseType: "text" as "json",
    };

    const url = environment.apiUrl + this.endpoint + "/saveDriverTeamPoints";

    return this.httpClient.put<string>(url, {}, options);
  }

  saveAllPrices(raceId: number): Observable<string> {
    const params = new HttpParams().set("raceId", raceId);
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "application/json",
    });

    const options = {
      headers: headers,
      params: params,
      responseType: "text" as "json",
    };

    const url = environment.apiUrl + this.endpoint + "/saveDriverTeamPrices";

    return this.httpClient.put<string>(url, {}, options);
  }

  getAllDriverPoints(raceId: number): Observable<FantasyPointsDriver[]> {
    const params = new HttpParams().set("raceId", raceId);
    return this.httpClient.get<FantasyPointsDriver[]>(
      environment.apiUrl + this.endpoint + "/allDriverPoints",
      { params },
    );
  }

  getDriverPointsSpecificRace(
    driverId: number,
    raceId: number,
  ): Observable<FantasyPointsDriver> {
    const params = new HttpParams()
      .set("driverId", driverId)
      .set("raceId", raceId);
    return this.httpClient.get<FantasyPointsDriver>(
      environment.apiUrl + this.endpoint + "/driverPointsSpecificRace",
      { params },
    );
  }

  getDriverPoints(driverId: number): Observable<FantasyPointsDriver[]> {
    const params = new HttpParams().set("driverId", driverId);
    return this.httpClient.get<FantasyPointsDriver[]>(
      environment.apiUrl + this.endpoint + "/driverPoints",
      { params },
    );
  }

  getAllTeamPoints(raceId: number): Observable<FantasyPointsTeam[]> {
    const params = new HttpParams().set("raceId", raceId);
    return this.httpClient.get<FantasyPointsTeam[]>(
      environment.apiUrl + this.endpoint + "/allTeamPoints",
      { params },
    );
  }

  getTeamsPointsSpecificRace(teamId: number, raceId: number): Observable<FantasyPointsTeam> {
    const params = new HttpParams().set("teamId", teamId).set("raceId", raceId);
    return this.httpClient.get<FantasyPointsTeam>(
      environment.apiUrl + this.endpoint + "/teamsPointsSpecificRace",
      { params },
    );
  }

  getTeamPoints(teamId: number): Observable<FantasyPointsTeam[]> {
    const params = new HttpParams().set("teamId", teamId);
    return this.httpClient.get<FantasyPointsTeam[]>(
      environment.apiUrl + this.endpoint + "/teamPoints",
      { params },
    );
  }

  getAllDriverPrices(raceId: number): Observable<FantasyPriceDriver[]> {
    const params = new HttpParams().set("raceId", raceId);
    return this.httpClient.get<FantasyPriceDriver[]>(
      environment.apiUrl + this.endpoint + "/allDriverPrices",
      { params },
    );
  }

  getDriverPrice(driverId: number): Observable<FantasyPriceDriver[]> {
    const params = new HttpParams().set("driverId", driverId);
    return this.httpClient.get<FantasyPriceDriver[]>(
      environment.apiUrl + this.endpoint + "/driverPrice",
      { params },
    );
  }

  getAllTeamPrices(raceId: number): Observable<FantasyPriceTeam[]> {
    const params = new HttpParams().set("raceId", raceId);
    return this.httpClient.get<FantasyPriceTeam[]>(
      environment.apiUrl + this.endpoint + "/allTeamPrices",
      { params },
    );
  }

  getTeamPrice(teamId: number): Observable<FantasyPriceTeam[]> {
    const params = new HttpParams().set("teamId", teamId);
    return this.httpClient.get<FantasyPriceTeam[]>(
      environment.apiUrl + this.endpoint + "/teamPrice",
      { params },
    );
  }

  getInfoByDriver(driverId: number): Observable<FantasyInfo> {
    const params = new HttpParams().set("driverId", driverId);
    return this.httpClient.get<FantasyInfo>(
      environment.apiUrl + this.endpoint + "/getInfoByDriver",
      { params },
    );
  }

  getInfoByTeam(teamId: number): Observable<FantasyInfo> {
    const params = new HttpParams().set("teamId", teamId);
    return this.httpClient.get<FantasyInfo>(
      environment.apiUrl + this.endpoint + "/getInfoByTeam",
      { params },
    );
  }

  saveFantasyElection(fantasyElection: FantasyElection): Observable<string> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "text/plain",
    });
    return this.httpClient.post<string>(
      environment.apiUrl + this.endpoint + "/saveFantasyElection",
      fantasyElection,
      { headers, responseType: "text" as "json" },
    );
  }

  getFantasyElection(
    raceId: number,
    userId: number,
  ): Observable<FantasyElection> {
    const params = new HttpParams().set("raceId", raceId).set("userId", userId);
    return this.httpClient.get<FantasyElection>(
      environment.apiUrl + this.endpoint + "/getFantasyElection",
      { params },
    );
  }

  getFantasyPoints(raceId: number, season?: number): Observable<FantasyPointsUser[]> {
    let params = new HttpParams().set("raceId", raceId);
    if (season != undefined) params = params.set("season", season);

    return this.httpClient.get<FantasyPointsUser[]>(
      environment.apiUrl + this.endpoint + "/getFantasyPoints",
      { params },
    );
  }
}
