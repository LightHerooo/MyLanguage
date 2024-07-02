import {
    ColorResponseDTO
} from "../../color/response/color_response_dto.js";

export class WordStatusResponseDTO {
    #id;
    #title;
    #code;
    #description;
    #color;

    constructor(json) {
        if (json) {
            this.#id = json["id"];
            this.#title = json["title"];
            this.#code = json["code"];
            this.#description = json["description"];

            let color = json["color"];
            if (color) {
                this.#color = new ColorResponseDTO(color);
            }
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

    getDescription() {
        return this.#description;
    }

    getColor() {
        return this.#color;
    }
}