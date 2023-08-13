import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Archive } from 'src/shared/models/archive';
import { ArchiveService } from 'src/shared/services/archive-api.service';

@Component({
  selector: 'app-statute',
  templateUrl: './statute.component.html',
  styleUrls: ['./statute.component.scss']
})
export class StatuteComponent {
  pdf: SafeResourceUrl | undefined;

  constructor(private archiveService: ArchiveService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadPdf();
  }

  loadPdf(): void {
    this.archiveService.getStatute().subscribe((statute: Archive) => {
      const b64: string = statute.file.toString();

      let characters: string = atob(b64);
      let bytes = new Array(characters.length);

      for (let i = 0; i < characters.length; i++) {
        bytes[i] = characters.charCodeAt(i);
      }

      let chunk: Uint8Array = new Uint8Array(bytes);
      let blob: Blob = new Blob([chunk], { type: statute.extension });
      let url: string = URL.createObjectURL(blob);

      this.pdf = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    });
  }

}
