import {
    CountryResponseDTO
} from "../../country/response/country_response_dto.js";

export class LangResponseDTO {
    #id;
    #title;
    #code;
    #isActiveForIn;
    #isActiveForOut;
    #country;

    constructor(json) {
        if (json) {
            this.#id = json["id"];
            this.#title = json["title"];
            this.#code = json["code"];
            this.#isActiveForIn = json["is_active_for_in"];
            this.#isActiveForOut = json["is_active_for_out"];

            let country = json["country"];
            if (country) {
                this.#country = new CountryResponseDTO(country);
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

    getIsActiveForIn() {
        return this.#isActiveForIn;
    }

    getIsActiveForOut() {
        return this.#isActiveForOut;
    }

    getCountry() {
        return this.#country;
    }
}