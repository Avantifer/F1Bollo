import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { ERROR_DRIVER_INFO_FETCH, ERROR_DRIVER_NAME_NOT_FOUND } from "src/app/constants";
import { DriverInfo } from "src/shared/models/driverInfo";
import { Season } from "src/shared/models/season";
import { DriverApiService } from "src/shared/services/api/driver-api.service";
import { SeasonApiService } from "src/shared/services/api/season-api.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";

@Component({
  selector: "app-drivers-info",
  templateUrl: "./drivers-info.component.html",
  styleUrl: "./drivers-info.component.scss"
})
export class DriversInfoComponent {
  seasonForm: FormGroup = new FormGroup({
    season: new FormControl("")
  });
  name: string | null = "";
  seasons: Season[] = [];
  firstSeasonSelected: Season = new Season(0, "Total", 0);
  seasonSelected: Season = this.firstSeasonSelected;
  driverInfo: DriverInfo | undefined;

  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private driverApiService: DriverApiService,
    private seasonApiService: SeasonApiService,
    private messageInfoService: MessageInfoService
  ) { }

  ngOnInit(): void {
    this.name = this.route.snapshot.paramMap.get("name")!.replaceAll("_", " ");
    this.getSeasonsByDriverName(this.name);
    this.changeSeasons();
  }

  /**
   * Retrieves seasons by driver name from the SeasonApiService.
   * If the driver name is not found, it navigates to the "/drivers" route and displays an error message.
   *
   * @param driverName - The name of the driver for whom seasons are to be retrieved.
   */
  getSeasonsByDriverName(driverName: string): void {
    this.seasonApiService
      .getSeasonByDriverName(driverName)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (seasons: Season[]) => {
          this.seasons = seasons;
        },
        error: (error) => {
          this.messageInfoService.showError(error);
          console.log(error);
        },
        complete: () => {
          if (this.seasons.length === 0) {
            this.router.navigate(["/drivers"]);
            this.messageInfoService.showError(ERROR_DRIVER_NAME_NOT_FOUND);
          } else {
            this.seasons.push(this.firstSeasonSelected);
            this.seasons.sort((a: Season, b: Season) => a.id - b.id);
            this.getInfoByDriverName(this.name!);
          }
        }
      });
  }

  /**
   * Retrieves additional information by driver name and season number from the DriverApiService.
   *
   * @param driverName - The name of the driver for whom additional information is to be retrieved.
   * @param seasonNumber - The optional season number for which information is to be fetched.
   */
  getInfoByDriverName(driverName: string, seasonNumber?: number): void {
    this.driverApiService
      .getInfoByDriverName(driverName, seasonNumber)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (driverInfo: DriverInfo) => {
          this.driverInfo = driverInfo;
        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_DRIVER_INFO_FETCH);
          console.log(error);
        }
      });
  }

  /**
   * Listens to changes in the seasonForm and triggers the retrieval of information by driver name accordingly.
   */
  changeSeasons(): void {
    this.seasonForm.valueChanges
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (data) => {
          if (data.season.id === 0 ){
            this.getInfoByDriverName(this.name!);
          } else {
            this.getInfoByDriverName(this.name!, data.season.number);
          }
        }
      });
  }
}
