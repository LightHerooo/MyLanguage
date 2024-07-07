import {
    CssButtonElement
} from "../../../css/elements/button/css_button_element.js";

import {
    HtmlUtils
} from "../../html_utils.js";

import {
    ButtonElementTypes
} from "../button_element_types.js";

import {
    HotkeyManager
} from "../../hotkey_manager.js";

import {
    EventNames
} from "../../event_names.js";

const _CSS_BUTTON_ELEMENT = new CssButtonElement();
const _BUTTON_ELEMENT_TYPES = new ButtonElementTypes();
const _HTML_UTILS = new HtmlUtils();
const _HOTKEY_MANAGER = new HotkeyManager();
const _EVENT_NAMES = new EventNames();

export class ButtonAbstractElement {
    #button;

    constructor(button) {
        if (this.constructor === ButtonAbstractElement) {
            throw new Error('Abstract classes can\'t be instantiated.');
        }

        this.#button = button;

        this.#tryToSetDefaultValues();
    }

    getButton() {
        return this.#button;
    }


    #tryToSetDefaultValues() {
        let button = this.#button;
        if (!button) {
            button = document.createElement("button");
            button.classList.add(_CSS_BUTTON_ELEMENT.BUTTON_ELEMENT_DEFAULT_CLASS_ID);
        }

        this.#button = button;
    }


    changeButtonStyle(buttonElementType) {
        let button = this.#button;
        if (button && buttonElementType) {
            _BUTTON_ELEMENT_TYPES.clearButton(button);
            button.classList.add(buttonElementType);
        }
    }

    changeTitle(str) {
        let button = this.#button;
        if (button) {
            button.title = str;
        }
    }

    changeDisabledStatus(isDisabled) {
        let button = this.#button;
        if (button) {
            button.disabled = isDisabled;
        }
    }

    addHotkey(keyCode, doNeedToRemoveAfterAction) {
        let button = this.#button;
        if (button && keyCode) {
            this.changeTitle(`${button.textContent} [${keyCode}]`);

            let self = this;
            let hotkeyManagerAddFunction = _HOTKEY_MANAGER.add(keyCode, function () {
                self.callEvent(_EVENT_NAMES.BUTTON.CLICK);
            }, doNeedToRemoveAfterAction);

            if (doNeedToRemoveAfterAction) {
                button.addEventListener(_EVENT_NAMES.BUTTON.CLICK, function () {
                    _HOTKEY_MANAGER.remove(hotkeyManagerAddFunction);
                })
            }
        }
    }

    callEvent(eventName) {
        let button = this.#button;
        if (button) {
            _HTML_UTILS.callEvent(button, eventName);
        }
    }
}