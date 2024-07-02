export class ColorResponseDTO {
    #id;
    #title;
    #hexCode;

    constructor(json) {
        if (json) {
            this.#id = json["id"];
            this.#title = json["title"];
            this.#hexCode = json["hex_code"];
        }
    }

    getId() {
        return this.#id;
    }

    getTitle() {
        return this.#title;
    }

    getHexCode() {
        return this.#hexCode;
    }
}