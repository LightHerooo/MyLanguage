export class ResponseMessageResponseDTO {
    #id;
    #message;

    constructor(json) {
        if (json) {
            this.#id = json["id"];
            this.#message = json["message"];
        }
    }

    getId() {
        return this.#id;
    }

    getMessage() {
        return this.#message;
    }
}