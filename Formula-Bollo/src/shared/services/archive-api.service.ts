import { HttpClient, HttpHeaders } from "@angular/common/http";
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

  saveStatute(statute: Archive): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.httpClient.put<string>(environment.apiUrl + this.endpoint + "/statute/save", statute, {headers, responseType: 'text' as 'json'});
  }

}
