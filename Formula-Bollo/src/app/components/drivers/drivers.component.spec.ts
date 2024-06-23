import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DriversComponent } from "./drivers.component";
import { DriverApiService } from "src/shared/services/api/driver-api.service";
import { SeasonService } from "src/shared/services/season.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { ResultApiService } from "src/shared/services/api/result-api.service";
import { DriverPoints } from "src/shared/models/driverPoints";
import { Driver } from "src/shared/models/driver";
import { Team } from "src/shared/models/team";
import { Season } from "src/shared/models/season";
import { of, throwError } from "rxjs";
import { ERROR_DRIVER_FETCH, ERROR_RESULT_FETCH } from "src/app/constants";
import { Router } from "@angular/router";

describe("DriversComponent", () => {
  let component: DriversComponent;
  let fixture: ComponentFixture<DriversComponent>;
  let driverApiServiceSpy: jasmine.SpyObj<DriverApiService>;
  let resultApiServiceSpy: jasmine.SpyObj<ResultApiService>;
  let messageInfoServiceSpy: jasmine.SpyObj<MessageInfoService>;
  let seasonServiceSpy: jasmine.SpyObj<SeasonService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    driverApiServiceSpy = jasmine.createSpyObj("DriverApiService", ["getAllDrivers"]);
    resultApiServiceSpy = jasmine.createSpyObj("ResultApiService", ["getAllDriverPoints"]);
    messageInfoServiceSpy = jasmine.createSpyObj("MessageInfoService", ["showError"]);
    seasonServiceSpy = jasmine.createSpyObj("SeasonService", ["obtainAllSeasons"]);
    routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      declarations: [DriversComponent],
      providers: [
        { provide: DriverApiService, useValue: driverApiServiceSpy},
        { provide: ResultApiService, useValue: resultApiServiceSpy},
        { provide: MessageInfoService, useValue: messageInfoServiceSpy},
        { provide: SeasonService, useValue: seasonServiceSpy},
        { provide: Router, useValue: routerSpy}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DriversComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call some methods on ngOnInit", () => {
    spyOn(component, "obtainAllSeasons");
    spyOn(component, "obtainAllDriversPoints");
    spyOn(component, "changeSeasonDrivers");

    component.ngOnInit();

    expect(component.obtainAllSeasons).toHaveBeenCalled();
    expect(component.obtainAllDriversPoints).toHaveBeenCalled();
    expect(component.changeSeasonDrivers).toHaveBeenCalled();
  });

  it("should fetch all driver points and handle response", () => {
    const driverPoints: DriverPoints[] = [
      new DriverPoints(
        new Driver(
          1,
          "Avantifer",
          18,
          new Team(
            1,
            "Aston Martin",
            "",
            "",
            new Season(1, "Season 1", 1)
          ),
          "",
          new Season(1, "Season 1", 1)
        ),
        100
      )
    ];
    resultApiServiceSpy.getAllDriverPoints.and.returnValue(of(driverPoints));

    component.obtainAllDriversPoints();

    expect(resultApiServiceSpy.getAllDriverPoints).toHaveBeenCalled();
    expect(component.driverPoints).toEqual(driverPoints);
  });

  it("should handle error when fetching driver points", () => {
    resultApiServiceSpy.getAllDriverPoints.and.returnValue(throwError(() => ERROR_RESULT_FETCH));

    component.obtainAllDriversPoints();

    expect(resultApiServiceSpy.getAllDriverPoints).toHaveBeenCalled();
    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_RESULT_FETCH);
  });

  it("should fetch all drivers and handle response", () => {
    const drivers: Driver[] = [
      new Driver(1,
        "Avantifer",
        18,
        new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        "",
        new Season(1, "Season 1", 1)
      )
    ];
    driverApiServiceSpy.getAllDrivers.and.returnValue(of(drivers));

    component.obtainAllDrivers();

    expect(driverApiServiceSpy.getAllDrivers).toHaveBeenCalled();
    expect(component.drivers).toEqual(drivers);
  });

  it("should call obtainAllDrivers if driverPoints is empty in complete block", () => {
    spyOn(component, "obtainAllDrivers");
    resultApiServiceSpy.getAllDriverPoints.and.returnValue(of([]));

    component.obtainAllDriversPoints();

    expect(resultApiServiceSpy.getAllDriverPoints).toHaveBeenCalled();
    expect(component.obtainAllDrivers).toHaveBeenCalled();
  });

  it("should handle error when fetching drivers", () => {
    driverApiServiceSpy.getAllDrivers.and.returnValue(throwError("error"));

    component.obtainAllDrivers();

    expect(driverApiServiceSpy.getAllDrivers).toHaveBeenCalled();
    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_DRIVER_FETCH);
  });

  it("should fetch all seasons and set default season on form", () => {
    const seasons: Season[] = [
      new Season(1, "Season 1", 1),
      new Season(2, "Season 2", 2)
    ];
    component.seasonSelected = seasons[0];
    seasonServiceSpy.obtainAllSeasons.and.callFake((seasonsArray, selectedSeason, form) => {
      seasonsArray.push(...seasons);
      selectedSeason = seasons[0];
      form.get("season")?.setValue(seasons[0]);
    });

    component.obtainAllSeasons();

    expect(seasonServiceSpy.obtainAllSeasons).toHaveBeenCalled();
    expect(component.seasons).toEqual(seasons);
    expect(component.seasonSelected).toEqual(seasons[0]);
    expect(component.seasonForm.get("season")?.value).toEqual(seasons[0]);
  });

  it("should subscribe to season form value changes and update drivers and driver points", () => {
    const season = new Season(2, "Season 2", 2);
    const driverPoints: DriverPoints[] = [
      new DriverPoints(new Driver(1, "Avantifer", 18,new Team( 1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),"", new Season(1, "Season 1", 1)),100)
    ];
    resultApiServiceSpy.getAllDriverPoints.and.returnValue(of(driverPoints));

    component.changeSeasonDrivers();
    component.seasonForm.setValue({ season });

    expect(component.seasonSelected).toEqual(season);
    expect(resultApiServiceSpy.getAllDriverPoints).toHaveBeenCalledWith(2);
  });



  it("should convert driver name space to underscore", () => {
    const driverName = "Dani Calde";
    const expected = "Dani_Calde";

    const result = component.driverNameSpaceToUnderScore(driverName);

    expect(result).toEqual(expected);
  });
});

