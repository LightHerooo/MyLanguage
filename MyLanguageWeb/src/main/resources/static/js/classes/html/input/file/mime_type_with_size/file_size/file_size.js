export class FileSize {
    #size;
    #fileSizeUnit;

    constructor(size, fileSizeUnitObj) {
        this.#size = size;
        this.#fileSizeUnit = fileSizeUnitObj;
    }

    createStr() {
        let str;

        let size = this.#size;
        let fileSizeUnit = this.#fileSizeUnit;
        if (size && fileSizeUnit) {
            str = `${size}${fileSizeUnit.TITLE}`;
        }

        return str;
    }

    getNumberOfBytes() {
        let numberOfBytes = 0;

        let size = this.#size;
        let fileSizeUnit = this.#fileSizeUnit;
        if (size && fileSizeUnit) {
            numberOfBytes = size * fileSizeUnit.NUMBER_OF_BYTES;
        }

        return numberOfBytes;
    }
}