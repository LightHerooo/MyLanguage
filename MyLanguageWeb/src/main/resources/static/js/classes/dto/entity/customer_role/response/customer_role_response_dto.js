import {
    ColorResponseDTO
} from "../../color/response/color_response_dto.js";

export class CustomerRoleResponseDTO {
    #id;
    #title;
    #pathToImage;
    #code;
    #description;
    #color;

    constructor(json) {
        if (json) {
            this.#id = json["id"];
            this.#title = json["title"];
            this.#pathToImage = json["path_to_image"];
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

    getPathToImage() {
        return this.#pathToImage;
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