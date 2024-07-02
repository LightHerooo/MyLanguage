import {
    LangResponseDTO
} from "../../../lang/response/lang_response_dto.js";

export class FavouriteLangResponseDTO {
    #numberOfWorkouts;
    #lang;

    constructor(json) {
        if (json) {
            this.#numberOfWorkouts = json["number_of_workouts"];

            let lang = json["lang"];
            if (lang) {
                this.#lang = new LangResponseDTO(lang);
            }
        }
    }

    getNumberOfWorkouts() {
        return this.#numberOfWorkouts;
    }

    getLang() {
        return this.#lang;
    }
}