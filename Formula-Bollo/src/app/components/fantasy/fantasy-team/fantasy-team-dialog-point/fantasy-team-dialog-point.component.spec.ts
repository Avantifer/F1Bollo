import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { FantasyApiService } from "src/shared/services/api/fantasy-api.service";
import { FantasyService } from "src/shared/services/fantasy.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { ChartModule } from "primeng/chart";
import { FantasyTeamDialogPointComponent } from "./fantasy-team-dialog-point.component";
import { of, throwError } from "rxjs";
import { ERROR_POINT_FETCH } from "src/app/constants";

describe("FantasyTeamDialogPointComponent", () => {
  let component: FantasyTeamDialogPointComponent;
  let fixture: ComponentFixture<FantasyTeamDialogPointComponent>;
  let configSpy: jasmine.SpyObj<DynamicDialogConfig>;
  let fantasyApiServiceSpy: jasmine.SpyObj<FantasyApiService>;
  let fantasyServiceSpy: jasmine.SpyObj<FantasyService>;
  let messageInfoServiceSpy: jasmine.SpyObj<MessageInfoService>;

  beforeEach(async () => {
    configSpy = jasmine.createSpyObj("DynamicDialogConfig", ["data"]);
    fantasyApiServiceSpy = jasmine.createSpyObj("FantasyApiService", ["getDriverPoints", "getTeamPoints"]);
    fantasyServiceSpy = jasmine.createSpyObj("FantasyService", ["getChartConfig"]);
    messageInfoServiceSpy = jasmine.createSpyObj("MessageInfoService", ["showError"]);

    await TestBed.configureTestingModule({
      declarations: [FantasyTeamDialogPointComponent],
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

    fixture = TestBed.createComponent(FantasyTeamDialogPointComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call to get drivers points on ngOnInit", () => {
    component.config.data.id = 1;
    component.config.data.type = "drivers";
    component.labels = ["Canada"];
    component.options = ["Opciones"];
    fantasyApiServiceSpy.getDriverPoints.and.returnValue(of([]));
    fantasyServiceSpy.getChartConfig.and.returnValue({ data : [""], options: [""] });

    component.ngOnInit();

    expect(component.points).toEqual([ ]);
  });

  it("should call to get teams points on ngOnInit", () => {
    component.config.data.id = 1;
    component.config.data.type = "teams";
    component.labels = ["Canada"];
    component.options = ["Opciones"];
    fantasyApiServiceSpy.getTeamPoints.and.returnValue(of([]));
    fantasyServiceSpy.getChartConfig.and.returnValue({ data : [""], options: [""] });

    component.ngOnInit();

    expect(component.points).toEqual([ ]);
  });

  it("should thrown an error getting drivers points", () => {
    fantasyApiServiceSpy.getDriverPoints.and.returnValue(throwError(() => ERROR_POINT_FETCH));

    component.getDriverPoint(1);

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_POINT_FETCH);
  });

  it("should thrown an error getting teams points", () => {
    fantasyApiServiceSpy.getTeamPoints.and.returnValue(throwError(() => ERROR_POINT_FETCH));

    component.getTeamPoint(1);

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_POINT_FETCH);
  });
});
