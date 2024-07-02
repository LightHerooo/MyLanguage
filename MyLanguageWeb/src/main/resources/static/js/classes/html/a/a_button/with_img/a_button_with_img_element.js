import {
    AButtonWithImgElementSizes
} from "./a_button_with_img_element_sizes.js";

import {
    AButtonWithImgElementTypes
} from "./a_button_with_img_element_types.js";

import {
    AButtonAbstractElement
} from "../../abstracts/a_button/a_button_abstract_element.js";

const _A_BUTTON_WITH_IMG_ELEMENT_TYPES = new AButtonWithImgElementTypes();
const _A_BUTTON_WITH_IMG_ELEMENT_SIZES = new AButtonWithImgElementSizes();

export class AButtonWithImgElement extends AButtonAbstractElement {
    #img;

    constructor(a, img) {
        super(a);
        this.#img = img;

        this.#tryToSetDefaultValues();
    }


    #tryToSetDefaultValues() {
        let img = this.#img;
        if (!img) {
            img = document.createElement("img");
            img.src = _A_BUTTON_WITH_IMG_ELEMENT_TYPES.DEFAULT.IMG_SRC;
        }

        // Добавляем элементы в кнопку-ссылку, если они не имеют родителя ---
        let a = this.getA();
        if (img && !img.parentElement) {
            a.appendChild(img);
        }
        //---

        this.#img = img;
    }


    changeAButtonWithImgElementSize(aButtonWithImgElementSize) {
        let a = this.getA();
        if (a && aButtonWithImgElementSize) {
            // Очищаем кнопку-ссылку от предыдущих стилей ---
            _A_BUTTON_WITH_IMG_ELEMENT_SIZES.clearA(a);
            //---

            a.classList.add(aButtonWithImgElementSize);
        }
    }

    changeImgSrc(src) {
        let img = this.#img;
        if (img) {
            img.src = src;
        }
    }

    changeTo(aButtonWithImgElementTypeObj) {
        if (aButtonWithImgElementTypeObj) {
            let aButtonElementType = aButtonWithImgElementTypeObj.A_BUTTON_ELEMENT_TYPE;
            if (aButtonElementType) {
                this.changeAStyle(aButtonElementType);
            }

            let imgSrc = aButtonWithImgElementTypeObj.IMG_SRC;
            if (imgSrc) {
                this.changeImgSrc(imgSrc);
            }
        }
    }
}