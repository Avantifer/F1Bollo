import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { environment } from 'src/enviroments/enviroment';
import { Season } from 'src/shared/models/season';
import { TeamWithDrivers } from 'src/shared/models/teamWithDrivers';
import { SeasonApiService } from 'src/shared/services/api/season-api.service';
import { TeamApiService } from 'src/shared/services/api/team-api.service';
import { MessageService } from 'src/shared/services/message.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent {

  teamWithDrivers: TeamWithDrivers[] = [];
  seasons: Season[] = [];

  seasonForm: FormGroup = new FormGroup({
    season: new FormControl(''),
  });

  seasonSelected: Season | undefined;

  private _unsubscribe = new Subject<void>();

  constructor(
    private teamApiService: TeamApiService,
    private messageService: MessageService,
    private seasonApiService: SeasonApiService
  ) { }

  ngOnInit(): void {
    this.obtainAllSeasons();
    this.obtainAllTeamsWithDrivers();
    this.changeSeasonTeams();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Get all Teams with their drivers from Backend.
  */
  obtainAllTeamsWithDrivers(seasonNumber?: number) : void {
    this.teamApiService.getAllTeamsWithDrivers(seasonNumber)
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (teamWithDrivers: TeamWithDrivers[]) => {
          this.teamWithDrivers = teamWithDrivers;
        },
        error: (error) => {
          this.messageService.showInformation('No se pudo obtener los equipos correctamente');
          console.log(error);
          throw error;
        }
      });
  }

  /**
   * Fetch all seasons and set a default season in the form.
  */
  obtainAllSeasons(): void {
    this.seasonApiService.getSeasons()
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (seasons: Season[]) => {
          this.seasons = seasons;

          // Put seasonActual on the season Form as default value and update seasonSelected's property
          this.seasonSelected = this.seasons.filter((season: Season) => season.number === environment.seasonActual)[0];
          this.seasonForm.get('season')?.setValue(this.seasonSelected);
        },
        error: (error) => {
          this.messageService.showInformation('No se ha podido recoger las temporadas correctamente');
          console.log(error);
          throw error;
        }
      });
  }

  /**
   * Listen for changes in the selected season and update the list of teams with drivers accordingly.
  */
  changeSeasonTeams(): void {
    this.seasonForm.valueChanges.pipe(
      takeUntil(this._unsubscribe)
    )
    .subscribe((data: any) => {
      this.seasonSelected = data.season;
      this.obtainAllTeamsWithDrivers(this.seasonSelected!.number);
    });
  }
}
