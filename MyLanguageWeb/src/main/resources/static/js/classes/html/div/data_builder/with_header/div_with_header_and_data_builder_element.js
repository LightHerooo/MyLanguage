import {
    CssDivWithDataBuilderElement
} from "../../../../css/div/css_div_with_data_builder_element.js";

import {
    DivWithDataBuilderElement
} from "../div_with_data_builder_element.js";

const _CSS_DIV_WITH_DATA_BUILDER_ELEMENT = new CssDivWithDataBuilderElement();

export class DivWithHeaderAndDataBuilderElement extends DivWithDataBuilderElement {
    #divWithHeaderAndDataContainer;
    #h1;

    constructor() {
        super();
        this.#tryToSetDefaultValues();
    }

    getDivWithHeaderAndDataContainer() {
        return this.#divWithHeaderAndDataContainer;
    }

    #tryToSetDefaultValues() {
        let divWithHeaderAndDataContainer = this.#divWithHeaderAndDataContainer;
        if (!divWithHeaderAndDataContainer) {
            divWithHeaderAndDataContainer = document.createElement("div");
            divWithHeaderAndDataContainer.classList.add(
                _CSS_DIV_WITH_DATA_BUILDER_ELEMENT.DIV_WITH_HEADER_AND_DATA_BUILDER_ELEMENT_CONTAINER_CLASS_ID);
        }

        // Заголовок ---
        let h1 = this.#h1;
        if (!h1) {
            h1 = document.createElement("h1");
        }
        //---


        // Добавляем элементы в контейнер, если они не имеют родителя ---
        if (h1 && !h1.parentElement) {
            divWithHeaderAndDataContainer.appendChild(h1);
        }

        let divContainer = this.getDivContainer();
        if (divContainer && !divContainer.parentElement) {
            divWithHeaderAndDataContainer.appendChild(divContainer);
        }
        //---

        this.#divWithHeaderAndDataContainer = divWithHeaderAndDataContainer;
        this.#h1 = h1;
    }


    setHeaderBySpan(spanElement) {
        let h1 = this.#h1;
        if (h1) {
            h1.replaceChildren();
            h1.appendChild(spanElement);
        }
    }

    setHeaderByStr(str) {
        let span = document.createElement("span");
        span.textContent = str;

        this.setHeaderBySpan(span);
    }
}