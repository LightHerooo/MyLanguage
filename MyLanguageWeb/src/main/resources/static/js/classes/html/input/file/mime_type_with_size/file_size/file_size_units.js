export class FileSizeUnits {
    KB = new FileSizeUnit("KB", 1024);
    MB = new FileSizeUnit("MB", this.KB.NUMBER_OF_BYTES * 1024);
}

class FileSizeUnit {
    TITLE;
    NUMBER_OF_BYTES;

    constructor(title, numberOfBytes) {
        this.TITLE = title;
        this.NUMBER_OF_BYTES = numberOfBytes;
    }
}