import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/enviroments/enviroment";
import { Account } from "../../models/account";

@Injectable({
  providedIn: "root",
})
export class AccountApiService {
  private endpoint: string = "/account";

  constructor(private httpClient: HttpClient) {}

  login(account: Account): Observable<string> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "text/plain",
    });
    return this.httpClient.post<string>(
      environment.apiUrl + this.endpoint + "/login",
      account,
      { headers, responseType: "text" as "json" },
    );
  }

  register(account: Account): Observable<string> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "text/plain",
    });
    return this.httpClient.post<string>(
      environment.apiUrl + this.endpoint + "/register",
      account,
      { headers, responseType: "text" as "json" },
    );
  }

  recoverPassword(email: string): Observable<string> {
    const params = new HttpParams().set("email", email);
    return this.httpClient.post<string>(
      environment.apiUrl + this.endpoint + "/recoverPassword",
      params,
      { responseType: "text" as "json" },
    );
  }

  changePassword(password: string, username: string): Observable<string> {
    const params = new HttpParams()
      .set("password", password)
      .set("username", username);
    return this.httpClient.post<string>(
      environment.apiUrl + this.endpoint + "/changePassword",
      params,
      { responseType: "text" as "json" },
    );
  }
}
