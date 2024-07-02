export class WorkoutTypeResponseDTO {
    #id;
    #title;
    #code;
    #description;
    #pathToImage;
    #isActive;
    #isPrepared;

    constructor(json) {
        if (json) {
            this.#id = json["id"];
            this.#title = json["title"];
            this.#code = json["code"];
            this.#description = json["description"];
            this.#pathToImage = json["path_to_image"];
            this.#isActive = json["is_active"];
            this.#isPrepared = json["is_prepared"];
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

    getPathToImage() {
        return this.#pathToImage;
    }

    getIsActive() {
        return this.#isActive;
    }

    getIsPrepared() {
        return this.#isPrepared;
    }
}