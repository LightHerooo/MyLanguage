import {
    ButtonAbstractElement
} from "../abstracts/button_abstract_element.js";

import {
    ButtonWithImgElementSizes
} from "./button_with_img_element_sizes.js";

import {
    ButtonWithImgElementTypes
} from "./button_with_img_element_types.js";

const _BUTTON_WITH_IMG_ELEMENT_TYPES = new ButtonWithImgElementTypes();
const _BUTTON_WITH_IMG_ELEMENT_SIZES = new ButtonWithImgElementSizes();

export class ButtonWithImgElement extends ButtonAbstractElement {
    #img;

    constructor(button, img) {
        super(button);
        this.#img = img;

        this.#tryToSetDefaultValues();
    }

    getImg() {
        return this.#img;
    }


    #tryToSetDefaultValues() {
        let button = this.getButton();

        let img = this.#img;
        if (!img) {
            img = document.createElement("img");
            img.src = _BUTTON_WITH_IMG_ELEMENT_TYPES.DEFAULT.IMG_SRC;
        }


        // Добавляем элементы в кнопку, если они не имеют родителя ---
        if (img && !img.parentElement) {
            button.appendChild(img);
        }
        //---

        this.#img = img;
    }


    changeButtonWithImgElementSize(buttonWithImgElementSize) {
        let button = this.getButton();
        if (button) {
            // Очищаем кнопку от предыдущих стилей ---
            _BUTTON_WITH_IMG_ELEMENT_SIZES.clearButton(button);
            //---

            button.classList.add(buttonWithImgElementSize);
        }
    }

    changeImgSrc(src) {
        let img = this.#img;
        if (img) {
            img.src = src;
        }
    }

    changeTo(buttonWithImgElementTypeObj) {
        if (buttonWithImgElementTypeObj) {
            let buttonElementType = buttonWithImgElementTypeObj.BUTTON_ELEMENT_TYPE;
            if (buttonElementType) {
                this.changeButtonStyle(buttonElementType);
            }

            let imgSrc = buttonWithImgElementTypeObj.IMG_SRC;
            if (imgSrc) {
                this.changeImgSrc(imgSrc);
            }
        }
    }
}