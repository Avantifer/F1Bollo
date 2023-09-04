import { Component } from '@angular/core';
import { catchError } from 'rxjs';
import { Archive } from 'src/shared/models/archive';
import { ArchiveService } from 'src/shared/services/archive-api.service';
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

  constructor(private messageService: MessageService, private archiveService: ArchiveService){ }

  /**
   * Select the file and comprobate if its correct or not
   * @memberof AdminStatuteComponent
  */
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.correct = this.selectedFile?.type === 'application/pdf';

    if (!this.correct) this.messageService.showInformation('Tiene que ser un archivo pdf');

    this.animateProgressBar();
  }

  /**
   * Save the file in db
   * @memberof AdminStatuteComponent
  */
  saveFile (archive: Archive) {
    if (this.correct && this.selectedFile) {
      this.archiveService.saveStatute(archive).pipe(catchError((error) => {
        this.messageService.showInformation(error.error);
        return '';
      })).subscribe((success: string) => {
        this.messageService.showInformation('Se ha guardado correctamente');
      });
    }
  }

  readPDFContent() {
    if (this.selectedFile === null) return;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const fileContent: Uint8Array = new Uint8Array(e.target.result);
      const fileContentArray: number[] = Array.from(fileContent); // Convierte Uint8Array a number[]
      let archive: Archive = new Archive(0, fileContentArray, this.selectedFile!.type, 'Statute');
      this.saveFile(archive);
    };

    reader.readAsArrayBuffer(this.selectedFile);
  }

  /**
   * Animation of the progress bar
   * @memberof AdminStatuteComponent
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
