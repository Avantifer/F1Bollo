import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/enviroments/enviroment";
import { Penalty } from "../../models/penalty";
import { DriverPenalties } from "../../models/driverPenalty";

@Injectable({
  providedIn: "root",
})
export class PenaltyApiService {
  private endpoint: string = "/penalties";

  constructor(private httpClient: HttpClient) {}

  getAllPenalties(seasonNumber?: number): Observable<Penalty[]> {
    const params = seasonNumber
      ? new HttpParams().set("season", seasonNumber)
      : undefined;
    return this.httpClient.get<Penalty[]>(
      environment.apiUrl + this.endpoint + "/all",
      { params },
    );
  }

  getAllPenaltiesPerDriver(
    seasonNumber?: number,
  ): Observable<DriverPenalties[]> {
    const params = seasonNumber
      ? new HttpParams().set("season", seasonNumber)
      : undefined;
    return this.httpClient.get<DriverPenalties[]>(
      environment.apiUrl + this.endpoint + "/totalPerDriver",
      { params },
    );
  }

  getAllPenaltiesPerCircuit(
    circuitId: number,
    seasonNumber?: number,
  ): Observable<Penalty[]> {
    let params = new HttpParams().set("circuitId", circuitId);
    if (seasonNumber) params = params.set("season", seasonNumber);
    const headers = new HttpHeaders().set(
      "Content-type",
      "application/json; charset=utf-8",
    );
    return this.httpClient.get<Penalty[]>(
      environment.apiUrl + this.endpoint + "/circuit",
      { params, headers },
    );
  }

  getPenaltyByDriverAndRaceAndSeverity(
    driverId: number,
    raceId: number,
    severityId: number,
    seasonNumber?: number,
  ): Observable<Penalty[]> {
    let params = new HttpParams()
      .set("driverId", driverId)
      .set("raceId", raceId)
      .set("severityId", severityId);

    if (seasonNumber) params = params.set("season", seasonNumber);
    const headers = new HttpHeaders().set(
      "Content-type",
      "application/json; charset=utf-8",
    );
    return this.httpClient.get<Penalty[]>(
      environment.apiUrl + this.endpoint + "/perDriverPerRace",
      { params, headers },
    );
  }

  savePenalties(
    penalties: Penalty[],
    seasonNumber?: number,
  ): Observable<string> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "application/json",
    });

    const params = seasonNumber
      ? new HttpParams().set("season", seasonNumber)
      : undefined;
    return this.httpClient.put<string>(
      environment.apiUrl + this.endpoint + "/save",
      penalties,
      { headers, params, responseType: "text" as "json" },
    );
  }
}
