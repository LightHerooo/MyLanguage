import {
    CssButtonElement
} from "../../../../css/elements/button/css_button_element.js";

const _CSS_BUTTON_ELEMENT = new CssButtonElement();

export class ButtonWithImgAndSpanElementHorizontalSizes {
    SIZE_32 = _CSS_BUTTON_ELEMENT.BUTTON_WITH_IMG_AND_SPAN_ELEMENT_HORIZONTAL_32_CLASS_ID;

    clearButton(button) {
        if (button) {
            button.classList.remove(this.SIZE_32);
        }
    }

    contains(buttonWithImgAndSpanElementHorizontalSize) {
        let sizesArr = [ this.SIZE_32 ];

        return sizesArr.includes(buttonWithImgAndSpanElementHorizontalSize);
    }
}