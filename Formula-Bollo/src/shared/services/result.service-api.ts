import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DriverPoints } from "../models/driverPoints";
import { environment } from "src/enviroments/enviroment";

@Injectable({
  providedIn: 'root'
})

export class ResultService {

  private endpoint: string = "/results";

  constructor(private httpClient: HttpClient) { }

  getAllDriverPoints(numResults?: number): Observable<DriverPoints[]> {
    const params = numResults ? new HttpParams().set('numResults', numResults.toString()) : undefined;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.get<DriverPoints[]>(environment.apiUrl + this.endpoint + "/totalPerDriver", {params, headers});
  }
}
