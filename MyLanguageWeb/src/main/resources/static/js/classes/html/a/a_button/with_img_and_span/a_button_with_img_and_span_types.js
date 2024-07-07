import {
    AButtonElementTypes
} from "../a_button_element_types.js";

import {
    ImgSrcs
} from "../../../img_srcs.js";

const _A_BUTTON_ELEMENT_TYPES = new AButtonElementTypes();
const _IMG_SRCS = new ImgSrcs();

export class AButtonWithImgAndSpanElementTypes {
    DEFAULT = new AButtonWithImgAndSpanType(_A_BUTTON_ELEMENT_TYPES.DEFAULT,
        _IMG_SRCS.ELEMENTS.BUTTON.QUESTION);
}

class AButtonWithImgAndSpanType {
    A_BUTTON_ELEMENT_TYPE;
    IMG_SRC;

    constructor(aButtonElementType, imgSrc) {
        this.A_BUTTON_ELEMENT_TYPE = aButtonElementType;
        this.IMG_SRC = imgSrc;
    }
}