import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/enviroments/enviroment";
import { Race } from "../../models/race";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RaceApiService {
  private endpoint: string = "/races";

  constructor(private httpClient: HttpClient) {}

  getRacePerCircuit(
    circuitId: number,
    seasonNumber?: number,
  ): Observable<Race[]> {
    let params = new HttpParams().set("circuitId", circuitId);
    if (seasonNumber) params = params.set("season", seasonNumber);
    const headers = new HttpHeaders().set(
      "Content-type",
      "application/json; charset=utf-8",
    );
    return this.httpClient.get<Race[]>(
      environment.apiUrl + this.endpoint + "/circuit",
      { params, headers },
    );
  }

  saveRace(race: Race, seasonNumber?: number): Observable<string> {
    const params = seasonNumber
      ? new HttpParams().set("season", seasonNumber)
      : undefined;
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "text/plain",
    });
    return this.httpClient.put<string>(
      environment.apiUrl + this.endpoint + "/save",
      race,
      { headers, params, responseType: "text" as "json" },
    );
  }

  getAllPreviousAndNextOne(seasonNumber?: number): Observable<Race[]> {
    const params = seasonNumber
      ? new HttpParams().set("season", seasonNumber)
      : undefined;
    return this.httpClient.get<Race[]>(
      environment.apiUrl + this.endpoint + "/allPreviousAndNextOne",
      { params },
    );
  }

  getAllPrevious(seasonNumber?: number): Observable<Race[]> {
    const params = seasonNumber
      ? new HttpParams().set("season", seasonNumber)
      : undefined;
    return this.httpClient.get<Race[]>(
      environment.apiUrl + this.endpoint + "/allPrevious",
      { params },
    );
  }
}
