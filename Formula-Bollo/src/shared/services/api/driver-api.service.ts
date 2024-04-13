import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, switchMap, tap } from "rxjs";
import { environment } from "src/enviroments/enviroment";
import { Driver } from "../../models/driver";
import { DriverInfo } from "src/shared/models/driverInfo";
import { CacheService } from "../cache.service";

@Injectable({
  providedIn: "root",
})
export class DriverApiService {
  private endpoint: string = "/drivers";

  constructor(private httpClient: HttpClient, private cacheService: CacheService) {}

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
    const cacheKey = `drivers-${seasonNumber ?? "all"}`;
    const cachedData$ = this.cacheService.getDataFromCache<DriverInfo[]>(cacheKey);

    return cachedData$.pipe(
      switchMap(cachedData => {
        if (cachedData === null || cachedData === undefined) {
          const params = seasonNumber
            ? new HttpParams().set("season", seasonNumber)
            : undefined;

          return this.httpClient.get<DriverInfo[]>(`${environment.apiUrl}${this.endpoint}/allInfoDriver`,{ params }).pipe(
            tap(data => this.cacheService.setDataInCache(cacheKey, data))
          );
        } else {
          return of(cachedData);
        }
      })
    );
  }
}
