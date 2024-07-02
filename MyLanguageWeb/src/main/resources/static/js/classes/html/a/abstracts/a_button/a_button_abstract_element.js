import {
    CssAButtonElement
} from "../../../../css/a/css_a_button_element.js";

import {
    AButtonElementTypes
} from "../../a_button/a_button_element_types.js";

import {
    AUtils
} from "../../a_utils.js";

const _CSS_A_BUTTON_ELEMENT = new CssAButtonElement();
const _A_BUTTON_ELEMENT_TYPES = new AButtonElementTypes();
const _A_UTILS = new AUtils();

export class AButtonAbstractElement {
    #a;

    constructor(a) {
        if (this.constructor === AButtonAbstractElement) {
            throw new Error('Abstract classes can\'t be instantiated.');
        }

        this.#a = a;

        this.#tryToSetDefaultValues();
    }

    getA() {
        return this.#a;
    }


    #tryToSetDefaultValues() {
        let a = this.#a;
        if (!a) {
            a = document.createElement("a");
        }

        this.#a = a;
    }


    changeTitle(str) {
        let a = this.#a;
        if (a && str) {
            a.title = str;
        }
    }

    changeHref(href) {
        let a = this.#a;
        if (a && href) {
            a.href = href;
        }
    }

    changeHrefType(hrefType) {
        let a = this.#a;
        if (a) {
            _A_UTILS.changeHrefType(a, hrefType);
        }
    }

    changeAStyle(aButtonElementType) {
        let a = this.#a;
        if (a && aButtonElementType) {
            _A_BUTTON_ELEMENT_TYPES.clearA(a);
            a.classList.add(aButtonElementType);
        }
    }

    changeDisabledStatus(isDisabled, doNeedPointerEvents) {
        let a = this.#a;
        if (a) {
            if (isDisabled) {
                if (doNeedPointerEvents) {
                    a.classList.add(_CSS_A_BUTTON_ELEMENT.A_BUTTON_ELEMENT_DISABLED_WITH_POINTER_EVENTS_CLASS_ID);
                    a.classList.remove(_CSS_A_BUTTON_ELEMENT.A_BUTTON_ELEMENT_DISABLED_CLASS_ID);
                } else {
                    a.classList.add(_CSS_A_BUTTON_ELEMENT.A_BUTTON_ELEMENT_DISABLED_CLASS_ID);
                    a.classList.remove(_CSS_A_BUTTON_ELEMENT.A_BUTTON_ELEMENT_DISABLED_WITH_POINTER_EVENTS_CLASS_ID);
                }
            } else {
                a.classList.remove(_CSS_A_BUTTON_ELEMENT.A_BUTTON_ELEMENT_DISABLED_CLASS_ID);
                a.classList.remove(_CSS_A_BUTTON_ELEMENT.A_BUTTON_ELEMENT_DISABLED_WITH_POINTER_EVENTS_CLASS_ID);
            }
        }
    }
}