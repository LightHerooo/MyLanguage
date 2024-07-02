import {
    SpanRuleElement
} from "../elements/rule/span_rule_element.js";

export class SpanAbstractElement {
    #span;

    #isPrepared = false;

    constructor(span) {
        if (this.constructor === SpanAbstractElement) {
            throw new Error('Abstract classes can\'t be instantiated.');
        }

        this.#span = span;

        this.#tryToSetDefaultValues();
    }

    getSpan() {
        return this.#span;
    }

    getIsPrepared() {
        return this.#isPrepared;
    }


    #tryToSetDefaultValues() {
        let span = this.#span;
        if (!span) {
            span = document.createElement("span");
        }

        this.#span = span;
    }


    async prepare() {
        let isPrepared = this.#isPrepared;
        if (!isPrepared) {
            this.#isPrepared = true;
        } else {
            throw new Error("Object \'SpanAbstractElement\' has already been prepared.");
        }
    }


    clear() {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            let span = this.#span;
            if (span) {
                span.replaceChildren();
            }
        } else {
            throw new Error("Object \'SpanAbstractElement\' is not prepared.");
        }
    }

    async fill() {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            let content = await this.tryToCreateContent();
            if (content) {
                this.clear();

                let span = this.#span;
                if (span && content) {
                    span.appendChild(content);
                }
            }
        } else {
            throw new Error("Object \'SpanAbstractElement\' is not prepared.");
        }
    }


    showRule(ruleTypeObj, message) {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            this.clear();

            let span = this.#span;
            if (span) {
                span.appendChild(new SpanRuleElement(ruleTypeObj, message).getSpan());
            }
        } else {
            throw new Error("Object \'SpanAbstractElement\' is not prepared.");
        }
    }


    async tryToCreateContent() {
        let span;

        let testValue = true;
        if (testValue) {
            span = document.createElement("span");
            span.textContent = "Генерация контента не подготовлена";
        }

        return span;
    }
}