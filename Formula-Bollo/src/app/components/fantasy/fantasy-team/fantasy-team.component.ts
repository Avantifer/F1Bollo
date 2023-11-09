import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Race } from 'src/shared/models/race';
import { RaceApiService } from 'src/shared/services/api/race-api.service';
import { MessageService } from 'src/shared/services/message.service';

@Component({
  selector: 'app-fantasy-team',
  templateUrl: './fantasy-team.component.html',
  styleUrls: ['./fantasy-team.component.scss']
})
export class FantasyTeamComponent {

  races: Race[] = [];

  raceForm: FormGroup = new FormGroup({
    race: new FormControl('')
  });

  raceSelected: Race | undefined;

  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(private raceApiService: RaceApiService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getAllRaces();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Retrieves all races for the current season and the previous and next one.
   */
  getAllRaces(): void {
    this.raceApiService.getAllPreviousAndNextOne(2)
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (races: Race[]) => {
          this.races = races;
          this.raceSelected = races[races.length - 1];
          this.raceForm.get('race')?.setValue(this.raceSelected);
        },
        error: (error) => {
          console.log(error);
          this.messageService.showInformation('No se obtuvieron las carreras correctamente');
          throw error;
        }
      })
  }
}
