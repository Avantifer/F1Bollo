import { Component } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { ERROR_ARCHIVE_NOT_VALID, ERROR_SAVE, SUCCESS_SAVE, WARNING_ARCHIVE_NOT_SELECTED, WARNING_PDF } from "src/app/constants";
import { Archive } from "src/shared/models/archive";
import { ArchiveApiService } from "src/shared/services/api/archive-api.service";
import { MessageInfoService } from "src/shared/services/messageinfo.service";

@Component({
  selector: "app-admin-statute",
  templateUrl: "./admin-statute.component.html",
  styleUrls: ["./admin-statute.component.scss"],
})
export class AdminStatuteComponent {
  selectedFile: File | null = null;
  progressValue: number = 0;
  correct: boolean = false;

  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private messageInfoService: MessageInfoService,
    private archiveApiService: ArchiveApiService,
  ) {}

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Handles the selection of a file from an input element.
   * @param event - The event object containing the selected file information.
   */
  onFileSelected(event: Event) {
    const fileInput: HTMLInputElement = event.target as HTMLInputElement;
    this.selectedFile = fileInput.files![0];

    if (this.selectedFile) {
      this.correct = this.selectedFile?.type === "application/pdf";

      if (!this.correct)
        this.messageInfoService.showWarn(WARNING_PDF);
    }

    this.animateProgressBar();
  }

  /**
   * Saves an 'archive' object to a db.
   * @param archive - The 'archive' object to be saved.
   */
  saveFile(archive: Archive) {
    if (this.correct && this.selectedFile) return;
    this.archiveApiService
      .saveStatute(archive)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: () => {
          this.messageInfoService.showSuccess(SUCCESS_SAVE);
        },
        error: (error) => {
          this.messageInfoService.showError(ERROR_SAVE);
          console.log(error);
          throw error;
        },
      });
  }

  /**
   * Reads the content of the selected PDF file and saves it as an 'Archive' object.
   */
  readPDFContent() {
    if (this.selectedFile === null) {
      this.messageInfoService.showWarn(WARNING_ARCHIVE_NOT_SELECTED);
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        if (e.target?.result) {
          const fileContent: Uint8Array = new Uint8Array(
            e.target.result as ArrayBuffer,
          );
          const fileContentArray: number[] = Array.from(fileContent);
          const archive: Archive = new Archive(
            0,
            fileContentArray,
            this.selectedFile!.type,
            "Statute",
          );
          this.saveFile(archive);
        } else {
          this.messageInfoService.showError(ERROR_ARCHIVE_NOT_VALID);
        }
      } catch (error) {
        console.error(error);
        this.messageInfoService.showError(ERROR_ARCHIVE_NOT_VALID);
      }
    };

    reader.readAsArrayBuffer(this.selectedFile);
  }

  /**
   * Animates a progress bar by incrementing the 'progressValue' property.
   */
  animateProgressBar(): void {
    this.progressValue = 0;

    const interval = setInterval(() => {
      this.progressValue = this.progressValue + Math.floor(Math.random() * 20) + 1;
      if (this.progressValue >= 100) {
        this.progressValue = 100;
        clearInterval(interval);
      }
    }, 300);
  }
}
