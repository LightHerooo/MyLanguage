import {
    FlagElements
} from "../flag_elements.js";

const _FLAG_ELEMENTS = new FlagElements();

export class LangResponseDTO {
    id;
    title;
    code;

    constructor(langJson) {
        if (langJson) {
            this.id = langJson["id"];
            this.title = langJson["title"];
            this.code = langJson["code"];
        } else {
            this.id = 0n;
            this.title = "Без языка";
        }
    }
    #createElement(differentElement) {
        let spanLangFlag = _FLAG_ELEMENTS.SPAN.create(this.code);

        let spanLangTitle = document.createElement("span");
        spanLangTitle.textContent = " " + this.title;

        differentElement.appendChild(spanLangFlag);
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