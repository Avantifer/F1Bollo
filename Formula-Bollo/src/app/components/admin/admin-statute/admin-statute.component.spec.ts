/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminStatuteComponent } from "./admin-statute.component";
import { MessageInfoService } from "src/shared/services/messageinfo.service";
import { ArchiveApiService } from "src/shared/services/api/archive-api.service";
import { ButtonModule } from "primeng/button";
import { Archive } from "src/shared/models/archive";
import { ERROR_ARCHIVE_NOT_VALID, ERROR_SAVE, SUCCESS_SAVE, WARNING_ARCHIVE_NOT_SELECTED, WARNING_PDF } from "src/app/constants";
import { of, throwError } from "rxjs";

describe("AdminStatuteComponent", () => {
  let component: AdminStatuteComponent;
  let fixture: ComponentFixture<AdminStatuteComponent>;
  let messageInfoServiceSpy: jasmine.SpyObj<MessageInfoService>;
  let archiveApiServiceSpy: jasmine.SpyObj<ArchiveApiService>;

  beforeEach(async () => {
    messageInfoServiceSpy = jasmine.createSpyObj("MessageInfoService", ["showWarn", "showSuccess", "showError"]);
    archiveApiServiceSpy = jasmine.createSpyObj("ArchiveApiService", ["saveStatute"]);

    await TestBed.configureTestingModule({
      declarations : [AdminStatuteComponent],
      imports: [
        ButtonModule
      ],
      providers: [
        { provide: MessageInfoService, useValue: messageInfoServiceSpy },
        { provide: ArchiveApiService, useValue: archiveApiServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminStatuteComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should handle PDF file selection correctly", () => {
    const file = new File([""], "test.pdf", { type: "application/pdf" });
    const event = { target: { files: [file] } } as any;

    component.onFileSelected(event);
    expect(component.selectedFile).toEqual(file);
    expect(component.correct).toBeTrue();
    expect(messageInfoServiceSpy.showWarn).not.toHaveBeenCalled();
  });

  it("should handle non-PDF file selection correctly", () => {
    const file = new File([""], "test.txt", { type: "text/plain" });
    const event = { target: { files: [file] } } as any;

    component.onFileSelected(event);
    expect(component.selectedFile).toEqual(file);
    expect(component.correct).toBeFalse();
    expect(messageInfoServiceSpy.showWarn).toHaveBeenCalledWith(WARNING_PDF);
  });

  it("should warn if no file is selected when reading PDF content", () => {
    component.selectedFile = null;

    component.readPDFContent();
    expect(messageInfoServiceSpy.showWarn).toHaveBeenCalledWith(WARNING_ARCHIVE_NOT_SELECTED);
  });

  it("should save file content if file is valid", () => {
    const fileContent = new Uint8Array([65, 66, 67]);
    component.selectedFile = new File([""], "test.pdf", { type: "application/pdf" });
    spyOn(FileReader.prototype, "readAsArrayBuffer").and.callFake(function(this: FileReader) {
      const onload = this.onload as (this: FileReader, ev: ProgressEvent<FileReader>) => any;
      onload.call(this, { target: { result: fileContent.buffer } } as ProgressEvent<FileReader>);
    });

    const archive = new Archive(0, Array.from(fileContent), "application/pdf", "Statute");
    archiveApiServiceSpy.saveStatute.and.returnValue(of(""));

    component.readPDFContent();
    expect(archiveApiServiceSpy.saveStatute).toHaveBeenCalledWith(archive);
    expect(messageInfoServiceSpy.showSuccess).toHaveBeenCalledWith(SUCCESS_SAVE);
  });

  it("should show error if there is an exception during file processing", () => {
    component.selectedFile = new File([""], "test.pdf", { type: "application/pdf" });
    spyOn(FileReader.prototype, "readAsArrayBuffer").and.callFake(function(this: FileReader) {
      const onload = this.onload as (this: FileReader, ev: ProgressEvent<FileReader>) => any;
      onload.call(this, { target: { result: {} } } as ProgressEvent<FileReader>);
    });
    component.readPDFContent();
    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_ARCHIVE_NOT_VALID);
  });

  it("should show error if e.target.result is null", () => {
    component.selectedFile = new File([""], "test.pdf", { type: "application/pdf" });
    spyOn(FileReader.prototype, "readAsArrayBuffer").and.callFake(function(this: FileReader) {
      const onload = this.onload as (this: FileReader, ev: ProgressEvent<FileReader>) => void;
      onload.call(this, { target: { result: null } } as ProgressEvent<FileReader>);
    });
    component.readPDFContent();
    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_ARCHIVE_NOT_VALID);
  });

  it("should handle saveFile errors", () => {
    const archive = new Archive(0, [], "application/pdf", "Statute");
    const file = new File([""], "test.pdf", { type: "application/pdf" });
    archiveApiServiceSpy.saveStatute.and.returnValue(throwError(() => ERROR_SAVE));

    component.saveFile(archive);
    expect(messageInfoServiceSpy.showError).toHaveBeenCalledWith(ERROR_SAVE);

    component.correct = false;
    component.saveFile(archive);

    component.correct = true;
    component.selectedFile = file;
    component.saveFile(archive);
  });

  it("should animate the progress bar", (done) => {
    component.animateProgressBar();

    setTimeout(() => {
      expect(component.progressValue).toBe(100);
      done();
    }, 4500);
  });

});
