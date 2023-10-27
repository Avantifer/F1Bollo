import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/enviroments/enviroment";
import { Season } from "src/shared/models/season";

@Injectable({
  providedIn: 'root'
})

export class SeasonApiService {

  private endpoint: string = "/seasons";

  constructor(private httpClient: HttpClient) { }

  getSeasons(): Observable<Season[]> {
    return this.httpClient.get<Season[]>(environment.apiUrl + this.endpoint + "/all");
  }

  getActualSeason(): Observable<Season> {
    return this.httpClient.get<Season>(environment.apiUrl + this.endpoint + "/actual");
  }
}
