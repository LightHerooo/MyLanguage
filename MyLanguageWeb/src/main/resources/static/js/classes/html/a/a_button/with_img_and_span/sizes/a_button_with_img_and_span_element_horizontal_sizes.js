import {
    CssAButtonElement
} from "../../../../../css/elements/a/css_a_button_element.js";

const _CSS_A_BUTTON_ELEMENT = new CssAButtonElement();

export class AButtonWithImgAndSpanElementHorizontalSizes {
    SIZE_32 = _CSS_A_BUTTON_ELEMENT.A_BUTTON_WITH_IMG_AND_SPAN_ELEMENT_HORIZONTAL_32_CLASS_ID;

    clearA(a) {
        if (a) {
            a.classList.remove(this.SIZE_32);
        }
    }

    contains(aButtonWithImgAndSpanElementHorizontalSize) {
        let sizesArr = [ this.SIZE_32 ];
        return sizesArr.includes(aButtonWithImgAndSpanElementHorizontalSize);
    }
}