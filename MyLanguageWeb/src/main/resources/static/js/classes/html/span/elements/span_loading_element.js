import {
    CssWithLoadingElement
} from "../../../css/span/css_span_loading_element.js";

const _CSS_SPAN_LOADING_ELEMENT = new CssWithLoadingElement();

export class SpanLoadingElement {
    #span;
    #message;

    constructor(message) {
        if (message) {
            this.#message = message;
        } else {
            let rndMessagesArr = ["Загружаем...", "Идёт загрузка...", "Загрузка...", "Подождите..."];
            this.#message = rndMessagesArr[Math.floor(Math.random() * rndMessagesArr.length)];
        }

        this.#tryToSetDefaultValues();
    }

    getSpan() {
        return this.#span;
    }


    #tryToSetDefaultValues() {
        let spanContainer = this.#span;
        if (!spanContainer) {
            // Основной контейнер ---
            spanContainer = document.createElement("span");
            spanContainer.classList.add(_CSS_SPAN_LOADING_ELEMENT.SPAN_LOADING_ELEMENT_CONTAINER_CLASS_ID);
            //---

            // Изображение загрузки ---
            let img = document.createElement("img");
            img.src = "";

            spanContainer.appendChild(img);
            //---

            // Сообщение о загрузке ---
            let span = document.createElement("span");
            span.textContent = this.#message;

            spanContainer.appendChild(span);
            //---
        }

        this.#span = spanContainer;
    }
}