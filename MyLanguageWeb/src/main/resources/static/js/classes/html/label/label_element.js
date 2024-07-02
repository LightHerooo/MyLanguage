import {
    CssLabelElement
} from "../../css/label/css_label_element.js";

const _CSS_LABEL_ELEMENT = new CssLabelElement();

export class LabelElement {
    #label;

    constructor(label) {
        this.#label = label;

        this.#tryToSetDefaultValues();
    }

    getLabel() {
        return this.#label;
    }


    #tryToSetDefaultValues() {
        let label = this.#label;
        if (!label) {
            label = document.createElement("label");
            label.classList.add(_CSS_LABEL_ELEMENT.LABEL_ELEMENT_CLASS_ID);
        }

        this.#label = label;
    }


    changeLabelText(str) {
        let label = this.#label;
        if (label) {
            label.textContent = str;
        }
    }
}