import {
    ButtonElementTypes
} from "../button_element_types.js";

import {
    ImgSrcs
} from "../../img_srcs.js";

const _BUTTON_ELEMENT_TYPES = new ButtonElementTypes();
const _IMG_SRCS = new ImgSrcs();

export class ButtonWithImgAndSpanElementTypes {
    DEFAULT = new ButtonWithImgAndSpanType(_BUTTON_ELEMENT_TYPES.DEFAULT,
        _IMG_SRCS.ELEMENTS.BUTTON.QUESTION);
    ACCEPT = new ButtonWithImgAndSpanType(_BUTTON_ELEMENT_TYPES.GREEN,
        _IMG_SRCS.ELEMENTS.BUTTON.ACCEPT);
    DENY = new ButtonWithImgAndSpanType(_BUTTON_ELEMENT_TYPES.RED,
        _IMG_SRCS.ELEMENTS.BUTTON.DENY);
    ADD = new ButtonWithImgAndSpanType(_BUTTON_ELEMENT_TYPES.GREEN,
        _IMG_SRCS.ELEMENTS.BUTTON.ADD);
    DELETE = new ButtonWithImgAndSpanType(_BUTTON_ELEMENT_TYPES.RED,
        _IMG_SRCS.ELEMENTS.BUTTON.DELETE);
    QUESTION = new ButtonWithImgAndSpanType(_BUTTON_ELEMENT_TYPES.YELLOW,
        _IMG_SRCS.ELEMENTS.BUTTON.QUESTION);
}

class ButtonWithImgAndSpanType {
    BUTTON_ELEMENT_TYPE;
    IMG_SRC;

    constructor(buttonElementType, imgSrc) {
        this.BUTTON_ELEMENT_TYPE = buttonElementType;
        this.IMG_SRC = imgSrc;
    }
}