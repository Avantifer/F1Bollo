import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { Archive } from 'src/shared/models/archive';
import { ArchiveApiService } from 'src/shared/services/api/archive-api.service';
import { MessageService } from 'src/shared/services/message.service';

@Component({
  selector: 'app-statute',
  templateUrl: './statute.component.html',
  styleUrls: ['./statute.component.scss']
})
export class StatuteComponent {
  pdf: SafeResourceUrl | undefined;

  private _unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private archiveApiService: ArchiveApiService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadPdf();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Fetch the statute file, decode, and display it as a PDF.
  */
  loadPdf(): void {
    this.archiveApiService.getStatute()
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (statute: Archive) => {
          const base64Data: string = statute.file.toString();
          const bytes: number[] = Array.from(atob(base64Data), (c) => c.charCodeAt(0));
          const chunk: Uint8Array = new Uint8Array(bytes);

          const blob: Blob = new Blob([chunk], { type: statute.extension });
          const url: string = URL.createObjectURL(blob);
          this.pdf = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        },
        error: (error) => {
          this.messageService.showInformation('No se puedo obtener el estatuto correctamente');
          console.log(error);
          throw error;
        }
      });
  }
}
