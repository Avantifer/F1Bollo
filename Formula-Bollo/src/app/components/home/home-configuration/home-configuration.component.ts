import { Component } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { ERROR_CONFIGURATION_FETCH } from "src/app/constants";
import { environment } from "src/enviroments/enviroment";
import { Configuration } from "src/shared/models/configuration";
import { ConfigurationApiService } from "src/shared/services/api/configuration-api.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";

@Component({
  selector: "app-home-configuration",
  templateUrl: "./home-configuration.component.html",
  styleUrl: "./home-configuration.component.scss",
})
export class HomeConfigurationComponent {

  configurations: Configuration[] = [];

  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private configurationApiService: ConfigurationApiService,
    private messageInfoService: MessageInfoService,
  ) {}

  ngOnInit(): void {
    this.obtainAllConfigurations();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Fetch all configuration data and update the component"s configurations property.
   */
  obtainAllConfigurations(): void {
    this.configurationApiService
      .getAllConfigurations(environment.seasonActual.number)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (configurations: Configuration[]) => {
          this.configurations = configurations;
        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_CONFIGURATION_FETCH);
          console.log(error);
          throw error;
        },
      });
  }
}
