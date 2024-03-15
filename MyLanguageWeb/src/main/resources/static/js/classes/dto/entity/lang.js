import {
    FlagElements
} from "../../flag_elements.js";

import {
    CountryResponseDTO
} from "./country.js";

const _FLAG_ELEMENTS = new FlagElements();

export class LangResponseDTO {
    id;
    title;
    code;
    isActiveForIn;
    isActiveForOut;
    country;

    constructor(langJson) {
        if (langJson) {
            this.id = langJson["id"];
            this.title = langJson["title"];
            this.code = langJson["code"];
            this.isActiveForIn = langJson["is_active_for_in"];
            this.isActiveForOut = langJson["is_active_for_out"];

            let country = langJson["country"];
            if (country) {
                this.country = new CountryResponseDTO(country);
            }
        }
    }

    #createElement(differentElement) {
        differentElement.style.display = "flex";
        differentElement.style.flexDirection = "row";
        differentElement.style.gap = "5px";

        let spanLangFlag = _FLAG_ELEMENTS.SPAN.create(this.country);
        differentElement.appendChild(spanLangFlag);

        let spanLangTitle = document.createElement("span");
        spanLangTitle.textContent = this.title;
        differentElement.appendChild(spanLangTitle);
    }

    createDiv() {
        let div = document.createElement("div");
        this.#createElement(div);

        return div;
    }

    createSpan() {
        let span = document.createElement("span");
        this.#createElement(span);

        return span;
    }
}

export class LangRequestDTO {
    code;
    isActiveForIn;
    isActiveForOut;
}