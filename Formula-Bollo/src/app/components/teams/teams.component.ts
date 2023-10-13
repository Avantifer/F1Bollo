import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TeamWithDrivers } from 'src/shared/models/teamWithDrivers';
import { TeamApiService } from 'src/shared/services/api/team-api.service';
import { MessageService } from 'src/shared/services/message.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent {

  teamWithDrivers: TeamWithDrivers[] = [];

  private _unsubscribe = new Subject<void>();

  constructor(private teamApiService: TeamApiService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.obtainAllTeamsWithDrivers();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Get all Teams with their drivers from Backend.
   * @memberof TeamsComponent
  */
  obtainAllTeamsWithDrivers() : void {
    this.teamApiService.getAllTeamsWithDrivers()
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
}
