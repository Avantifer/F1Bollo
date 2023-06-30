import { HttpClient } from "@angular/common/http";
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

  getAllDriverPoints(): Observable<DriverPoints[]> {
    return this.httpClient.get<DriverPoints[]>(environment.apiUrl + this.endpoint + "/totalPerDriver");
  }
}
