import {
    ButtonAbstractElement
} from "../abstracts/button_abstract_element.js";

import {
    ButtonWithImgAndSpanElementHorizontalSizes
} from "./sizes/button_with_img_and_span_element_horizontal_sizes.js";

import {
    ButtonWithImgAndSpanElementTypes
} from "./button_with_img_and_span_element_types.js";

import {
    ButtonWithImgAndSpanElementVerticalSizes
} from "./sizes/button_with_img_and_span_element_vertical_sizes.js";

const _BUTTON_WITH_IMG_AND_SPAN_ELEMENT_HORIZONTAL_SIZES =
    new ButtonWithImgAndSpanElementHorizontalSizes();
const _BUTTON_WITH_IMG_AND_SPAN_ELEMENT_VERTICAL_SIZES =
    new ButtonWithImgAndSpanElementVerticalSizes();
const _BUTTON_WITH_IMG_AND_SPAN_ELEMENT_TYPES = new ButtonWithImgAndSpanElementTypes();

export class ButtonWithImgAndSpanElement extends ButtonAbstractElement {
    #img;
    #span;

    constructor(button, img, span) {
        super(button);
        this.#img = img;
        this.#span = span;

        this.#tryToSetDefaultValues();
    }

    getImg() {
        return this.#img;
    }

    getSpan() {
        return this.#span;
    }


    #tryToSetDefaultValues() {
        let img = this.#img;
        if (!img) {
            img = document.createElement("img");
            img.src = _BUTTON_WITH_IMG_AND_SPAN_ELEMENT_TYPES.DEFAULT.IMG_SRC;
        }

        let span = this.#span;
        if (!span) {
            span = document.createElement("span");
            span.textContent = "Кнопка";
        }


        // Добавляем элементы в кнопку, если они не имеют родителя ---
        let button = this.getButton();
        if (img && !img.parentElement) {
            let spanImgContainer = document.createElement("span");
            spanImgContainer.appendChild(img);

            button.appendChild(spanImgContainer);
        }

        if (span && !span.parentElement) {
            button.appendChild(span);
        }
        //---

        this.#span = span;
        this.#img = img;
    }


    changeButtonWithImgAndSpanElementSize(buttonWithImgAndSpanElementSize) {
        let button = this.getButton();
        if (button && buttonWithImgAndSpanElementSize) {
            // Очищаем кнопку-ссылку от предыдущих стилей, добавляем новый ---
            _BUTTON_WITH_IMG_AND_SPAN_ELEMENT_HORIZONTAL_SIZES.clearButton(button);
            _BUTTON_WITH_IMG_AND_SPAN_ELEMENT_VERTICAL_SIZES.clearButton(button);

            button.classList.add(buttonWithImgAndSpanElementSize);
            //---

            // В зависимости от направления, мы должны переустановить элементы внутри кнопки-ссылки ---
            let img = this.#img;
            let span = this.#span;
            if (img && span) {
                if (_BUTTON_WITH_IMG_AND_SPAN_ELEMENT_HORIZONTAL_SIZES.contains(buttonWithImgAndSpanElementSize)) {
                    button.replaceChildren();

                    // Текст ---
                    button.appendChild(span)
                    //---

                    // Изображение ---
                    let spanImgContainer = document.createElement("span");
                    spanImgContainer.appendChild(img);

                    button.appendChild(spanImgContainer);
                    //---
                } else if (_BUTTON_WITH_IMG_AND_SPAN_ELEMENT_VERTICAL_SIZES.contains(buttonWithImgAndSpanElementSize)) {
                    button.replaceChildren();

                    // Изображение ---
                    let spanImgContainer = document.createElement("span");
                    spanImgContainer.appendChild(img);

                    button.appendChild(spanImgContainer);
                    //---

                    // Текст ---
                    button.appendChild(span)
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

    changeTo(buttonWithImgAndSpanElementTypeObj) {
        if (buttonWithImgAndSpanElementTypeObj) {
            let buttonElementType = buttonWithImgAndSpanElementTypeObj.BUTTON_ELEMENT_TYPE;
            if (buttonElementType) {
                this.changeButtonStyle(buttonElementType);
            }

            let imgSrc = buttonWithImgAndSpanElementTypeObj.IMG_SRC;
            if (imgSrc) {
                this.changeImgSrc(imgSrc);
            }
        }
    }
}