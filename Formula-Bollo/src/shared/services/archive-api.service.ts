import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/enviroments/enviroment";
import { Archive } from "../models/archive";

@Injectable({
  providedIn: 'root'
})

export class ArchiveService {

  private endpoint: string = "/archives";

  constructor(private httpClient: HttpClient) { }

  getStatute(): Observable<Archive> {
    return this.httpClient.get<Archive>(environment.apiUrl + this.endpoint + "/statute");
  }
}
