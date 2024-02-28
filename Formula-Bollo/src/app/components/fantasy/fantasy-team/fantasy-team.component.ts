import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";
import { FantasyElection } from "src/shared/models/fantasyElection";
import { FantasyInfo } from "src/shared/models/fantasyInfo";
import { FantasyPriceDriver } from "src/shared/models/fantasyPriceDriver";
import { FantasyPriceTeam } from "src/shared/models/fantasyPriceTeam";
import { OrderBy } from "src/shared/models/orderBy";
import { Race } from "src/shared/models/race";
import { NullableElement } from "src/shared/types/types";
import { FantasyApiService } from "src/shared/services/api/fantasy-api.service";
import { RaceApiService } from "src/shared/services/api/race-api.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { AuthJWTService } from "src/shared/services/authJWT.service";
import { User } from "src/shared/models/user";
import { environment } from "src/enviroments/enviroment";
import { FantasyPointsDriver } from "src/shared/models/fantasyPointsDriver";
import { FantasyPointsTeam } from "src/shared/models/fantasyPointsTeam";
import {
  ERROR_DRIVER_FETCH,
  ERROR_FANTASY_DRIVER_IN_TEAM,
  ERROR_FANTASY_ELECTION_SAVE,
  ERROR_FANTASY_TEAM_IN_DRIVER,
  ERROR_POINT_FETCH,
  ERROR_RACE_FETCH,
  ERROR_TEAM_FETCH,
  WARNING_ELECTION_NOT_COMPLETED,
  WARNING_FANTASY_SAVE_LATE,
  WARNING_MONEY_NEGATIVE
} from "src/app/constants";

@Component({
  selector: "app-fantasy-team",
  templateUrl: "./fantasy-team.component.html",
  styleUrls: ["./fantasy-team.component.scss"],
})
export class FantasyTeamComponent {
  races: Race[] = [];
  drivers: FantasyPriceDriver[] = [];
  driversList: FantasyPriceDriver[] = [];
  teams: FantasyPriceTeam[] = [];
  teamsList: FantasyPriceTeam[] = [];
  orders: OrderBy[] = [
    new OrderBy("Nombre", "ASC"),
    new OrderBy("Precio", "ASC"),
    new OrderBy("Puntos totales", "ASC"),
    new OrderBy("Media puntos", "ASC"),
  ];

  raceForm: FormGroup = new FormGroup({
    race: new FormControl(""),
  });
  fantasyForm: FormGroup = new FormGroup({
    driver1: new FormControl(""),
    driver2: new FormControl(""),
    driver3: new FormControl(""),
    team1: new FormControl(""),
    team2: new FormControl(""),
  });
  driverFinderForm: FormGroup = new FormGroup({
    finder: new FormControl(""),
  });
  teamFinderForm: FormGroup = new FormGroup({
    finder: new FormControl(""),
  });

  fantasyElection: FantasyElection = new FantasyElection();
  fantasyElectionCache: FantasyElection = new FantasyElection();

  raceSelected: Race | undefined;
  optionSelected: string = "Pilotos";
  pointsDriverOne: number | undefined;
  pointsDriverTwo: number | undefined;
  pointsDriverThree: number | undefined;
  pointsTeamOne: number | undefined;
  pointsTeamTwo: number | undefined;

