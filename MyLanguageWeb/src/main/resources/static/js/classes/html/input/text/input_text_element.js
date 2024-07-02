import {
    CssInputTextElement
} from "../../../css/input/css_input_text_element.js";

import {
    HtmlUtils
} from "../../html_utils.js";

import {
    EventNames
} from "../../event_names.js";

const _CSS_INPUT_TEXT_ELEMENT = new CssInputTextElement();

const _HTML_UTILS = new HtmlUtils();
const _EVENT_NAMES = new EventNames();

export class InputTextElement {
    #inputText;

    constructor(inputText) {
        this.#inputText = inputText;

        this.#tryToSetDefaultValues();
    }

    getInputText() {
        return this.#inputText;
    }


    #tryToSetDefaultValues() {
        let inputText = this.#inputText;
        if (!inputText) {
            inputText = document.createElement("input");
            inputText.classList.add(_CSS_INPUT_TEXT_ELEMENT.INPUT_TEXT_ELEMENT_CLASS_ID);
            inputText.type = "text";
        }

        this.#inputText = inputText;
    }


    getValue() {
        let value;
        let inputText = this.#inputText;
        if (inputText) {
            value = inputText.value.trim();
        }

        return value;
    }

    changeValue(value, doNeedToCallInputEvent) {
        let inputText = this.#inputText;
        if (inputText) {
            inputText.value = value;

            if (doNeedToCallInputEvent) {
                _HTML_UTILS.callEvent(inputText, _EVENT_NAMES.INPUT.TEXT.INPUT);
            }
        }
    }

    changeDisabledStatus(isDisabled) {
        let inputText = this.#inputText;
        if (inputText) {
            inputText.disabled = isDisabled;
        }
    }

    changeReadOnlyStatus(isReadOnly) {
        let inputText = this.#inputText;
        if (inputText) {
            inputText.readOnly = isReadOnly;
        }
    }
}