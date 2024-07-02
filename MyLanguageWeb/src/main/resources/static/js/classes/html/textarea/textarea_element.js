import {
    CssTextareaElement
} from "../../css/textarea/css_textarea.js";

import {
    HtmlUtils
} from "../html_utils.js";

import {
    EventNames
} from "../event_names.js";

const _CSS_TEXTAREA_ELEMENT = new CssTextareaElement();

const _HTML_UTILS = new HtmlUtils();
const _EVENT_NAMES = new EventNames();

export class TextareaElement {
    #textarea;

    constructor(textarea) {
        this.#textarea = textarea;

        this.#tryToSetDefaultValues();
    }

    getTextarea() {
        return this.#textarea;
    }


    #tryToSetDefaultValues() {
        let textarea = this.#textarea;
        if (!textarea) {
            textarea = document.createElement("textarea");
            textarea.classList.add(_CSS_TEXTAREA_ELEMENT.TEXTAREA_ELEMENT_CLASS_ID);
        }

        this.#textarea = textarea;
    }


    getValue() {
        let value;

        let textarea = this.#textarea;
        if (textarea) {
            value = textarea.value;
        }

        return value;
    }

    changeValue(value, doNeedToCallInputEvent) {
        let textarea = this.#textarea;
        if (textarea) {
            textarea.value = value;

            if (doNeedToCallInputEvent) {
                _HTML_UTILS.callEvent(textarea, _EVENT_NAMES.TEXTAREA.INPUT);
            }
        }
    }

    changeDisabledStatus(isDisabled) {
        let textarea = this.#textarea;
        if (textarea) {
            textarea.disabled = isDisabled;
        }
    }
}