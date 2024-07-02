export class ValueResponseDTO {
    #value;

    constructor(json) {
        if (json) {
            this.#value = json["value"];
        }
    }

    getValue() {
        return this.#value;
    }
}