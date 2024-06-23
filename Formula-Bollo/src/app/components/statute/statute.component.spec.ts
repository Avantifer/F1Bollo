import { ComponentFixture, TestBed } from "@angular/core/testing";
import { StatuteComponent } from "./statute.component";
import { ArchiveApiService } from "src/shared/services/api/archive-api.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { DomSanitizer } from "@angular/platform-browser";
import { of, throwError } from "rxjs";
import { Archive } from "src/shared/models/archive";
import { ERROR_STATUTE_FETCH } from "src/app/constants";

describe("StatuteComponent", () => {
  let component: StatuteComponent;
  let fixture: ComponentFixture<StatuteComponent>;
  let archiveApiServiceSpy: jasmine.SpyObj<ArchiveApiService>;
  let domSanitizerSpy: jasmine.SpyObj<DomSanitizer>;
  let messageInfoServiceSpy: jasmine.SpyObj<MessageInfoService>;

  beforeEach(async () => {
    archiveApiServiceSpy = jasmine.createSpyObj("ArchiveApiService", ["getStatute"]);
    domSanitizerSpy = jasmine.createSpyObj("DomSanitizer", ["bypassSecurityTrustResourceUrl"]);
    messageInfoServiceSpy = jasmine.createSpyObj("MessageInfoService", ["showError"]);

    await TestBed.configureTestingModule({
      declarations: [StatuteComponent],
      providers: [
        { provide: ArchiveApiService, useValue: archiveApiServiceSpy },
        { provide: DomSanitizer, useValue: domSanitizerSpy },
        { provide: MessageInfoService, useValue: messageInfoServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StatuteComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call loadPdf on ngOnInit", () => {
    spyOn(component, "loadPdf");
    component.ngOnInit();
    expect(component.loadPdf).toHaveBeenCalled();
  });

  it("should load PDF successfully", () => {
    const mockStatute: Archive = new Archive(1, [], "application/pdf", "");
    archiveApiServiceSpy.getStatute.and.returnValue(of(mockStatute));

    component.loadPdf();

    expect(archiveApiServiceSpy.getStatute).toHaveBeenCalled();
  });

  it("should handle error when loadPdf fails", () => {
    const errorResponse = new Error(ERROR_STATUTE_FETCH);
    archiveApiServiceSpy.getStatute.and.returnValue(throwError(() => errorResponse));
    spyOn(console, "log");

    component.loadPdf();

    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_STATUTE_FETCH);
    expect(console.log).toHaveBeenCalledWith(errorResponse);
  });
});
