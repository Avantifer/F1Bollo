import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { environment } from 'src/enviroments/enviroment';
import { Circuit } from 'src/shared/models/circuit';
import { FantasyPointsUser } from 'src/shared/models/fantasyPointsUser';
import { Race } from 'src/shared/models/race';
import { FantasyApiService } from 'src/shared/services/api/fantasy-api.service';
import { RaceApiService } from 'src/shared/services/api/race-api.service';
import { MessageService } from 'src/shared/services/message.service';

@Component({
  selector: 'app-fantasy-clasification',
  templateUrl: './fantasy-clasification.component.html',
  styleUrls: ['./fantasy-clasification.component.scss']
})
export class FantasyClasificationComponent {

  raceForm: FormGroup = new FormGroup({
    race: new FormControl()
  });

  races: Race[] = [];
  fantasyPointsUsers: FantasyPointsUser[] = [];
  displayedColumns: string[] = ["positionUser", "username", "fantasyElection", "totalPoints"];

  raceSelected: Race | undefined;
  firstRaceSelected: Race = new Race(0, new Circuit(0, 'Total', '', '', ''), new Date(), 0);

  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private raceApiService: RaceApiService,
    private messageService: MessageService,
    private fantasyApiService: FantasyApiService
  ) { }

  ngOnInit(): void {
    this.getAllRaces();
    this.changeRace();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Retrieves all previous races for the current season and updates the race selection form.
  */
  getAllRaces(): void {
    this.raceApiService.getAllPrevious(environment.seasonActual)
    .pipe(
      takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (races: Race[]) => {
          this.raceForm.controls['race'].setValue(this.firstRaceSelected);
          this.races.push(this.firstRaceSelected);
          this.races.push(...races);
        },
        error: (error) => {
          this.messageService.showInformation('Al parecer hubo problemas al recoger las carreras');
          console.log(error);
          throw error;
        },
        complete: () => {
          this.getFantasyPoints();
        }
      })
  }

  /**
   * Retrieves fantasy points for the selected race and updates the fantasyPointsUsers array.
  */
  getFantasyPoints(): void {
    this.fantasyApiService.getFantasyPoints(this.raceSelected!.id)
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (fantasyPointsUser: FantasyPointsUser[]) => {
          this.fantasyPointsUsers = fantasyPointsUser;
        },
        error: (error) => {
          this.messageService.showInformation('Al parecer hubo problemas al recoger los puntos');
          console.log(error);
          throw error;
        }
      })
  }

  /**
   * Listens for changes in the selected race within the race form.
  */
  changeRace(): void {
    this.raceForm.valueChanges
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (data: any) => {
          this.raceSelected = data.race;
          this.getFantasyPoints();
        }
      })
  }
}
