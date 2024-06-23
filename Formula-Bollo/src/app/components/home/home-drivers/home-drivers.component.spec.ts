import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HomeDriversComponent } from "./home-drivers.component";
import { Router } from "@angular/router";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { ResultApiService } from "src/shared/services/api/result-api.service";
import { DriverApiService } from "src/shared/services/api/driver-api.service";
import { DriverPoints } from "src/shared/models/driverPoints";
import { Driver } from "src/shared/models/driver";
import { Team } from "src/shared/models/team";
import { Season } from "src/shared/models/season";
import { of, throwError } from "rxjs";
import { ERROR_DRIVER_FETCH } from "src/app/constants";

describe("HomeDriversComponent", () => {
  let component: HomeDriversComponent;
  let fixture: ComponentFixture<HomeDriversComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let driversApiServiceSpy: jasmine.SpyObj<DriverApiService>;
  let resultApiServiceSpy: jasmine.SpyObj<ResultApiService>;
  let messageInfoServiceSpy: jasmine.SpyObj<MessageInfoService>;

  beforeEach(async () =>  {
    routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
    driversApiServiceSpy = jasmine.createSpyObj("DriverApiService", ["getAllDrivers"]);
    resultApiServiceSpy = jasmine.createSpyObj("ResultApiService", ["getAllDriverPoints"]);
    messageInfoServiceSpy = jasmine.createSpyObj("MessageInfoService", ["showError"]);

    await TestBed.configureTestingModule({
      declarations: [HomeDriversComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: DriverApiService, useValue: driversApiServiceSpy },
        { provide: ResultApiService, useValue: resultApiServiceSpy },
        { provide: MessageInfoService, useValue: messageInfoServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeDriversComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call obtainAllPointsDriver in ngOnInit", () => {
    spyOn(component, "obtainAllPointsDriver");

    component.ngOnInit();

    expect(component.obtainAllPointsDriver).toHaveBeenCalled();
  });

  it("should obtain all drivers with points", () => {
    const driverPoints = [
      new DriverPoints(
        new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        100
      ),
      new DriverPoints(
        new Driver(1, "AlbertoMD", 22, new Team(1, "Williams", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        100
      ),
      new DriverPoints(
        new Driver(1, "Bubapi", 1, new Team(1, "Ferrari", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
        100
      )
    ];
    resultApiServiceSpy.getAllDriverPoints.and.returnValue(of(driverPoints));

    component.obtainAllPointsDriver();
    expect(component.driverPoints).toEqual(driverPoints);
  });

  it("should obtain all drivers with points having 0 array driverPoints", () => {
    resultApiServiceSpy.getAllDriverPoints.and.returnValue(of([]));
    spyOn(component, "obtainAllDrivers");

    component.obtainAllPointsDriver();

    expect(component.driverPoints).toEqual([ ]);
  });

  it("should throw error obtaining driverPoints", () =>  {
    resultApiServiceSpy.getAllDriverPoints.and.returnValue(throwError(() => ERROR_DRIVER_FETCH));

    component.obtainAllPointsDriver();

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_DRIVER_FETCH);
  });

  it("should call obtainAllDrivers", () => {
    const drivers = [
      new Driver(1, "Avantifer", 18, new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
      new Driver(1, "AlbertoMD", 22, new Team(1, "Williams", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1)),
      new Driver(1, "Bubapi", 1, new Team(1, "Ferrari", "", "", new Season(1, "Season 1", 1)), "", new Season(1, "Season 1", 1))
    ];
    driversApiServiceSpy.getAllDrivers.and.returnValue(of(drivers));

    component.obtainAllDrivers();

    expect(component.drivers).toEqual(drivers);
  });

  it("should thrown an error calling obtainAllDrivers", () => {
    driversApiServiceSpy.getAllDrivers.and.returnValue(throwError(() => ERROR_DRIVER_FETCH));

    component.obtainAllDrivers();

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_DRIVER_FETCH);
  });

  it("should convert driver name space to underscore", () => {
    const driverName = "Dani Calde";
    const expected = "Dani_Calde";

    const result = component.driverNameSpaceToUnderScore(driverName);

    expect(result).toEqual(expected);
  });
});
