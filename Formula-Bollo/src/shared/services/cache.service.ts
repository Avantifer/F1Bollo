/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class CacheService {

  private cache: Map<string, any> = new Map();

  getDataFromCache<T>(key: string): Observable<T> {
    const cachedData = this.cache.get(key);
    return of(cachedData as T);
  }

  setDataInCache<T>(key: string, data: T): void {
    this.cache.set(key, data);
  }

  clearCache(): void {
    this.cache.clear();
  }
}
