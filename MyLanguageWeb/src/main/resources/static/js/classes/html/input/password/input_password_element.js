import {
    CssPasswordElement
} from "../../../css/elements/input/css_input_password_element.js";

import {
    HtmlUtils
} from "../../html_utils.js";

import {
    EventNames
} from "../../event_names.js";

const _CSS_INPUT_PASSWORD_ELEMENT = new CssPasswordElement();

const _HTML_UTILS = new HtmlUtils();
const _EVENT_NAMES = new EventNames();

export class InputPasswordElement {
    #inputPassword;

    constructor(inputPassword) {
        this.#inputPassword = inputPassword;

        this.#tryToSetDefaultValues();
    }

    getInputPassword() {
        return this.#inputPassword;
    }


    #tryToSetDefaultValues() {
        let inputPassword = this.#inputPassword;
        if (!inputPassword) {
            inputPassword = document.createElement("input");
            inputPassword.classList.add(_CSS_INPUT_PASSWORD_ELEMENT.INPUT_PASSWORD_ELEMENT_CLASS_ID);
            inputPassword.type = "password";
        }

        this.#inputPassword = inputPassword;
    }


    getValue() {
        let value;
        let inputPassword = this.#inputPassword;
        if (inputPassword) {
            value = inputPassword.value;
        }

        return value;
    }

    changeValue(value, doNeedToCallInputEvent) {
        let inputPassword = this.#inputPassword;
        if (inputPassword) {
            inputPassword.value = value;

            if (doNeedToCallInputEvent) {
                _HTML_UTILS.callEvent(inputPassword, _EVENT_NAMES.INPUT.PASSWORD.INPUT);
            }
        }
    }

    changeDisabledStatus(isDisabled) {
        let inputPassword = this.#inputPassword;
        if (inputPassword) {
            inputPassword.disabled = isDisabled;
        }
    }

    changeReadOnlyStatus(isReadOnly) {
        let inputPassword = this.#inputPassword;
        if (inputPassword) {
            inputPassword.readOnly = isReadOnly;
        }
    }
}