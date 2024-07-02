import {
    CssAButtonElement
} from "../../../../../css/a/css_a_button_element.js";

const _CSS_A_BUTTON_ELEMENT = new CssAButtonElement();

export class AButtonWithImgAndSpanElementVerticalSizes {
    SIZE_128 = _CSS_A_BUTTON_ELEMENT.A_BUTTON_WITH_IMG_AND_SPAN_ELEMENT_VERTICAL_128_CLASS_ID;

    clearA(a) {
        if (a) {
            a.classList.remove(this.SIZE_128);
        }
    }

    contains(aButtonWithImgAndSpanElementVerticalSize) {
        let sizesArr = [ this.SIZE_128 ];
        return sizesArr.includes(aButtonWithImgAndSpanElementVerticalSize);
    }
}