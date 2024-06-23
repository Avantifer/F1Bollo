/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { DriversInfoComponent } from "./drivers-info.component";
import { DriverApiService } from "src/shared/services/api/driver-api.service";
import { SeasonApiService } from "src/shared/services/api/season-api.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { DriverInfo } from "src/shared/models/driverInfo";
import { Season } from "src/shared/models/season";
import { ERROR_DRIVER_INFO_FETCH, ERROR_DRIVER_NAME_NOT_FOUND } from "src/app/constants";
import { Driver } from "src/shared/models/driver";
import { Team } from "src/shared/models/team";

describe("DriversInfoComponent", () => {
  let component: DriversInfoComponent;
  let fixture: ComponentFixture<DriversInfoComponent>;
  let driverApiServiceSpy: jasmine.SpyObj<DriverApiService>;
  let seasonApiServiceSpy: jasmine.SpyObj<SeasonApiService>;
  let messageInfoServiceSpy: jasmine.SpyObj<MessageInfoService>;
  const routerSpy = { url: "/", navigate: jasmine.createSpy("navigate") };
  let routeSpy: any;

  beforeEach(async () => {
    driverApiServiceSpy = jasmine.createSpyObj("DriverApiService", ["getInfoByDriverName"]);
    seasonApiServiceSpy = jasmine.createSpyObj("SeasonApiService", ["getSeasonByDriverName"]);
    messageInfoServiceSpy = jasmine.createSpyObj("MessageInfoService", ["showError"]);
    routeSpy = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy("get").and.returnValue("Dani_Calde")
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [DriversInfoComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: DriverApiService, useValue: driverApiServiceSpy },
        { provide: SeasonApiService, useValue: seasonApiServiceSpy },
        { provide: MessageInfoService, useValue: messageInfoServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: routeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DriversInfoComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call getSeasonsByDriverName and changeSeasons on ngOnInit", () => {
    spyOn(component, "getSeasonsByDriverName");
    spyOn(component, "changeSeasons");

    component.ngOnInit();

    expect(component.name).toBe("Dani Calde");
    expect(component.getSeasonsByDriverName).toHaveBeenCalled();
    expect(component.changeSeasons).toHaveBeenCalled();
  });

  it("should fetch seasons by driver name and handle response", () => {
    const seasons: Season[] = [new Season(1, "Season 1", 1), new Season(2, "Season 2", 2)];
    seasonApiServiceSpy.getSeasonByDriverName.and.returnValue(of(seasons));
    spyOn(component, "getInfoByDriverName");
    component.name = "Dani Calde";

    component.getSeasonsByDriverName("Dani Calde");

    expect(seasonApiServiceSpy.getSeasonByDriverName).toHaveBeenCalledWith("Dani Calde");
    expect(component.seasons).toEqual(seasons);
    expect(component.getInfoByDriverName).toHaveBeenCalledWith("Dani Calde");
  });

  it("should navigate to /drivers and show error if seasons array is empty", () => {
    seasonApiServiceSpy.getSeasonByDriverName.and.returnValue(of([]));
    component.name = "Dani Calde";

    component.getSeasonsByDriverName("Dani Calde");

    expect(seasonApiServiceSpy.getSeasonByDriverName).toHaveBeenCalledWith("Dani Calde");
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/drivers"]);
    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_DRIVER_NAME_NOT_FOUND);
  });

  it("should handle error when fetching seasons by driver name", () => {
    seasonApiServiceSpy.getSeasonByDriverName.and.returnValue(throwError(() => ERROR_DRIVER_NAME_NOT_FOUND));
    component.name = "Dani Calde";
    component.getSeasonsByDriverName("Dani Calde");

    expect(seasonApiServiceSpy.getSeasonByDriverName).toHaveBeenCalledWith("Dani Calde");
    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_DRIVER_NAME_NOT_FOUND);
  });

  it("should fetch driver info by name and handle response", () => {
    const driverInfo: DriverInfo = new DriverInfo(
      new Driver(
        1,
        "Dani Calde",
        18,
        new Team(1, "Aston Martin", "", "", new Season(1, "Season 1", 1)),
        "",
        new Season(1, "Season 1", 1)
      ),
      5,
      5,
      5,
      100,
      1,
      0,
      1,
      5,
      5
    );
    driverApiServiceSpy.getInfoByDriverName.and.returnValue(of(driverInfo));

    component.getInfoByDriverName("Dani Calde");

    expect(driverApiServiceSpy.getInfoByDriverName).toHaveBeenCalledWith("Dani Calde", undefined);
    expect(component.driverInfo).toEqual(driverInfo);
  });

  it("should handle error when fetching driver info", () => {
    driverApiServiceSpy.getInfoByDriverName.and.returnValue(throwError(() => ERROR_DRIVER_INFO_FETCH));

    component.getInfoByDriverName("Dani Calde");

    expect(driverApiServiceSpy.getInfoByDriverName).toHaveBeenCalledWith("Dani Calde", undefined);
    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_DRIVER_INFO_FETCH);
  });

  it("should subscribe to season form value changes and update driver info", () => {
    const season = new Season(2, "Season 2", 2);
    spyOn(component, "getInfoByDriverName");

    component.name = "Dani Calde";
    component.changeSeasons();
    component.seasonForm.setValue({ season });

    expect(component.getInfoByDriverName).toHaveBeenCalledWith("Dani Calde", 2);
  });

  it("should fetch info for total season if season id is 0", () => {
    const season = new Season(0, "Total", 0);
    spyOn(component, "getInfoByDriverName");

    component.name = "Dani Calde";
    component.changeSeasons();
    component.seasonForm.setValue({ season });

    expect(component.getInfoByDriverName).toHaveBeenCalledWith("Dani Calde");
  });
});
