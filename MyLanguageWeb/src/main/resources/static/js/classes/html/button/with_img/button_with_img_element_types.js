import {
    ButtonElementTypes
} from "../button_element_types.js";

import {
    ImgSrcs
} from "../../img_srcs.js";

const _BUTTON_ELEMENT_TYPES = new ButtonElementTypes();
const _IMG_SRCS = new ImgSrcs();

export class ButtonWithImgElementTypes {
    DEFAULT = new ButtonWithImgElementType(_BUTTON_ELEMENT_TYPES.DEFAULT,
        _IMG_SRCS.ELEMENTS.BUTTON.QUESTION);
    ACCEPT = new ButtonWithImgElementType(_BUTTON_ELEMENT_TYPES.GREEN,
        _IMG_SRCS.ELEMENTS.BUTTON.ACCEPT);
    DENY = new ButtonWithImgElementType(_BUTTON_ELEMENT_TYPES.RED,
        _IMG_SRCS.ELEMENTS.BUTTON.DENY);
    ADD = new ButtonWithImgElementType(_BUTTON_ELEMENT_TYPES.GREEN,
        _IMG_SRCS.ELEMENTS.BUTTON.ADD);
    DELETE = new ButtonWithImgElementType(_BUTTON_ELEMENT_TYPES.RED,
        _IMG_SRCS.ELEMENTS.BUTTON.DELETE);
    QUESTION = new ButtonWithImgElementType(_BUTTON_ELEMENT_TYPES.YELLOW,
        _IMG_SRCS.ELEMENTS.BUTTON.QUESTION);
    ARROW_UP = new ButtonWithImgElementType(_BUTTON_ELEMENT_TYPES.RED,
        _IMG_SRCS.ELEMENTS.BUTTON.ARROW_UP);
    ARROW_RIGHT = new ButtonWithImgElementType(_BUTTON_ELEMENT_TYPES.GREEN,
        _IMG_SRCS.ELEMENTS.BUTTON.ARROW_RIGHT);
    ARROW_DOWN = new ButtonWithImgElementType(_BUTTON_ELEMENT_TYPES.GREEN,
        _IMG_SRCS.ELEMENTS.BUTTON.ARROW_DOWN);
    REFRESH = new ButtonWithImgElementType(_BUTTON_ELEMENT_TYPES.DEFAULT,
        _IMG_SRCS.ELEMENTS.BUTTON.REFRESH);
    WAIT = new ButtonWithImgElementType(_BUTTON_ELEMENT_TYPES.YELLOW,
        _IMG_SRCS.ELEMENTS.BUTTON.WAIT);
}

class ButtonWithImgElementType {
    BUTTON_ELEMENT_TYPE;
    IMG_SRC;

    constructor(buttonElementType, imgSrc) {
        this.BUTTON_ELEMENT_TYPE = buttonElementType;
        this.IMG_SRC = imgSrc;
    }
}