import {
    DivWithHeaderAndDataBuilderElement
} from "../with_header/div_with_header_and_data_builder_element.js";

import {
    CssDivWithDataBuilderElement
} from "../../../../css/elements/div/css_div_with_data_builder_element.js";

const _CSS_DIV_WITH_DATA_BUILDER_ELEMENT = new CssDivWithDataBuilderElement();

export class DivWithImgAndDataBuilderElement extends DivWithHeaderAndDataBuilderElement {
    #doNeedImgBackground;

    #divWithImgAndDataContainer;
    #img;

    constructor(doNeedImgBackground) {
        super();

        this.#doNeedImgBackground = doNeedImgBackground;

        this.#tryToSetDefaultValues();
    }

    getDivWithImgAndDataContainer() {
        return this.#divWithImgAndDataContainer;
    }

    #tryToSetDefaultValues() {
        let divWithImgAndDataContainer = this.#divWithImgAndDataContainer;
        if (!divWithImgAndDataContainer) {
            divWithImgAndDataContainer = document.createElement("div");
            divWithImgAndDataContainer.classList.add(
                _CSS_DIV_WITH_DATA_BUILDER_ELEMENT.DIV_WITH_IMG_AND_DATA_BUILDER_ELEMENT_CONTAINER_CLASS_ID);
        }

        // Изображение ---
        let img = this.#img;
        if (!img) {
            img = document.createElement("img");
            img.classList.add(this.#doNeedImgBackground
                ? _CSS_DIV_WITH_DATA_BUILDER_ELEMENT.IMG_DIV_WITH_IMG_AND_DATA_BUILDER_ELEMENT_IMG_WITH_BACKGROUND_CLASS_ID
                : _CSS_DIV_WITH_DATA_BUILDER_ELEMENT.IMG_DIV_WITH_IMG_AND_DATA_BUILDER_ELEMENT_IMG_WITHOUT_BACKGROUND_CLASS_ID);
        }
        //---

        // Добавляем элементы в контейнер, если они не имеют родителя ---
        if (img && !img.parentElement) {
            let divImgContainer = document.createElement("div");
            divImgContainer.classList.add(_CSS_DIV_WITH_DATA_BUILDER_ELEMENT.DIV_WITH_IMG_AND_DATA_BUILDER_ELEMENT_IMG_CONTAINER_CLASS_ID);
            divImgContainer.appendChild(img);

            divWithImgAndDataContainer.appendChild(divImgContainer);
        }

        let divWithHeaderAndDataContainer = this.getDivWithHeaderAndDataContainer();
        if (divWithHeaderAndDataContainer && !divWithHeaderAndDataContainer.parentElement) {
            divWithImgAndDataContainer.appendChild(divWithHeaderAndDataContainer);
        }
        //---

        this.#divWithImgAndDataContainer = divWithImgAndDataContainer;
        this.#img = img;
    }

    setImageSrc(src) {
        let img = this.#img;
        if (img) {
            img.src = src;
        }
    }
}