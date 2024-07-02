export class DateResponseDTO {
    #value;

    constructor(json) {
        if (json) {
            let value = json["value"];
            if (value) {
                this.#value = new Date(value);
            }
        }
    }

    getValue() {
        return this.#value;
    }
}