export class MIMEType {
    #MIMEHeader;
    #format;
    #type;

    constructor(MIMEHeader, format) {
        this.#MIMEHeader = MIMEHeader;
        this.#format = format;

        if (MIMEHeader) {
            this.#type = MIMEHeader.split("/")[0];
        }
    }

    getMIMEHeader() {
        return this.#MIMEHeader;
    }

    getFormat() {
        return this.#format;
    }

    getType() {
        return this.#type;
    }
}