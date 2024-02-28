import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/enviroments/enviroment";
import { PenaltySeverity } from "../../models/penaltySeverity";

@Injectable({
  providedIn: "root",
})
export class PenaltySeverityApiService {
  private endpoint: string = "/penaltiesSeverity";

  constructor(private httpClient: HttpClient) {}

  getAllPenalties(): Observable<PenaltySeverity[]> {
    return this.httpClient.get<PenaltySeverity[]>(
      environment.apiUrl + this.endpoint + "/all",
    );
  }
}