  price: number = 70000000;
  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private raceApiService: RaceApiService,
    private messageInfoService: MessageInfoService,
    private fantasyApiService: FantasyApiService,
    private authJWTService: AuthJWTService,
  ) {}

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
    this.raceApiService
      .getAllPreviousAndNextOne(environment.seasonActual.number)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (races: Race[]) => {
          this.races = races;
          this.raceSelected = races[races.length - 1];
          this.raceForm.get("race")?.setValue(this.raceSelected);
        },
        error: (error) => {
          console.log(error);
          this.messageInfoService.showError(ERROR_RACE_FETCH);
          throw error;
        },
        complete: () => {
          this.getAllDrivers(this.raceSelected!.id);
          this.getAllTeams(this.raceSelected!.id);
          this.getFantasyElection();
        },
      });
  }

  /**
   * Retrieves all drivers with their prices for the current race.
   *
   * @param raceId - the number of the race to retrieve all info
   */
  getAllDrivers(raceId: number): void {
    this.fantasyApiService
      .getAllDriverPrices(raceId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (drivers: FantasyPriceDriver[]) => {
          // Sort alphabetically drivers
          this.drivers = drivers
            .slice()
            .sort((a: FantasyPriceDriver, b: FantasyPriceDriver) =>
              a.driver.name.localeCompare(b.driver.name),
            );
          this.driversList = drivers
            .slice()
            .sort((a: FantasyPriceDriver, b: FantasyPriceDriver) =>
              a.driver.name.localeCompare(b.driver.name),
            );
        },
        error: (error) => {
          console.log(error);
          this.messageInfoService.showError(ERROR_DRIVER_FETCH);
          throw error;
        },
        complete: () => {
          for (let i = 0; i < this.drivers.length; i++) {
            this.getInfoDriver(this.drivers[i], i);
          }
        },
      });
  }

  /**
   * Get driver's general info.
   *
   * @param driver - the driver to get the info.
   * @param index - the position of the team in the teams list.
   */
  private getInfoDriver(driver: FantasyPriceDriver, index: number): void {
    this.fantasyApiService
      .getInfoByDriver(driver.driver.id)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (fantasyDriverInfo: FantasyInfo) => {
          const driver: FantasyPriceDriver = this.drivers[index];
          driver.totalPoints = fantasyDriverInfo.totalPoints;
          driver.averagePoints =
            this.races.length - 1 >= 1
              ? fantasyDriverInfo.totalPoints / (this.races.length - 1)
              : 0;
          driver.differencePrice = fantasyDriverInfo.differencePrice;
        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_DRIVER_FETCH);
          console.log(error);
          throw error;
        },
      });
  }

  /**
   * Retrieves all teams with their prices for the current race.
   *
   * @param raceId - the number of the race to retrieve all info
   */
  getAllTeams(raceId: number): void {
    this.fantasyApiService
      .getAllTeamPrices(raceId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (teams: FantasyPriceTeam[]) => {
          // Sort alphabetically teams
          this.teams = teams
            .slice()
            .sort((a: FantasyPriceTeam, b: FantasyPriceTeam) =>
              a.team.name.localeCompare(b.team.name),
            );
          this.teamsList = teams
            .slice()
            .sort((a: FantasyPriceTeam, b: FantasyPriceTeam) =>
              a.team.name.localeCompare(b.team.name),
            );
        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_TEAM_FETCH);
          console.log(error);
          throw error;
        },
        complete: () => {
          this.teams.forEach((team: FantasyPriceTeam, index: number) => {
            this.getInfoTeam(team, index);
          });
        },
      });
  }

  /**
   * Get team's general info.
   *
   * @param team - the team to get the info.
   * @param index - the position of the team in the teams list.
   */
  private getInfoTeam(team: FantasyPriceTeam, index: number): void {
    this.fantasyApiService
      .getInfoByTeam(team.team.id)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (fantasyDriverInfo: FantasyInfo) => {
          const team: FantasyPriceTeam = this.teams[index];
          team.totalPoints = fantasyDriverInfo.totalPoints;
          team.averagePoints =
            this.races.length - 1 >= 1
              ? fantasyDriverInfo.totalPoints / (this.races.length - 1)
              : 0;
          team.differencePrice = fantasyDriverInfo.differencePrice;
        },
        error: (error) => {
          console.log(error);
          this.messageInfoService.showError(ERROR_DRIVER_FETCH);
          throw error;
        },
      });
  }

  /**
   * Listen for changes in the selected race and update the list of drivers and teams.
   */
  changeRace(): void {
    this.raceForm.valueChanges.pipe(takeUntil(this._unsubscribe)).subscribe({
      next: (data) => {
        if (this.raceSelected === undefined) return;
        this.raceSelected = data.race;
        this.optionSelected = "Pilotos";

        this.getFantasyElection();
        this.getAllDrivers(data.race.id);
        this.getAllTeams(data.race.id);
        this.driverFinderForm.controls["finder"].setValue("");
      },
    });
  }

  /**
   * Change the option selected to show drivers or teams, depends of the option.
   *
   * @param event - the target of the event selected in HTML.
   */
  changeOptionSelected(event: EventTarget | null): void {
    const previousOptionSelected: Element | null = document.querySelector(
      ".fantasySelection-mid-table-top-option.selected",
    );
    if (previousOptionSelected)
      previousOptionSelected.classList.remove("selected");

    if (event === null) return;
    const elementSelected: Element = event as Element;

    elementSelected.classList.add("selected");
    this.optionSelected = elementSelected.children[0].innerHTML;

    if (this.optionSelected != previousOptionSelected?.children[0].innerHTML) {
      this.driverFinderForm.controls["finder"].setValue("");
      this.resetOrders();
    }

    this.changeOptionFormSelected();
  }

  /**
   * Change the option form selected depends of the option.
   */
  private changeOptionFormSelected() {
    const elementPreviousSelected: Element | null = document.querySelector(
      ".fantasySelection-optionForm.selected",
    );
    elementPreviousSelected?.classList.remove("selected");

    if (this.optionSelected === "Pilotos") {
      let elementDriver: Element | null = null;

      if (!this.fantasyElection.driverOne) {
        elementDriver = document.querySelector(".driver1");
      } else if (!this.fantasyElection.driverTwo) {
        elementDriver = document.querySelector(".driver2");
      } else if (!this.fantasyElection.driverThree) {
        elementDriver = document.querySelector(".driver3");
      }

      if (elementDriver) {
        elementDriver.classList.add("selected");
      }
    } else if (this.optionSelected === "Equipos") {
      let elementTeam: Element | null = null;

      if (!this.fantasyElection.teamOne) {
        elementTeam = document.querySelector(".team1");
      } else if (!this.fantasyElection.teamTwo) {
        elementTeam = document.querySelector(".team2");
      }

      if (elementTeam) {
        elementTeam.classList.add("selected");
      }
    }
  }

  /**
   * Reset all orders and set default order (alphabetically)
   */
  private resetOrders(): void {
    this.orders.forEach((order: OrderBy) => {
      order.value = "ASC";
    });

    this.orderByName("ASC");
  }

  /**
   * Listen for changes in the finder and filters the list of drivers according to the input provided in the finder field.
   */
  changeDriverFinder(): void {
    this.driverFinderForm.valueChanges
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((data) => {
        this.driversList = this.drivers;
        this.driversList = this.driversList.filter(
          (driver: FantasyPriceDriver) =>
            driver.driver.name
              .toLowerCase()
              .includes(data.finder.toLowerCase()),
        );
      });
  }

  /**
   * Listen for changes in the finder and filters the list of teams according to the input provided in the finder field.
   */
  changeTeamFinder(): void {
    this.teamFinderForm.valueChanges
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((data) => {
        this.teamsList = this.teams;
        this.teamsList = this.teamsList.filter((team: FantasyPriceTeam) =>
          team.team.name.toLowerCase().includes(data.finder.toLowerCase()),
        );
      });
  }

  /**
   * Order drivers list or team list by the order in the params.
   *
   * @param order - The order object to be toggled.
   */
  changeOrder(order: OrderBy): void {
    order.value = order.value === "ASC" ? "DESC" : "ASC";
    this.orders.forEach((element) => {
      if (element.name !== order.name) {
        element.value = "ASC";
      }
    });

    if (order.name === "Nombre") {
      this.orderByName(order.value);
    } else if (order.name === "Precio") {
      this.orderByPrice(order.value);
    } else if (order.name === "Puntos totales") {
      this.orderByTotalPoints(order.value);
    } else if (order.name === "Media puntos") {
      this.orderByAveragePoints(order.value);
    }
  }

  /**
   * Order drivers list or team list by name.
   *
   * @param orderDirection - The direction of the order. ASC or DESC.
   */
  private orderByName(orderDirection: string): void {
    if (this.optionSelected === "Pilotos") {
      this.driversList.sort((a: FantasyPriceDriver, b: FantasyPriceDriver) =>
        orderDirection === "ASC"
          ? a.driver.name.localeCompare(b.driver.name)
          : b.driver.name.localeCompare(a.driver.name),
      );
    } else {
      this.teamsList.sort((a: FantasyPriceTeam, b: FantasyPriceTeam) =>
        orderDirection === "ASC"
          ? a.team.name.localeCompare(b.team.name)
          : b.team.name.localeCompare(a.team.name),
      );
    }
  }

  /**
   * Order drivers list or team list by price.
   *
   * @param orderDirection - The direction of the order. ASC or DESC.
   */
  private orderByPrice(orderDirection: string): void {
    if (this.optionSelected === "Pilotos") {
      this.driversList.sort((a: FantasyPriceDriver, b: FantasyPriceDriver) =>
        orderDirection === "ASC" ? a.price - b.price : b.price - a.price,
      );
    } else {
      this.teamsList.sort((a: FantasyPriceTeam, b: FantasyPriceTeam) =>
        orderDirection === "ASC" ? a.price - b.price : b.price - a.price,
      );
    }
  }

  /**
   * Order drivers list or team list by total points.
   *
   * @param orderDirection - The direction of the order. ASC or DESC.
   */
  private orderByTotalPoints(orderDirection: string): void {
    if (this.optionSelected === "Pilotos") {
      this.driversList.sort((a: FantasyPriceDriver, b: FantasyPriceDriver) =>
        orderDirection === "ASC"
          ? a.totalPoints - b.totalPoints
          : b.totalPoints - a.totalPoints,
      );
    } else {
      this.teamsList.sort((a: FantasyPriceTeam, b: FantasyPriceTeam) =>
        orderDirection === "ASC"
          ? a.totalPoints - b.totalPoints
          : b.totalPoints - a.totalPoints,
      );
    }
  }

  /**
   * Order drivers list or team list by average points.
   *
   * @param orderDirection - The direction of the order. ASC or DESC.
   */
  private orderByAveragePoints(orderDirection: string): void {
    if (this.optionSelected === "Pilotos") {
      this.driversList.sort((a: FantasyPriceDriver, b: FantasyPriceDriver) =>
        orderDirection === "ASC"
          ? a.averagePoints - b.averagePoints
          : b.averagePoints - a.averagePoints,
      );
    } else {
      this.teamsList.sort((a: FantasyPriceTeam, b: FantasyPriceTeam) =>
        orderDirection === "ASC"
          ? a.averagePoints - b.averagePoints
          : b.averagePoints - a.averagePoints,
      );
    }
  }

  /**
   * Change the optionForm to be selected.
   *
   * @param event - The target of the optionForm selected.
   */
  changeDriverTeamSelected(event: EventTarget | null): void {
    if (event === null) return;
    const previousOptionFormSelected: Element | null = document.querySelector(
      ".fantasySelection-optionForm.selected",
    );
    if (previousOptionFormSelected)
      previousOptionFormSelected.classList.remove("selected");

    const elementSelected: Element = event as Element;
    elementSelected.classList.add("selected");

    this.comprobateOptionFantasySelection();
  }

  /**
   * Move the driver to optionForm and be selected on the fantasyElection.
   *
   * @param driver - The driver that the user wants to add.
   */
  addDriverToSelection(driver: FantasyPriceDriver): void {
    const optionFormSelected: Element | null = document.querySelector(
      ".fantasySelection-optionForm.selected",
    );
    if (optionFormSelected === null) return;
    optionFormSelected.classList.remove("selected");

    this.comprobateOptionFantasySelection();
    this.setOrderDriver(driver, optionFormSelected);
    this.putDriverSelected(optionFormSelected);
  }

  /**
   * Change the option of drivers or teams depends of the optionForm selected
   */
  private comprobateOptionFantasySelection(): void {
    const optionFormSelected: Element | null = document.querySelector(
      ".fantasySelection-optionForm.selected",
    );
    if (optionFormSelected === null) return;

    if (optionFormSelected.classList.item(1)?.includes("driver")) {
      this.optionSelected = "Pilotos";
    } else if (optionFormSelected.classList.item(1)?.includes("team")) {
      this.optionSelected = "Equipos";
    }

    this.changeOptionSelected(null);

    const optionSelected: NodeListOf<Element> | null = document.querySelectorAll(
      ".fantasySelection-mid-table-top-option",
    );

    optionSelected.forEach((element: Element) => {
      if (element.children[0].innerHTML === this.optionSelected) {
        element.classList.add("selected");
      }
    });

    this.resetOrders();
  }

  /**
   * The position that the drivers have in the fantasyElection
   *
   * @param driver - The driver that the user wants to add.
   * @param element - The optionForm wich the user selected and driver appears.
   */
  private setOrderDriver(driver: FantasyPriceDriver, element: Element): void {
    if (element.classList[1].includes("team")) {
      this.messageInfoService.showError(ERROR_FANTASY_DRIVER_IN_TEAM);
      return;
    }

    if (element.classList[1].includes("driver1")) {
      this.fantasyElection.driverOne = driver.driver;
      this.fantasyElectionCache.driverOne = driver.driver;
    } else if (element.classList[1].includes("driver2")) {
      this.fantasyElection.driverTwo = driver.driver;
      this.fantasyElectionCache.driverTwo = driver.driver;
    } else if (element.classList[1].includes("driver3")) {
      this.fantasyElection.driverThree = driver.driver;
      this.fantasyElectionCache.driverThree = driver.driver;
    }

    this.calculateTotalPrice();
  }

  /**
   * The position that the drivers have in the page or select teams if all drivers has appeared.
   *
   * @param element - The optionForm wich the user selected and driver appears.
   */
  private putDriverSelected(element: Element): void {
    let firstContainerNotPreviousSelected: Element | null = null;

    if (!this.fantasyElection.driverOne) {
      firstContainerNotPreviousSelected =
        element.parentElement?.parentElement?.childNodes.item(0) as Element;
    } else if (!this.fantasyElection.driverTwo) {
      firstContainerNotPreviousSelected =
        element.parentElement?.parentElement?.childNodes.item(1) as Element;
    } else if (!this.fantasyElection.driverThree) {
      firstContainerNotPreviousSelected =
        element.parentElement?.parentElement?.childNodes.item(2) as Element;
    }

    if (firstContainerNotPreviousSelected) {
      firstContainerNotPreviousSelected.children[0].classList.add("selected");
    } else {
      if (!this.fantasyElection.teamOne) {
        firstContainerNotPreviousSelected = document.querySelector(".team1");
      } else if (!this.fantasyElection.teamTwo) {
        firstContainerNotPreviousSelected = document.querySelector(".team2");
      }

      firstContainerNotPreviousSelected?.classList.add("selected");
      this.optionSelected = "Equipos";
      this.changeOptionSelected(null);
      const optionSelected: NodeListOf<Element> | null =
        document.querySelectorAll(".fantasySelection-mid-table-top-option");

      optionSelected.forEach((element: Element) => {
        if (element.children[0].innerHTML === this.optionSelected) {
          element.classList.add("selected");
        }
      });
      this.changeOptionFormSelected();
    }
  }

  /**
   * Move the team to optionForm and be selected on the fantasyElection.
   *
   * @param team - The team that the user wants to add.
   */
  addTeamToSelection(team: FantasyPriceTeam): void {
    const optionFormSelected: Element | null = document.querySelector(
      ".fantasySelection-optionForm.selected",
    );
    if (optionFormSelected === null) return;

    optionFormSelected.classList.remove("selected");

    this.setOrderTeam(team, optionFormSelected);
    this.putTeamSelected(optionFormSelected);
  }

  /**
   * The position that the team have in the fantasyElection
   *
   * @param driver - The team that the user wants to add.
   * @param element - The optionForm wich the user selected and team appears.
   */
  private setOrderTeam(team: FantasyPriceTeam, element: Element): void {
    if (element.classList[1].includes("driver")) {
      this.messageInfoService.showError(ERROR_FANTASY_TEAM_IN_DRIVER);
      return;
    }

    if (element.classList[1].includes("team1")) {
      this.fantasyElection.teamOne = team.team;
    } else if (element.classList[1].includes("team2")) {
      this.fantasyElection.teamTwo = team.team;
    }

    this.calculateTotalPrice();
  }

  /**
   * The position that the team have in the page
   *
   * @param element - The optionForm wich the user selected and driver appears.
   */
  private putTeamSelected(element: Element): void {
    let firstContainerNotPreviousSelected: Element | null = null;

    if (!this.fantasyElection.teamOne) {
      firstContainerNotPreviousSelected =
        element.parentElement?.parentElement?.childNodes.item(0) as Element;
    } else if (!this.fantasyElection.teamTwo) {
      firstContainerNotPreviousSelected =
        element.parentElement?.parentElement?.childNodes.item(1) as Element;
    }

    if (firstContainerNotPreviousSelected) {
      firstContainerNotPreviousSelected.children[0].classList.add("selected");
    }
  }

  /**
   * Check if the driver is selected.
   *
   * @param driver - The driver that we want to check.
   * @return true or false if the driver is selected
   */
  comprobateIfDriverIsElected(driver: FantasyPriceDriver): boolean {
    let notSelected: boolean = true;

    if (
      this.fantasyElection.driverOne?.id === driver.driver.id ||
      this.fantasyElection.driverTwo?.id === driver.driver.id ||
      this.fantasyElection.driverThree?.id === driver.driver.id
    ) {
      notSelected = false;
    }

    return notSelected;
  }

  /**
   * Check if the team is selected.
   *
   * @param team - The team that we want to check.
   * @return true or false if the team is selected
   */
  comprobateIfTeamIsElected(team: FantasyPriceTeam): boolean {
    let notSelected: boolean = true;

    if (
      this.fantasyElection.teamOne?.id === team.team.id ||
      this.fantasyElection.teamTwo?.id === team.team.id
    ) {
      notSelected = false;
    }

    return notSelected;
  }

  /**
   * Remove the driver selected and select option form that was the driver removed.
   *
   * @param event - the target of the event selected in HTML.
   */
  removeDriverSelected(event: EventTarget | null): void {
    if (event === null) return;

    const element: Element | null = event as Element;

    this.deleteDriverOfTheSelection(element);
    this.deleteDriverTeamBackground(element);

    // Select the same input that the drivers was deleted
    const input: NullableElement = element.parentElement?.nextElementSibling;
    const previousInputSelected: Element | null = document.querySelector(
      ".fantasySelection-optionForm.selected",
    );

    previousInputSelected?.classList.remove("selected");
    input?.classList.add("selected");

    if (input?.classList.item(1)?.includes("driver")) {
      this.optionSelected = "Pilotos";

      this.changeOptionSelected(null);

      const optionSelected: NodeListOf<Element> | null =
        document.querySelectorAll(".fantasySelection-mid-table-top-option");

      optionSelected.forEach((element: Element) => {
        if (element.children[0].innerHTML === this.optionSelected) {
          element.classList.add("selected");
        }
      });
    }
  }

  /**
   * Remove the photo of the driver in the optionForm.
   *
   * @param element - the element that needs to remove the image.
   */
  private deleteDriverOfTheSelection(element: Element) {
    const driverNumberClass: string | null | undefined =
      element.parentElement?.nextElementSibling?.classList.item(1);
    if (driverNumberClass === null || driverNumberClass === undefined) return;

    if (driverNumberClass === "driver1") {
      this.fantasyElection.driverOne = undefined;
      this.fantasyElectionCache.driverOne = undefined;
    } else if (driverNumberClass === "driver2") {
      this.fantasyElection.driverTwo = undefined;
      this.fantasyElectionCache.driverTwo = undefined;
    } else if (driverNumberClass === "driver3") {
      this.fantasyElection.driverThree = undefined;
      this.fantasyElectionCache.driverThree = undefined;
    }

    this.calculateTotalPrice();
  }

  /**
   * Remove the color background of the team.
   *
   * @param element - the element that needs to remove the background.
   */
  private deleteDriverTeamBackground(element: Element) {
    const elementPhoto: NullableElement =
      element.parentElement?.nextElementSibling?.nextElementSibling;
    if (elementPhoto === null || elementPhoto === undefined) return;
    elementPhoto.classList.remove(
      elementPhoto.classList.item(elementPhoto.classList.length - 1)!,
    );
  }

  /**
   * Remove the team selected and select option form that was the team removed.
   *
   * @param event - the target of the event selected in HTML.
   */
  removeTeamSelected(event: EventTarget | null): void {
    if (event === null) return;

    const element: Element | null = event as Element;

    this.deleteTeamOfTheSelection(element);
    this.deleteDriverTeamBackground(element);

    // Select the same input that the drivers was deleted
    const input: NullableElement = element.parentElement?.nextElementSibling;
    const previousInputSelected: Element | null = document.querySelector(
      ".fantasySelection-optionForm.selected",
    );

    previousInputSelected?.classList.remove("selected");
    input?.classList.add("selected");

    if (input?.classList.item(1)?.includes("team")) {
      this.optionSelected = "Equipos";

      this.changeOptionSelected(null);
      const optionSelected: NodeListOf<Element> | null =
        document.querySelectorAll(".fantasySelection-mid-table-top-option");

      optionSelected.forEach((element: Element) => {
        if (element.children[0].innerHTML === this.optionSelected) {
          element.classList.add("selected");
        }
      });
    }
  }

  /**
   * Remove the photo of the team in the optionForm.
   *
   * @param element - the element that needs to remove the image.
   */
  private deleteTeamOfTheSelection(element: Element) {
    const driverNumberClass: string | null | undefined =
      element.parentElement?.nextElementSibling?.classList.item(1);
    if (driverNumberClass === null || driverNumberClass === undefined) return;

    if (driverNumberClass === "team1") {
      this.fantasyElection.teamOne = undefined;
    } else if (driverNumberClass === "team2") {
      this.fantasyElection.teamTwo = undefined;
    }

    this.calculateTotalPrice();
  }

  /**
   * Calculate the total price
   */
  private calculateTotalPrice(): void {
    this.price = 70000000;
    this.calculateDriversValue();
    this.calculateTeamsValue();
  }

  /**
   * Calculate the price of the drivers
   */
  private calculateDriversValue(): void {
    if (this.fantasyElection.driverOne) {
      const driverOne: FantasyPriceDriver = this.driversList.filter(
        (driver: FantasyPriceDriver) =>
          this.fantasyElection.driverOne!.id === driver.driver.id,
      )[0];
      this.price -= driverOne?.price;
    }

    if (this.fantasyElection.driverTwo) {
      const driverTwo: FantasyPriceDriver = this.driversList.filter(
        (driver: FantasyPriceDriver) =>
          this.fantasyElection.driverTwo!.id === driver.driver.id,
      )[0];
      this.price -= driverTwo?.price;
    }

    if (this.fantasyElection.driverThree) {
      const driverThree: FantasyPriceDriver = this.driversList.filter(
        (driver: FantasyPriceDriver) =>
          this.fantasyElection.driverThree!.id === driver.driver.id,
      )[0];
      this.price -= driverThree?.price;
    }
  }

  /**
   * Calculate the price of the teams
   */
  private calculateTeamsValue(): void {
    if (this.fantasyElection.teamOne) {
      const teamOne: FantasyPriceTeam = this.teamsList.filter(
        (team: FantasyPriceTeam) =>
          this.fantasyElection.teamOne!.id === team.team.id,
      )[0];
      this.price -= teamOne?.price;
    }

    if (this.fantasyElection.teamTwo) {
      const teamTwo: FantasyPriceTeam = this.teamsList.filter(
        (team: FantasyPriceTeam) =>
          this.fantasyElection.teamTwo!.id === team.team.id,
      )[0];
      this.price -= teamTwo?.price;
    }
  }

  /**
   * Save the fantasy selection selected to the db.
   */
  saveFantasyElection(): void {

    if (this.raceSelected?.dateStart) {
      const today: Date = new Date();
      const dateStart: Date = new Date(this.raceSelected?.dateStart);

      const differenceMiliseconds: number = Math.abs(dateStart.getTime() - today.getTime());
      const differenceHours: number = differenceMiliseconds / (1000 * 60 * 60);

      if (differenceHours > 12) {
        this.messageInfoService.showWarn(WARNING_FANTASY_SAVE_LATE);
        return;
      }
    }

    if (
      this.fantasyElection.driverOne &&
      this.fantasyElection.driverTwo &&
      this.fantasyElection.driverThree &&
      this.fantasyElection.teamOne &&
      this.fantasyElection.teamTwo
    ) {
      if (this.price < 0)
        return this.messageInfoService.showWarn(WARNING_MONEY_NEGATIVE);

      this.fantasyElection.race = this.raceSelected;
      this.fantasyElection.season = this.raceSelected?.season;
      this.fantasyElection.user = new User(
        parseInt(
          this.authJWTService.getIdFromToken(localStorage.getItem("auth")!),
        ),
      );

      this.fantasyApiService
        .saveFantasyElection(this.fantasyElection)
        .pipe(takeUntil(this._unsubscribe))
        .subscribe({
          next: (success: string) => {
            this.messageInfoService.showSuccess(success);
          },
          error: (error) => {
            this.messageInfoService.showError(ERROR_FANTASY_ELECTION_SAVE);
            console.log(error);
            throw error;
          },
        });
    } else {
      this.messageInfoService.showWarn(WARNING_ELECTION_NOT_COMPLETED);
    }
  }

  /**
   * Retrieve the fantasy selection of the user in the race selected from the db.
   */
  getFantasyElection(): void {
    this.fantasyApiService
      .getFantasyElection(
        this.raceSelected!.id,
        parseInt(
          this.authJWTService.getIdFromToken(localStorage.getItem("auth")!),
        ),
      )
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (fantasyElection: FantasyElection) => {
          if (fantasyElection.race != undefined) {
            this.fantasyElection = fantasyElection;
          } else {
            this.fantasyElection = this.fantasyElectionCache;
          }
        },
        complete: () => {
          this.resetSelectedItem();
          this.calculateTotalPrice();
          if (this.fantasyElection.race != undefined) {
            this.getSpecificPointsPerDriver(this.fantasyElection);
            this.getSpecificPointsPerTeam(this.fantasyElection);
          }
        },
      });
  }

  /**
   * Delete itemSelected if you change between drivers and teams, and activate it if needed.
   */
  resetSelectedItem(): void {
    document.querySelector("input.selected")?.classList.remove("selected");
    if (
      !this.raceSelected?.finished &&
      this.fantasyElection.race === undefined
    ) {
      if (!this.fantasyElection.driverOne) {
        document.querySelector(".driver1")?.classList.add("selected");
      } else if (!this.fantasyElection.driverTwo) {
        document.querySelector(".driver2")?.classList.add("selected");
      } else if (!this.fantasyElection.driverThree) {
        document.querySelector(".driver3")?.classList.add("selected");
      } else if (!this.fantasyElection.teamOne) {
        document.querySelector(".team1")?.classList.add("selected");
      } else if (!this.fantasyElection.teamTwo) {
        document.querySelector(".team2")?.classList.add("selected");
      }
    }
  }

  /**
   * Retrieves specific points for each driver in the fantasy election and updates corresponding properties.
   *
   * @param fantasyElection - The fantasy election data containing driver information.
   */
  getSpecificPointsPerDriver(fantasyElection: FantasyElection): void {
    const raceId: number = fantasyElection.race!.id;

    this.fantasyApiService
      .getDriverPoints(fantasyElection.driverOne!.id, raceId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (fantasyPointsDriver: FantasyPointsDriver) => {
          this.pointsDriverOne = fantasyPointsDriver.points;
        },
        error: () => {
          this.messageInfoService.showError(ERROR_POINT_FETCH);
        },
      });

    this.fantasyApiService
      .getDriverPoints(fantasyElection.driverTwo!.id, raceId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (fantasyPointsDriver: FantasyPointsDriver) => {
          this.pointsDriverTwo = fantasyPointsDriver.points;
        },
        error: () => {
          this.messageInfoService.showError(ERROR_POINT_FETCH);
        },
      });

    this.fantasyApiService
      .getDriverPoints(fantasyElection.driverThree!.id, raceId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (fantasyPointsDriver: FantasyPointsDriver) => {
          this.pointsDriverThree = fantasyPointsDriver.points;
        },
        error: () => {
          this.messageInfoService.showError(ERROR_POINT_FETCH);
        },
      });
  }

  /**
   * Retrieves specific points for each team in the fantasy election and updates corresponding properties.
   *
   * @param fantasyElection - The fantasy election data containing team information.
   */
  getSpecificPointsPerTeam(fantasyElection: FantasyElection): void {
    const raceId: number = fantasyElection.race!.id;

    this.fantasyApiService
      .getTeamPoints(fantasyElection.teamOne!.id, raceId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (fantasyPointsTeam: FantasyPointsTeam) => {
          this.pointsTeamOne = fantasyPointsTeam.points;
        },
        error: () => {
          this.messageInfoService.showError(ERROR_POINT_FETCH);
        },
      });

    this.fantasyApiService
      .getTeamPoints(fantasyElection.teamTwo!.id, raceId)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (fantasyPointsTeam: FantasyPointsTeam) => {
          this.pointsTeamTwo = fantasyPointsTeam.points;
        },
        error: () => {
          this.messageInfoService.showError(ERROR_POINT_FETCH);
        },
      });
  }
}
