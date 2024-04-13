import { Injectable } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { SeasonApiService } from "./api/season-api.service";
import { Season } from "../models/season";
import { environment } from "src/enviroments/enviroment";
import { ERROR_SEASON_FETCH } from "src/app/constants";
import { FormGroup } from "@angular/forms";
import { MessageInfoService } from "./messageinfo.service";

@Injectable({
  providedIn: "root"
})
export class SeasonService {

  constructor(private seasonApiService: SeasonApiService, private messageInfoService: MessageInfoService) { }

  private _unsubscribe: Subject<void> = new Subject<void>();

  /**
   * Fetch all seasons and set a default season in the form.
   */
  obtainAllSeasons(seasonsToUpdate: Season[], seasonSelectedToUpdate: Season, seasonForm: FormGroup): void {
    this.seasonApiService
      .getSeasons()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (seasons: Season[]) => {
          seasonsToUpdate.length = 0;
          seasonsToUpdate.push(...seasons);

          const seasonActual = seasons.find(
            (season: Season) => season.number === environment.seasonActual.number
          );

          if (seasonActual) {
            Object.assign(seasonSelectedToUpdate, seasonActual);
            seasonForm.get("season")?.setValue(seasonActual);
          }
        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_SEASON_FETCH);
          console.log(error);
          throw error;
        }
      });
  }
}
