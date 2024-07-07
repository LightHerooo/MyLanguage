import {
    CssButtonElement
} from "../../../../css/elements/button/css_button_element.js";

const _CSS_BUTTON_ELEMENT = new CssButtonElement();

export class ButtonWithImgAndSpanElementVerticalSizes {
    SIZE_128 = _CSS_BUTTON_ELEMENT.BUTTON_WITH_IMG_AND_SPAN_ELEMENT_VERTICAL_128_CLASS_ID;

    clearButton(button) {
        if (button) {
            button.classList.remove(this.SIZE_128);
        }
    }

    contains(buttonWithImgAndSpanElementVerticalSize) {
        let sizesArr = [ this.SIZE_128 ];

        return sizesArr.includes(buttonWithImgAndSpanElementVerticalSize);
    }
}