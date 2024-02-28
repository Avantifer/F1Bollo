import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/enviroments/enviroment";
import { Circuit } from "../../models/circuit";

@Injectable({
  providedIn: "root",
})
export class CircuitApiService {
  private endpoint: string = "/circuits";

  constructor(private httpClient: HttpClient) {}

  getAllCircuits(seasonNumber?: number): Observable<Circuit[]> {
    const params = seasonNumber
      ? new HttpParams().set("season", seasonNumber)
      : undefined;
    return this.httpClient.get<Circuit[]>(
      environment.apiUrl + this.endpoint + "/all",
      { params },
    );
  }
}
