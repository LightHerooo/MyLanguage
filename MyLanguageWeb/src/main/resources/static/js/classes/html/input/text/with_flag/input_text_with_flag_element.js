import {
    InputTextElement
} from "../input_text_element.js";

import {
    CssInputTextElement
} from "../../../../css/elements/input/css_input_text_element.js";

import {
    SpanFlagElement
} from "../../../span/elements/span_flag_element.js";

const _CSS_INPUT_TEXT_ELEMENT = new CssInputTextElement();

export class InputTextWithFlagElement extends InputTextElement {
    #divContainer;
    #spanFlag;

    #spanFlagElement;

    constructor(divContainer, inputTextElementObj, spanFlag) {
        super(inputTextElementObj.getInputText());
        this.#divContainer = divContainer;
        this.#spanFlag = spanFlag;

        this.#tryToSetDefaultValues();
    }

    getDivContainer() {
        return this.#divContainer;
    }

    getSpanFlag() {
        return this.#spanFlag;
    }

    getSpanFlagElement() {
        return this.#spanFlagElement;
    }


    #tryToSetDefaultValues() {
        let divContainer = this.#divContainer;
        if (!divContainer) {
            divContainer = document.createElement("div");
            divContainer.classList.add(_CSS_INPUT_TEXT_ELEMENT.DIV_INPUT_TEXT_WITH_FLAG_ELEMENT_CONTAINER_CLASS_ID);
        }

        let spanFlag = this.#spanFlag;
        if (!spanFlag) {
            spanFlag = document.createElement("span");
        }

        // Создаём элемент, который будет нужен для изменения флага ---
        let spanFlagElement = new SpanFlagElement(spanFlag);
        //---


        // Добавляем элементы в контейнер, если они не имеют родителя ---
        let inputText = this.getInputText();
        if (inputText && !inputText.parentElement) {
            divContainer.appendChild(inputText);
        }

        if (spanFlag && !spanFlag.parentElement) {
            let divFlagContentCenter = document.createElement("div");
            let divFlagContainer = document.createElement("div");

            divFlagContainer.appendChild(spanFlag);
            divFlagContentCenter.appendChild(divFlagContainer);

            divContainer.appendChild(divFlagContentCenter);
        }
        //---

        this.#divContainer = divContainer;
        this.#spanFlag = spanFlag;
        this.#spanFlagElement = spanFlagElement;
    }


    changeFlag(countryName, countryCode) {
        let spanFlagElement = this.#spanFlagElement;
        if (spanFlagElement) {
            spanFlagElement.changeFlag(countryName, countryCode, true);
        }
    }
}