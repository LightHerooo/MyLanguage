import {
    AButtonElementTypes
} from "../a_button_element_types.js";

import {
    ImgSrcs
} from "../../../img_srcs.js";

const _A_BUTTON_ELEMENT_TYPES = new AButtonElementTypes();
const _IMG_SRCS = new ImgSrcs();

export class AButtonWithImgElementTypes {
    DEFAULT = new AButtonWithImgElementType(_A_BUTTON_ELEMENT_TYPES.DEFAULT,
        _IMG_SRCS.ELEMENTS.BUTTON.QUESTION);
    INFO = new AButtonWithImgElementType(_A_BUTTON_ELEMENT_TYPES.BLUE,
        _IMG_SRCS.ELEMENTS.BUTTON.INFO);
    ARROW_RIGHT = new AButtonWithImgElementType(_A_BUTTON_ELEMENT_TYPES.GREEN,
        _IMG_SRCS.ELEMENTS.BUTTON.ARROW_RIGHT);
    EDIT = new AButtonWithImgElementType(_A_BUTTON_ELEMENT_TYPES.BLUE,
        _IMG_SRCS.ELEMENTS.BUTTON.EDIT);
    ADD = new AButtonWithImgElementType(_A_BUTTON_ELEMENT_TYPES.GREEN,
        _IMG_SRCS.ELEMENTS.BUTTON.ADD);
}

class AButtonWithImgElementType {
    A_BUTTON_ELEMENT_TYPE;
    IMG_SRC;

    constructor(aButtonElementType, imgSrc) {
        this.A_BUTTON_ELEMENT_TYPE = aButtonElementType;
        this.IMG_SRC = imgSrc;
    }
}