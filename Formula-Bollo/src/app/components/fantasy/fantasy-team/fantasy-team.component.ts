import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FantasyDriverInfo } from 'src/shared/models/fantasyDriverInfo';
import { FantasyPriceDriver } from 'src/shared/models/fantasyPriceDriver';
import { FantasyPriceTeam } from 'src/shared/models/fantasyPriceTeam';
import { OrderBy } from 'src/shared/models/orderBy';
import { Race } from 'src/shared/models/race';
import { FantasyApiService } from 'src/shared/services/api/fantasy-api.service';
import { RaceApiService } from 'src/shared/services/api/race-api.service';
import { MessageService } from 'src/shared/services/message.service';

@Component({
  selector: 'app-fantasy-team',
  templateUrl: './fantasy-team.component.html',
  styleUrls: ['./fantasy-team.component.scss']
})
export class FantasyTeamComponent {

  races: Race[] = [];
  drivers: FantasyPriceDriver[] = [];
  driversList: FantasyPriceDriver[] = [];
  teams: FantasyPriceTeam[] = [];
  teamsList: FantasyPriceTeam[] = [];

  raceForm: FormGroup = new FormGroup({
    race: new FormControl('')
  });

  fantasyForm: FormGroup = new FormGroup({
    driver1: new FormControl(''),
    driver2: new FormControl(''),
    driver3: new FormControl(''),
    team1: new FormControl(''),
    team2: new FormControl(''),
  });

  driverFinderForm: FormGroup = new FormGroup({
    finder: new FormControl('')
  });

  teamFinderForm: FormGroup = new FormGroup({
    finder: new FormControl('')
  });

  driver1Selected: string | undefined;
  driver2Selected: string | undefined;
  driver3Selected: string | undefined;
  team1Selected: string | undefined;
  team2Selected: string | undefined;
  raceSelected: Race | undefined;
  optionSelected: string = 'Pilotos';

