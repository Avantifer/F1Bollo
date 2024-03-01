import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DriverPoints } from "../../models/driverPoints";
import { environment } from "src/enviroments/enviroment";
import { Result } from "../../models/result";

@Injectable({
  providedIn: "root",
})
export class ResultApiService {
  private endpoint: string = "/results";

  constructor(private httpClient: HttpClient) {}

  getAllDriverPoints(
    seasonNumber?: number,
    numResults?: number,
  ): Observable<DriverPoints[]> {
    let params = new HttpParams();
    if (numResults) params = params.set("numResults", numResults);
    if (seasonNumber) params = params.set("season", seasonNumber);
    const headers = new HttpHeaders().set(
      "Content-Type",
      "application/json; charset=utf-8",
    );
    return this.httpClient.get<DriverPoints[]>(
      environment.apiUrl + this.endpoint + "/totalPerDriver",
      { params, headers },
    );
  }

  getAllResultsPerCircuit(
    circuitId: number,
    seasonNumber?: number,
  ): Observable<Result[]> {
    let params = new HttpParams().set("circuitId", circuitId);
    if (seasonNumber) params = params.set("season", seasonNumber);
    const headers = new HttpHeaders().set(
      "Content-type",
      "application/json; charset=utf-8",
    );
    return this.httpClient.get<Result[]>(
      environment.apiUrl + this.endpoint + "/circuit",
      { params, headers },
    );
  }

  saveResults(results: Result[], seasonNumber?: number): Observable<string> {
    const params = seasonNumber
      ? new HttpParams().set("circuitId", seasonNumber)
      : undefined;
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "text/plain",
    });
    return this.httpClient.put<string>(
      environment.apiUrl + this.endpoint + "/save",
      results,
      { headers, params, responseType: "text" as "json" },
    );
  }
}
