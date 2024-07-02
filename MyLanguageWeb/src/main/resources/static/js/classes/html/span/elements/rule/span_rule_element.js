import {
    RuleTypes
} from "./rule_types.js";

const _RULE_TYPES = new RuleTypes();

export class SpanRuleElement {
    #span;

    #ruleType;
    #message;

    constructor(ruleTypeObj, message) {
        this.#ruleType = ruleTypeObj ? ruleTypeObj : _RULE_TYPES.ERROR;
        this.#message = message ? message : "Неизвестная ошибка";

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
            spanContainer.classList.add(this.#ruleType);
            //---

            // Изображение ---
            let img = document.createElement("img");
            img.src = "";

            spanContainer.appendChild(img);
            //---

            let span = document.createElement("span");
            span.textContent = this.#message;

            spanContainer.appendChild(span);
            //---
        }

        this.#span = spanContainer;
    }
}