import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/enviroments/enviroment";
import { Driver } from "../../models/driver";
import { DriverInfo } from "src/shared/models/driverInfo";

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

  getInfoByDriverName(driverName: string, seasonNumber?: number): Observable<DriverInfo> {
    let params = new HttpParams().set("driverName", driverName);
    if (seasonNumber) params = params.set("season", seasonNumber);

    return this.httpClient.get<DriverInfo>(
      environment.apiUrl + this.endpoint + "/infoDriverByName",
      { params },
    );
  }

  getDriversByTeam(teamId: number): Observable<Driver[]> {
    const params = new HttpParams().set("teamId", teamId);

    return this.httpClient.get<Driver[]>(
      environment.apiUrl + this.endpoint + "/byTeam",
      { params },
    );
  }

  getAllInfoDrivers(seasonNumber?: number): Observable<DriverInfo[]> {
    const params = seasonNumber
      ? new HttpParams().set("season", seasonNumber)
      : undefined;

    return this.httpClient.get<DriverInfo[]>(`${environment.apiUrl}${this.endpoint}/allInfoDriver`,{ params });
  }
}
