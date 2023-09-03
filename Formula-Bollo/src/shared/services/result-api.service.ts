import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DriverPoints } from "../models/driverPoints";
import { environment } from "src/enviroments/enviroment";
import { Result } from "../models/result";

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

  getAllResultsPerCircuit(circuitId: number): Observable<Result[]> {
    const params = new HttpParams().set('circuitId', circuitId.toString());
    const headers = new HttpHeaders().set('Content-type', 'application/json')
    return this.httpClient.get<Result[]>(environment.apiUrl + this.endpoint + '/circuit', {params, headers});
  }

  saveResults(results: Result[]): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'text/plain'
    });
    return this.httpClient.put<string>(environment.apiUrl + this.endpoint + "/save", results, {headers, responseType: 'text' as 'json'});
  }
}
