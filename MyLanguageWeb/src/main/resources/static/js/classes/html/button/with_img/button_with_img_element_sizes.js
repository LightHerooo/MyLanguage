import {
    CssButtonElement
} from "../../../css/elements/button/css_button_element.js";

const _CSS_BUTTON_ELEMENT = new CssButtonElement();

export class ButtonWithImgElementSizes {
    SIZE_16 = _CSS_BUTTON_ELEMENT.BUTTON_WITH_IMG_ELEMENT_16_CLASS_ID;
    SIZE_32 = _CSS_BUTTON_ELEMENT.BUTTON_WITH_IMG_ELEMENT_32_CLASS_ID;

    clearButton(button) {
        if (button) {
            button.classList.remove(this.SIZE_16);
            button.classList.remove(this.SIZE_32);
        }
    }
}