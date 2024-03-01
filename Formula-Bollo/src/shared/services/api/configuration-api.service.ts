import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Configuration } from "../../models/configuration";
import { Observable } from "rxjs";
import { environment } from "src/enviroments/enviroment";

@Injectable({
  providedIn: "root",
})
export class ConfigurationApiService {
  private endpoint: string = "/configurations";

  constructor(private httpClient: HttpClient) {}

  getAllConfigurations(seasonNumber?: number): Observable<Configuration[]> {
    const params = seasonNumber
      ? new HttpParams().set("season", seasonNumber)
      : undefined;

    return this.httpClient.get<Configuration[]>(
      environment.apiUrl + this.endpoint + "/all",
      { params },
    );
  }
}
