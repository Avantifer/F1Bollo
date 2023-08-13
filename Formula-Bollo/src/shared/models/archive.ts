  export class Archive {
    id: number;
    file: Uint8Array;
    extension: string;
    definition: string;

    constructor(id: number, file: Uint8Array, extension: string, definition: string) {
      this.id = id;
      this.file = file;
      this.extension = extension;
      this.definition = definition;
    }
  }
