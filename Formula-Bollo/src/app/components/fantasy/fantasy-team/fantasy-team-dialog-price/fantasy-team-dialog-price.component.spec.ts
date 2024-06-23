import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FantasyTeamDialogPriceComponent } from "./fantasy-team-dialog-price.component";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { FantasyApiService } from "src/shared/services/api/fantasy-api.service";
import { FantasyService } from "src/shared/services/fantasy.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { ChartModule } from "primeng/chart";
import { of, throwError } from "rxjs";
import { ERROR_PRICE_FETCH } from "src/app/constants";

describe("FantasyTeamDialogPriceComponent", () => {
  let component: FantasyTeamDialogPriceComponent;
  let fixture: ComponentFixture<FantasyTeamDialogPriceComponent>;
  let configSpy: jasmine.SpyObj<DynamicDialogConfig>;
  let fantasyApiServiceSpy: jasmine.SpyObj<FantasyApiService>;
  let fantasyServiceSpy: jasmine.SpyObj<FantasyService>;
  let messageInfoServiceSpy: jasmine.SpyObj<MessageInfoService>;

  beforeEach(async () => {
    configSpy = jasmine.createSpyObj("DynamicDialogConfig", ["data"]);
    fantasyApiServiceSpy = jasmine.createSpyObj("FantasyApiService", ["getDriverPrice", "getTeamPrice"]);
    fantasyServiceSpy = jasmine.createSpyObj("FantasyService", ["getChartConfig"]);
    messageInfoServiceSpy = jasmine.createSpyObj("MessageInfoService", ["showError"]);

    await TestBed.configureTestingModule({
      declarations: [FantasyTeamDialogPriceComponent],
      imports: [
        ChartModule
      ],
      providers: [
        { provide: DynamicDialogConfig, useValue: configSpy },
        { provide: FantasyApiService, useValue: fantasyApiServiceSpy },
        { provide: FantasyService, useValue: fantasyServiceSpy },
        { provide: MessageInfoService, useValue: messageInfoServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FantasyTeamDialogPriceComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call to get drivers prices on ngOnInit", () => {
    component.config.data.id = 1;
    component.config.data.type = "drivers";
    component.labels = ["Canada"];
    component.options = ["Opciones"];
    fantasyApiServiceSpy.getDriverPrice.and.returnValue(of([]));
    fantasyServiceSpy.getChartConfig.and.returnValue({ data : [""], options: [""] });

    component.ngOnInit();

    expect(component.prices).toEqual([ ]);
  });

  it("should call to get teams prices on ngOnInit", () => {
    component.config.data.id = 1;
    component.config.data.type = "teams";
    component.labels = ["Canada"];
    component.options = ["Opciones"];
    fantasyApiServiceSpy.getTeamPrice.and.returnValue(of([]));
    fantasyServiceSpy.getChartConfig.and.returnValue({ data : [""], options: [""] });

    component.ngOnInit();

    expect(component.prices).toEqual([ ]);
  });

  it("should thrown an error getting drivers prices", () => {
    fantasyApiServiceSpy.getDriverPrice.and.returnValue(throwError(() => ERROR_PRICE_FETCH));

    component.getDriverPrice(1);

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_PRICE_FETCH);
  });

  it("should thrown an error getting teams prices", () => {
    fantasyApiServiceSpy.getTeamPrice.and.returnValue(throwError(() => ERROR_PRICE_FETCH));

    component.getTeamPrice(1);

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_PRICE_FETCH);
  });
});
