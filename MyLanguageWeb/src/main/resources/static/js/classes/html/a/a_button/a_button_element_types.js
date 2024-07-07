import {
    CssAButtonElement
} from "../../../css/elements/a/css_a_button_element.js";

const _CSS_A_BUTTON_ELEMENT = new CssAButtonElement();
export class AButtonElementTypes {
    DEFAULT = _CSS_A_BUTTON_ELEMENT.A_BUTTON_ELEMENT_DEFAULT_CLASS_ID;
    RED = _CSS_A_BUTTON_ELEMENT.A_BUTTON_ELEMENT_RED_CLASS_ID;
    BLUE = _CSS_A_BUTTON_ELEMENT.A_BUTTON_ELEMENT_BLUE_CLASS_ID;
    GREEN = _CSS_A_BUTTON_ELEMENT.A_BUTTON_ELEMENT_GREEN_CLASS_ID;

    clearA(a) {
        if (a) {
            a.classList.remove(this.DEFAULT);
            a.classList.remove(this.RED);
            a.classList.remove(this.BLUE);
            a.classList.remove(this.GREEN);
        }
    }
}