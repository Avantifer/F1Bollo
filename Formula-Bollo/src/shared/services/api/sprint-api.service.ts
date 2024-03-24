import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/enviroments/enviroment";
import { Sprint } from "src/shared/models/sprint";

@Injectable({
  providedIn: "root",
})
export class SprintApiService {
  private endpoint: string = "/sprint";

  constructor(private httpClient: HttpClient) {}

  getAllSprintPerCircuit(
    circuitId: number,
    seasonNumber?: number,
  ): Observable<Sprint[]> {
    let params = new HttpParams().set("circuitId", circuitId);
    if (seasonNumber) params = params.set("season", seasonNumber);
    const headers = new HttpHeaders().set(
      "Content-type",
      "application/json; charset=utf-8",
    );
    return this.httpClient.get<Sprint[]>(
      environment.apiUrl + this.endpoint + "/circuit",
      { params, headers },
    );
  }

  saveSprints(sprints: Sprint[], seasonNumber?: number): Observable<string> {
    const params = seasonNumber
      ? new HttpParams().set("season", seasonNumber)
      : undefined;
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "text/plain",
    });
    return this.httpClient.put<string>(
      environment.apiUrl + this.endpoint + "/save",
      sprints,
      { headers, params, responseType: "text" as "json" },
    );
  }
}
