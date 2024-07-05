import {
    CssTextareaElement
} from "../../../css/textarea/css_textarea.js";

import {
    TextareaElement
} from "../textarea_element.js";

import {
    EventNames
} from "../../event_names.js";

const _CSS_TEXTAREA_ELEMENT = new CssTextareaElement();

const _EVENT_NAMES = new EventNames();

export class TextareaWithCounterElement extends TextareaElement {
    #divContainer;
    #spanCounter;
    #maxLength = 0;

    #isPrepared = false;

    constructor(divContainer, textareaElementObj, spanCounter) {
        super(textareaElementObj.getTextarea());
        this.#divContainer = divContainer;
        this.#spanCounter = spanCounter;

        this.#tryToSetDefaultValues();
    }

    getDivContainer() {
        return this.#divContainer;
    }

    getSpanCounter() {
        return this.#spanCounter;
    }

    getMaxLength() {
        return this.#maxLength;
    }

    getIsPrepared() {
        return this.#isPrepared;
    }


    #tryToSetDefaultValues() {
        let divContainer = this.#divContainer;
        if (!divContainer) {
            divContainer = document.createElement("div");
            divContainer.classList.add(_CSS_TEXTAREA_ELEMENT.DIV_TEXTAREA_WITH_COUNTER_ELEMENT_CLASS_ID);
        }

        let spanCounter = this.#spanCounter;
        if (!spanCounter) {
            spanCounter = document.createElement("span");
        }

        // Если контейнера ранее не существовало, мы должны добавить в него textarea ---
        if (!this.#divContainer) {
            let textarea = this.getTextarea();
            if (textarea) {
                divContainer.appendChild(textarea)
            }
        }
        //---

        // Добавляем элементы в контейнер, если у них нет родителя ---
        if (spanCounter && !spanCounter.parentElement) {
            let div = document.createElement("div");
            div.appendChild(spanCounter);

            divContainer.appendChild(div);
        }
        //---

        this.#divContainer = divContainer;
        this.#spanCounter = spanCounter;
    }

    #refreshCounter() {
        let spanCounter = this.#spanCounter;
        if (spanCounter) {
            let currentLength = 0;
            let currentValue = this.getValue();
            if (currentValue) {
                currentLength = currentValue.length;
            }

            let maxLength = this.#maxLength;
            if (maxLength) {
                spanCounter.textContent = `${currentLength}/${maxLength}`;

                if (currentLength === maxLength) {
                    spanCounter.style.color = "orange";
                } else if (currentLength > maxLength) {
                    spanCounter.style.color = "red";
                } else {
                    spanCounter.style.color = "";
                }
            } else {
                spanCounter.textContent = `${currentLength}/∞`;
            }
        }
    }


    changeMaxLength(value) {
        this.#maxLength = value;

        let textarea = this.getTextarea();
        if (textarea) {
            if (value && value > 0) {
                textarea.maxLength = value;
            } else {
                textarea.removeAttribute("maxLength");
            }
        }

        this.#refreshCounter();
    }

    changeValue(value, doNeedToCallInputEvent) {
        super.changeValue(value, doNeedToCallInputEvent);

        this.#refreshCounter();
    }


    prepare() {
        let isPrepared = this.#isPrepared;
        if (!isPrepared) {
            let textarea = this.getTextarea();
            if (textarea) {
                let self = this;
                textarea.addEventListener(_EVENT_NAMES.TEXTAREA.INPUT, function() {
                    self.#refreshCounter();
                })
            }

            this.#refreshCounter();

            this.#isPrepared = true;
        } else {
            throw new Error("Object \'TextareaWithCounterElement\' has already been prepared");
        }
    }
}