export class MIMETypeWithSize {
    #MIMEType;
    #fileSize;

    constructor(MIMETypeObj, fileSizeObj) {
        this.#MIMEType = MIMETypeObj;
        this.#fileSize = fileSizeObj;
    }

    getMIMEType() {
        return this.#MIMEType;
    }

    getFileSize() {
        return this.#fileSize;
    }
}