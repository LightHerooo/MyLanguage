import {
    CssAButtonElement
} from "../../../../css/a/css_a_button_element.js";

const _CSS_A_BUTTON_ELEMENT = new CssAButtonElement();

export class AButtonWithImgElementSizes {
    SIZE_16 = _CSS_A_BUTTON_ELEMENT.A_BUTTON_WITH_IMG_ELEMENT_16_CLASS_ID;
    SIZE_32 = _CSS_A_BUTTON_ELEMENT.A_BUTTON_WITH_IMG_ELEMENT_32_CLASS_ID;
    SIZE_64 = _CSS_A_BUTTON_ELEMENT.A_BUTTON_WITH_IMG_ELEMENT_64_CLASS_ID;

    clearA(a) {
        if (a) {
            a.classList.remove(this.SIZE_16);
            a.classList.remove(this.SIZE_32);
            a.classList.remove(this.SIZE_64);
        }
    }
}