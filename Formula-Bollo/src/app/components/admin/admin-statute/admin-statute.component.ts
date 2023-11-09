import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Archive } from 'src/shared/models/archive';
import { ArchiveApiService } from 'src/shared/services/api/archive-api.service';
import { MessageService } from 'src/shared/services/message.service';

@Component({
  selector: 'app-admin-statute',
  templateUrl: './admin-statute.component.html',
  styleUrls: ['./admin-statute.component.scss']
})
export class AdminStatuteComponent {
  selectedFile: File | null = null;
  progressValue: number = 0;
  correct: boolean = false;

  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(private messageService: MessageService, private archiveApiService: ArchiveApiService){ }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Handles the selection of a file from an input element.
   * @param event - The event object containing the selected file information.
  */
  onFileSelected(event: Event) {
    let fileInput: HTMLInputElement = event.target as HTMLInputElement;
    this.selectedFile = fileInput.files![0];

    if (this.selectedFile) {
      this.correct = this.selectedFile?.type === 'application/pdf';

      if (!this.correct) this.messageService.showInformation('Tiene que ser un archivo pdf');
    }

    this.animateProgressBar();
  }

  /**
   * Saves an 'archive' object to a db.
   * @param archive - The 'archive' object to be saved.
  */
  saveFile (archive: Archive) {
    if (this.correct && this.selectedFile) return;
    this.archiveApiService.saveStatute(archive)
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (success: string) => {
          this.messageService.showInformation('Se ha guardado correctamente');
        },
        error: (error) => {
          this.messageService.showInformation('No se ha podido guardar correctamente el fichero');
          console.log(error);
          throw error;
        }
      });
  }

  /**
   * Reads the content of the selected PDF file and saves it as an 'Archive' object.
  */
  readPDFContent() {
    if (this.selectedFile === null) {
      this.messageService.showInformation('No se ha seleccionado ningún archivo');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        if (e.target?.result) {
          const fileContent: Uint8Array = new Uint8Array(e.target.result as ArrayBuffer);
          const fileContentArray: number[] = Array.from(fileContent);
          let archive: Archive = new Archive(0, fileContentArray, this.selectedFile!.type, 'Statute');
          this.saveFile(archive);
        } else {
          this.messageService.showInformation('No se pudo leer el contenido del archivo.');
        }
      } catch (error) {
        console.error(error);
        this.messageService.showInformation('Ocurrió un error al procesar el archivo.');
      }
    };

    reader.readAsArrayBuffer(this.selectedFile);
  }

  /**
   * Animates a progress bar by incrementing the 'progressValue' property.
  */
  animateProgressBar(): void {
    this.progressValue = 0;

    setInterval(() => {
      if (this.progressValue < 100) {
        this.progressValue += 10;
      }
    }, 100);
  }
}
