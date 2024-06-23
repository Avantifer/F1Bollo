import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HomeConfigurationComponent } from "./home-configuration.component";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { ConfigurationApiService } from "src/shared/services/api/configuration-api.service";
import { Configuration } from "src/shared/models/configuration";
import { Season } from "src/shared/models/season";
import { of, throwError } from "rxjs";
import { ERROR_CONFIGURATION_FETCH } from "src/app/constants";

describe("HomeConfigurationComponent", () => {
  let component: HomeConfigurationComponent;
  let fixture: ComponentFixture<HomeConfigurationComponent>;
  let configurationApiServiceSpy: jasmine.SpyObj<ConfigurationApiService>;
  let messageInfoServiceSpy: jasmine.SpyObj<MessageInfoService>;

  beforeEach(async () => {
    configurationApiServiceSpy = jasmine.createSpyObj("ConfigurationApiService", ["getAllConfigurations"]);
    messageInfoServiceSpy = jasmine.createSpyObj("MessageInfoService", ["showError"]);

    await TestBed.configureTestingModule({
      declarations: [HomeConfigurationComponent],
      providers: [
        { provide: ConfigurationApiService, useValue: configurationApiServiceSpy },
        { provide: MessageInfoService, useValue: messageInfoServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeConfigurationComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("sould call obtainAllConfigurations on ngOnInit", () => {
    spyOn(component, "obtainAllConfigurations");

    component.ngOnInit();

    expect(component.obtainAllConfigurations).toHaveBeenCalled();
  });

  it("should obtain all configurations", () => {
    const configurations = [new Configuration(1, "Dificultad", "Media", new Season(1, "Season 1", 1))];
    configurationApiServiceSpy.getAllConfigurations.and.returnValue(of(configurations));

    component.obtainAllConfigurations();

    expect(component.configurations).toBe(configurations);
  });

  it("should show an error when obtaining all configurations", () => {
    configurationApiServiceSpy.getAllConfigurations.and.returnValue(throwError(() => ERROR_CONFIGURATION_FETCH));

    component.obtainAllConfigurations();

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_CONFIGURATION_FETCH);
  });
});
