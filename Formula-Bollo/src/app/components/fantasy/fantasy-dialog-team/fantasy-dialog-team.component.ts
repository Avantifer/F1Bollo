import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { FantasyElection } from 'src/shared/models/fantasyElection';
import { FantasyPointsDriver } from 'src/shared/models/fantasyPointsDriver';
import { FantasyPointsTeam } from 'src/shared/models/fantasyPointsTeam';
import { FantasyApiService } from 'src/shared/services/api/fantasy-api.service';
import { MessageService } from 'src/shared/services/message.service';

@Component({
  selector: 'app-fantasy-dialog-team',
  templateUrl: './fantasy-dialog-team.component.html',
  styleUrls: ['./fantasy-dialog-team.component.scss']
})
export class FantasyDialogTeamComponent {

  fantasyElection: FantasyElection | undefined;
  pointsDriverOne: number | undefined;
  pointsDriverTwo: number | undefined;
  pointsDriverThree: number | undefined;
  pointsTeamOne: number | undefined;
  pointsTeamTwo: number | undefined;

  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<FantasyDialogTeamComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fantasyApiService: FantasyApiService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.fantasyElection = this.data.fantasyElection;
    this.getSpecificPointsPerDriver(this.fantasyElection!);
    this.getSpecificPointsPerTeam(this.fantasyElection!);
  }

  /**
    * Closes the currently open dialog.
  */
  closeDialog(): void {
    this.dialogRef.close();
  }

  /**
   * Retrieves specific points for each driver in the fantasy election and updates corresponding properties.
   *
   * @param fantasyElection - The fantasy election data containing driver information.
  */
  getSpecificPointsPerDriver(fantasyElection: FantasyElection): void {
    let raceId: number = fantasyElection.race!.id;

    this.fantasyApiService.getDriverPoints(fantasyElection.driverOne!.id, raceId)
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (fantasyPointsDriver: FantasyPointsDriver) => {
          this.pointsDriverOne = fantasyPointsDriver.points;
        },
        error: () => {
          this.messageService.showInformation('No se pudieron recoger los datos de los pilotos');
        }
      });

    this.fantasyApiService.getDriverPoints(fantasyElection.driverTwo!.id, raceId)
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (fantasyPointsDriver: FantasyPointsDriver) => {
          this.pointsDriverTwo = fantasyPointsDriver.points;
        },
        error: () => {
          this.messageService.showInformation('No se pudieron recoger los datos de los pilotos');
        }
      });

    this.fantasyApiService.getDriverPoints(fantasyElection.driverThree!.id, raceId)
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (fantasyPointsDriver: FantasyPointsDriver) => {
          this.pointsDriverThree = fantasyPointsDriver.points;
        },
        error: () => {
          this.messageService.showInformation('No se pudieron recoger los datos de los pilotos');
        }
      });
  }

  /**
   * Retrieves specific points for each team in the fantasy election and updates corresponding properties.
   *
   * @param fantasyElection - The fantasy election data containing team information.
  */
  getSpecificPointsPerTeam(fantasyElection: FantasyElection): void {
    let raceId: number = fantasyElection.race!.id;

    this.fantasyApiService.getTeamPoints(fantasyElection.teamOne!.id, raceId)
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (fantasyPointsTeam: FantasyPointsTeam) => {
          this.pointsTeamOne = fantasyPointsTeam.points;
        },
        error: () => {
          this.messageService.showInformation('No se pudieron recoger los datos de los pilotos');
        }
      })

      this.fantasyApiService.getTeamPoints(fantasyElection.teamTwo!.id, raceId)
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (fantasyPointsTeam: FantasyPointsTeam) => {
          this.pointsTeamTwo = fantasyPointsTeam.points;
        },
        error: () => {
          this.messageService.showInformation('No se pudieron recoger los datos de los pilotos');
        }
      })
  }
}
