import {
    HtmlUtils
} from "../../html_utils.js";

import {
    EventNames
} from "../../event_names.js";

import {
    CssInputCheckboxElement
} from "../../../css/elements/input/css_input_checkbox_element.js";

const _CSS_INPUT_CHECKBOX_ELEMENT = new CssInputCheckboxElement();

const _HTML_UTILS = new HtmlUtils();
const _EVENT_NAMES = new EventNames();

export class InputCheckboxElement {
    #divContainer;
    #inputCheckbox;
    #label;

    #isPrepared = false;

    constructor(divContainer, inputCheckbox, label) {
        this.#divContainer = divContainer;
        this.#inputCheckbox = inputCheckbox;
        this.#label = label;

        this.#tryToSetDefaultValues();
    }

    getDivContainer() {
        return this.#divContainer;
    }

    getInputCheckbox() {
        return this.#inputCheckbox;
    }

    getLabel() {
        return this.#label;
    }

    getIsPrepared() {
        return this.#isPrepared;
    }

    getIsChecked() {
        let value = false;

        let inputCheckbox = this.#inputCheckbox;
        if (inputCheckbox) {
            value = inputCheckbox.checked;
        }

        return value;
    }


    #tryToSetDefaultValues() {
        let divContainer = this.#divContainer;
        if (!divContainer) {
            divContainer = document.createElement("div");
            divContainer.classList.add(_CSS_INPUT_CHECKBOX_ELEMENT.DIV_INPUT_CHECKBOX_ELEMENT_CONTAINER_CLASS_ID);
        }

        let inputCheckbox = this.#inputCheckbox;
        if (!inputCheckbox) {
            inputCheckbox = document.createElement("input");
            inputCheckbox.type = "checkbox";
        }

        let label = this.#label;
        if (!label) {
            label = document.createElement("label");
            label.classList.add(_CSS_INPUT_CHECKBOX_ELEMENT.LABEL_INPUT_CHECKBOX_ELEMENT_CLASS_ID);
            label.textContent = "Название";

        }


        // Добавляем элементы в контейнер, если они не имеют родителя ---
        if (inputCheckbox && !inputCheckbox.parentElement) {
            divContainer.appendChild(inputCheckbox);
        }

        if (label && !label.parentElement) {
            divContainer.appendChild(label);
        }
        //---

        this.#divContainer = divContainer;
        this.#inputCheckbox = inputCheckbox;
        this.#label = label;
    }


    prepare() {
        let isPrepared = this.#isPrepared;
        if (!isPrepared) {
            let label = this.#label;
            if (label) {
                let self = this;
                label.addEventListener(_EVENT_NAMES.LABEL.CLICK, function() {
                    let inputCheckbox = self.#inputCheckbox;
                    if (inputCheckbox) {
                        _HTML_UTILS.callEvent(inputCheckbox, _EVENT_NAMES.INPUT.CHECKBOX.CHANGE);
                    }
                });
            }

            this.#isPrepared = true;
        } else {
            throw new Error("Object \'InputCheckboxElement\' has already been prepared");
        }
    }


    changeLabelText(str) {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            let label = this.#label;
            if (label) {
                label.textContent = str;
            }
        } else {
            throw new Error("Object \'InputCheckboxElement\' is not prepared");
        }
    }

    changeCheckedStatus(isChecked) {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            let inputCheckbox = this.#inputCheckbox;
            if (inputCheckbox) {
                inputCheckbox.checked = isChecked;
            }
        } else {
            throw new Error("Object \'InputCheckboxElement\' is not prepared");
        }
    }

    changeDisabledStatus(isDisabled) {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            let inputCheckbox = this.#inputCheckbox;
            if (inputCheckbox) {
                inputCheckbox.disabled = isDisabled;
            }

            let label = this.#label;
            if (label) {
                if (isDisabled) {
                    label.classList.remove(_CSS_INPUT_CHECKBOX_ELEMENT.LABEL_INPUT_CHECKBOX_ELEMENT_CLASS_ID);
                    label.classList.add(_CSS_INPUT_CHECKBOX_ELEMENT.LABEL_INPUT_CHECKBOX_ELEMENT_DISABLED_CLASS_ID);
                } else {
                    label.classList.add(_CSS_INPUT_CHECKBOX_ELEMENT.LABEL_INPUT_CHECKBOX_ELEMENT_CLASS_ID);
                    label.classList.remove(_CSS_INPUT_CHECKBOX_ELEMENT.LABEL_INPUT_CHECKBOX_ELEMENT_DISABLED_CLASS_ID);
                }
            }
        } else {
            throw new Error("Object \'InputCheckboxElement\' is not prepared");
        }
    }
}