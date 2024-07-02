export class CountryResponseDTO {
    #id;
    #title;
    #code;

    constructor(json) {
        if (json) {
            this.#id = json["id"];
            this.#title = json["title"];
            this.#code = json["code"];
        }
    }

    getId() {
        return this.#id;
    }

    getTitle() {
        return this.#title;
    }

    getCode() {
        return this.#code;
    }
}