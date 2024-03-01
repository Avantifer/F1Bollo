import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/enviroments/enviroment";
import { Driver } from "../../models/driver";

@Injectable({
  providedIn: "root",
})
export class DriverApiService {
  private endpoint: string = "/drivers";

  constructor(private httpClient: HttpClient) {}

  getAllDrivers(seasonNumber?: number): Observable<Driver[]> {
    const params = seasonNumber
      ? new HttpParams().set("season", seasonNumber)
      : undefined;
    return this.httpClient.get<Driver[]>(
      environment.apiUrl + this.endpoint + "/all",
      { params },
    );
  }
}
