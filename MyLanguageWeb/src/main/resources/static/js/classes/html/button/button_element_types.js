import {
    CssButtonElement
} from "../../css/elements/button/css_button_element.js";

const _CSS_BUTTON_ELEMENT = new CssButtonElement();

export class ButtonElementTypes {
    DEFAULT = _CSS_BUTTON_ELEMENT.BUTTON_ELEMENT_DEFAULT_CLASS_ID;
    GREEN = _CSS_BUTTON_ELEMENT.BUTTON_ELEMENT_GREEN_CLASS_ID;
    YELLOW = _CSS_BUTTON_ELEMENT.BUTTON_ELEMENT_YELLOW_CLASS_ID;
    RED = _CSS_BUTTON_ELEMENT.BUTTON_ELEMENT_RED_CLASS_ID;

    clearButton(button) {
        if (button) {
            button.classList.remove(this.DEFAULT);
            button.classList.remove(this.GREEN);
            button.classList.remove(this.YELLOW);
            button.classList.remove(this.RED);
        }
    }
}