  orders: OrderBy[] = [
    new OrderBy('Nombre', 'ASC'),
    new OrderBy('Precio', 'ASC'),
    new OrderBy('Puntos totales', 'ASC'),
    new OrderBy('Media de puntos', 'ASC'),
  ];

  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private raceApiService: RaceApiService,
    private messageService: MessageService,
    private fantasyApiService: FantasyApiService
  ) { }

  ngOnInit(): void {
    this.getAllRacesWithDriversAndTeams();
    this.changeRace();
    this.changeDriverFinder();
    this.changeTeamFinder();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Retrieves all races for the current season and the previous and next one.
  */
  getAllRacesWithDriversAndTeams(): void {
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
        },
        complete: () => {
          this.getAllDrivers(this.raceSelected!.id);
          this.getAllTeams(this.raceSelected!.id);
        }
      })
  }

  getAllDrivers(raceId: number): void {
    this.fantasyApiService.getAllDriverPrices(raceId)
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (drivers: FantasyPriceDriver[]) => {
          this.drivers = drivers.slice().sort((a: FantasyPriceDriver, b: FantasyPriceDriver) => a.driver.name.localeCompare(b.driver.name));
          this.driversList = drivers.slice().sort((a: FantasyPriceDriver, b: FantasyPriceDriver) => a.driver.name.localeCompare(b.driver.name));
        },
        error: (error) => {
          console.log(error);
          this.messageService.showInformation('No se obtuvieron los pilotos correctamente');
          throw error;
        },
        complete: () => {
          for (let i = 0; i < this.drivers.length; i++) {
            this.getInfoDriver(this.drivers[i], i);
          }
        }
      });
  }

  getInfoDriver(driver: FantasyPriceDriver, index: number) {
    this.fantasyApiService.getInfoByDriver(driver.driver.id)
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (fantasyDriverInfo: FantasyDriverInfo) => {
          let driver: FantasyPriceDriver = this.drivers[index];
          driver.totalPoints = fantasyDriverInfo.totalPoints;
          driver.averagePoints = this.races.length - 1 >= 1 ? fantasyDriverInfo.totalPoints / (this.races.length - 1) : 0;
          driver.differencePrice = fantasyDriverInfo.differencePrice;
        },
        error: (error) => {
          console.log(error);
          this.messageService.showInformation('No se obtuvieron los pilotos correctamente');
          throw error;
        },
      })
  }

  getAllTeams(raceId: number): void {
    this.fantasyApiService.getAllTeamPrices(raceId)
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (teams: FantasyPriceTeam[]) => {
          this.teams = teams.slice().sort((a: FantasyPriceTeam, b: FantasyPriceTeam) => a.team.name.localeCompare(b.team.name));
          this.teamsList = teams.slice().sort((a: FantasyPriceTeam, b: FantasyPriceTeam) => a.team.name.localeCompare(b.team.name));
        },
        error: (error) => {
          console.log(error);
          this.messageService.showInformation('No se obtuvieron los equipos correctamente');
          throw error;
        }
      });
  }

  changeRace(): void {
    this.raceForm.valueChanges
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (data: any) => {
          this.getAllDrivers(data.race.id);
          this.getAllTeams(data.race.id);
          this.driverFinderForm.controls['finder'].setValue('');
        }
      });
  }

  changeOptionSelected(event: EventTarget | null): void {
    if (event === null) return;

    let allOptions: NodeListOf<Element> = document.querySelectorAll(".fantasySelection-mid-table-top-option");
    let previousOptionSelected: Element = document.querySelectorAll(".fantasySelection-mid-table-top-option.selected")[0];
    let previousOptionString: string = '';

    allOptions.forEach(element => {
      if (element.classList.contains('selected')) {
        element.classList.remove('selected');
      }
    });

    let elementSelected: Element = event as Element;

    if (elementSelected.tagName === 'SPAN') {
      elementSelected.parentElement?.classList.add('selected');
      previousOptionString = elementSelected.innerHTML;
      this.changeOptionsData(elementSelected);
    } else {
      if (elementSelected.classList.contains('selected')) return;
      elementSelected.classList.add('selected');
      previousOptionString = elementSelected.children[0].innerHTML;
      this.changeOptionsData(elementSelected.children[0])
    }

    if (previousOptionString != previousOptionSelected.children[0].innerHTML) {
      this.driverFinderForm.controls['finder'].setValue('');
    }
  }

  changeOptionsData(element: Element) {
    if(element.innerHTML === 'Pilotos') {
      this.optionSelected = 'Pilotos';
      this.resetOrders();
    } else if (element.innerHTML === 'Equipos') {
      this.optionSelected = 'Equipos';
      this.resetOrders();
    }
  }

  private resetOrders(): void {
    this.orders.forEach((order: OrderBy) => {
      order.value = 'ASC';
    });

    if (this.optionSelected === 'Pilotos') {
      this.driversList.sort((a: FantasyPriceDriver, b: FantasyPriceDriver) => a.driver.name.localeCompare(b.driver.name));
    } else if (this.optionSelected === 'Equipos'){
      this.teamsList.sort((a: FantasyPriceTeam, b: FantasyPriceTeam) => a.team.name.localeCompare(b.team.name));
    }
  }

  changeDriverFinder(): void {
    this.driverFinderForm.valueChanges
      .pipe(
        takeUntil(this._unsubscribe)
      ).subscribe((data: any) => {
        this.driversList = this.drivers;
        this.driversList = this.driversList.filter((driver: FantasyPriceDriver) => driver.driver.name.toLowerCase().includes(data.finder.toLowerCase()));
      });
  }

  changeTeamFinder(): void {
    this.teamFinderForm.valueChanges
      .pipe(
        takeUntil(this._unsubscribe)
      ).subscribe((data: any) => {
        this.teamsList = this.teams;
        this.teamsList = this.teamsList.filter((team: FantasyPriceTeam) => team.team.name.toLowerCase().includes(data.finder.toLowerCase()));
      });
  }

  changeOrder(order: OrderBy) {
    order.value = order.value === 'ASC' ? 'DESC' : 'ASC';
    this.orders.forEach(element => {
      if (element.name !== order.name) {
        element.value = 'ASC';
      }
    });

    if (order.name === 'Nombre') {
      this.orderByDriverName(order.value);
    } else if (order.name === 'Precio') {
      this.orderByDriverPrice(order.value);
    } else if (order.name === 'Puntos totales') {
      this.orderByDriverTotalPoints(order.value);
    } else if (order.name === 'Media de puntos') {
      this.orderByDriverAveragePoints(order.value);
    }
  }

  private orderByDriverName(orderDirection: string): void {
    if (this.optionSelected === 'Pilotos') {
      this.driversList.sort((a: FantasyPriceDriver, b: FantasyPriceDriver) => orderDirection === 'ASC' ? a.driver.name.localeCompare(b.driver.name) : b.driver.name.localeCompare(a.driver.name));
    } else {
      this.teamsList.sort((a: FantasyPriceTeam, b: FantasyPriceTeam) => orderDirection === 'ASC' ? a.team.name.localeCompare(b.team.name) : b.team.name.localeCompare(a.team.name));
    }
  }

  private orderByDriverPrice(orderDirection: string): void {
    this.driversList.sort((a: FantasyPriceDriver, b: FantasyPriceDriver) => orderDirection === 'ASC' ? a.price - b.price : b.price - a.price);
  }

  private orderByDriverTotalPoints(orderDirection: string): void {
    this.driversList.sort((a: FantasyPriceDriver, b: FantasyPriceDriver) => orderDirection === 'ASC' ? a.totalPoints - b.totalPoints : b.totalPoints - a.totalPoints);
  }

  private orderByDriverAveragePoints(orderDirection: string): void {
    this.driversList.sort((a: FantasyPriceDriver, b: FantasyPriceDriver) => orderDirection === 'ASC' ? a.averagePoints - b.averagePoints : b.averagePoints - a.averagePoints);
  }
}
