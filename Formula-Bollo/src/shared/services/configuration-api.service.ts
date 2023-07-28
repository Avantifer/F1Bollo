import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from '../models/configuration';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private endpoint: string = "/configurations";

  constructor(private httpClient: HttpClient) { }

  getAllConfigurations(): Observable<Configuration[]> {
    return this.httpClient.get<Configuration[]>(environment.apiUrl + this.endpoint + "/all");
  }
}
