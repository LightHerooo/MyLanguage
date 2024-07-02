import {
    LangResponseDTO
} from "../../lang/response/lang_response_dto.js";

export class CustomerCollectionsStatisticResponseDTO {
    #numberOfCollections;
    #lang;

    constructor(json) {
        if (json) {
            this.#numberOfCollections = json["number_of_collections"];

            let lang = json["lang"];
            if (lang) {
                this.#lang = new LangResponseDTO(lang);
            }
        }
    }

    getNumberOfCollections() {
        return this.#numberOfCollections;
    }

    getLang() {
        return this.#lang;
    }
}