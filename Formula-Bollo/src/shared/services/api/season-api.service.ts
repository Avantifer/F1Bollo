import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/enviroments/enviroment";
import { Season } from "src/shared/models/season";

@Injectable({
  providedIn: "root",
})
export class SeasonApiService {
  private endpoint: string = "/seasons";

  constructor(private httpClient: HttpClient) {}

  getSeasons(): Observable<Season[]> {
    return this.httpClient.get<Season[]>(
      environment.apiUrl + this.endpoint + "/all",
    );
  }

  getActualSeason(): Observable<Season> {
    return this.httpClient.get<Season>(
      environment.apiUrl + this.endpoint + "/actual",
    );
  }

  getSeasonByDriverName(driverName: string): Observable<Season[]> {
    const params = new HttpParams().set("driverName", driverName);

    return this.httpClient.get<Season[]>(
      environment.apiUrl + this.endpoint + "/byDriverName",
      { params },
    );
  }

  getSeasonByTeamName(teamName: string): Observable<Season[]> {
    const params = new HttpParams().set("teamName", teamName);

    return this.httpClient.get<Season[]>(
      environment.apiUrl + this.endpoint + "/byTeamName",
      { params },
    );
  }

  getSeasonOfFantasy(): Observable<Season[]> {
    return this.httpClient.get<Season[]>(environment.apiUrl + this.endpoint + "/fantasy");
  }
}
