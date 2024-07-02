import {
    AButtonAbstractElement
} from "../abstracts/a_button_abstract_element.js";

import {
    AButtonWithImgAndSpanElementTypes
} from "./a_button_with_img_and_span_types.js";

import {
    AButtonWithImgAndSpanElementHorizontalSizes
} from "./sizes/a_button_with_img_and_span_element_horizontal_sizes.js";

import {
    AButtonWithImgAndSpanElementVerticalSizes
} from "./sizes/a_button_with_img_and_span_element_vertical_sizes.js";

const _A_BUTTON_WITH_IMG_AND_SPAN_ELEMENT_HORIZONTAL_SIZES =
    new AButtonWithImgAndSpanElementHorizontalSizes();
const _A_BUTTON_WITH_IMG_AND_SPAN_ELEMENT_VERTICAL_SIZES =
    new AButtonWithImgAndSpanElementVerticalSizes();
const _A_BUTTON_WITH_IMG_AND_SPAN_ELEMENT_TYPES = new AButtonWithImgAndSpanElementTypes();

export class AButtonWithImgAndSpanElement extends AButtonAbstractElement {
    #img;
    #span;

    constructor(a, img, span) {
        super(a);
        this.#img = img;
        this.#span = span;

        this.#tryToSetDefaultValues();
    }


    #tryToSetDefaultValues() {
        let img = this.#img;
        if (!img) {
            img = document.createElement("img");
            img.src = _A_BUTTON_WITH_IMG_AND_SPAN_ELEMENT_TYPES.DEFAULT.IMG_SRC;
        }

        let span = this.#span;
        if (!span) {
            span = document.createElement("span");
            span.textContent = "Кнопка";
        }

        // Добавляем элементы в кнопку-ссылку, если они не имеют родителя ---
        let a = this.getA();
        if (img && !img.parentElement) {
            let spanImgContainer = document.createElement("span");
            spanImgContainer.appendChild(img);

            a.appendChild(spanImgContainer);
        }

        if (span && !span.parentElement) {
            a.appendChild(span);
        }
        //---

        this.#img = img;
        this.#span = span;
    }


    changeAButtonWithImgAndTextElementSize(aButtonWithImgAndSpanElementSize) {
        let a = this.getA();
        if (a && aButtonWithImgAndSpanElementSize) {
            // Очищаем кнопку-ссылку от предыдущих стилей, добавляем новый ---
            _A_BUTTON_WITH_IMG_AND_SPAN_ELEMENT_HORIZONTAL_SIZES.clearA(a);
            _A_BUTTON_WITH_IMG_AND_SPAN_ELEMENT_VERTICAL_SIZES.clearA(a);

            a.classList.add(aButtonWithImgAndSpanElementSize);
            //---

            // В зависимости от направления, мы должны переустановить элементы внутри кнопки-ссылки ---
            let img = this.#img;
            let span = this.#span;
            if (img && span) {
                if (_A_BUTTON_WITH_IMG_AND_SPAN_ELEMENT_HORIZONTAL_SIZES.contains(aButtonWithImgAndSpanElementSize)) {
                    a.replaceChildren();

                    // Текст ---
                    a.appendChild(span)
                    //---

                    // Изображение ---
                    let spanImgContainer = document.createElement("span");
                    spanImgContainer.appendChild(img);

                    a.appendChild(spanImgContainer);
                    //---
                } else if (_A_BUTTON_WITH_IMG_AND_SPAN_ELEMENT_VERTICAL_SIZES.contains(aButtonWithImgAndSpanElementSize)) {
                    a.replaceChildren();

                    // Изображение ---
                    let spanImgContainer = document.createElement("span");
                    spanImgContainer.appendChild(img);

                    a.appendChild(spanImgContainer);
                    //---

                    // Текст ---
                    a.appendChild(span)
                    //---
                }
            }
            //---
        }
    }

    changeImgSrc(src) {
        let img = this.#img;
        if (img) {
            img.src = src;
        }
    }

    changeSpanText(str) {
        let span = this.#span;
        if (span) {
            span.textContent = str;
        }
    }

    changeTo(aButtonWithImgAndSpanElementTypeObj) {
        if (aButtonWithImgAndSpanElementTypeObj) {
            let aButtonElementType = aButtonWithImgAndSpanElementTypeObj.A_BUTTON_ELEMENT_TYPE;
            if (aButtonElementType) {
                this.changeAStyle(aButtonElementType);
            }

            let imgSrc = aButtonWithImgAndSpanElementTypeObj.IMG_SRC;
            if (imgSrc) {
                this.changeImgSrc(imgSrc);
            }
        }
    }
}