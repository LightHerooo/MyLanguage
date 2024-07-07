import {
    CssLabelElement
} from "../../css/elements/label/css_label_element.js";

const _CSS_LABEL_ELEMENT = new CssLabelElement();

export class LabelRequiredElement {
    #label;
    #spanText;

    constructor(label, spanText) {
        this.#label = label;
        this.#spanText = spanText;

        this.#tryToSetDefaultValues();
    }

    getLabel() {
        return this.#label;
    }


    #tryToSetDefaultValues() {
        let label = this.#label;
        if (!label) {
            label = document.createElement("label");
            label.classList.add(_CSS_LABEL_ELEMENT.LABEL_REQUIRED_ELEMENT_CLASS_ID);

            // Текст ---
            let span = document.createElement("span");

            this.#spanText = span;

            label.appendChild(span);
            //---

            // Пробел ---
            span = document.createElement("span");
            span.textContent = " ";

            label.appendChild(span);
            //---

            // Звёздочка ---
            span = document.createElement("span");
            span.classList.add(_CSS_LABEL_ELEMENT.SPAN_LABEL_REQUIRED_ELEMENT_RED_STAR_CLASS_ID);
            span.textContent = "*";

            label.appendChild(span);
            //---
        }

        this.#label = label;
    }


    changeText(str) {
        let spanText = this.#spanText;
        if (spanText) {
            spanText.textContent = str;
        }
    }
}