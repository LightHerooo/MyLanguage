import {
    SpanRuleElement
} from "../../span/elements/rule/span_rule_element.js";

import {
    AUtils
} from "../a_utils.js";

const _A_UTILS = new AUtils();

export class AAbstractElement {
    #a;

    #isPrepared = false;

    constructor(a) {
        if (this.constructor === AAbstractElement) {
            throw new Error('Abstract classes can\'t be instantiated.');
        }

        this.#a = a;

        this.#tryToSetDefaultValues();
    }

    getA() {
        return this.#a;
    }


    #tryToSetDefaultValues() {
        let a = this.#a;
        if (!a) {
            a = document.createElement("a");
        }

        this.#a = a;
    }


    changeTitle(str) {
        let a = this.#a;
        if (a && str) {
            a.title = str;
        }
    }

    changeHref(href) {
        let a = this.#a;
        if (a && href) {
            a.href = href;
        }
    }

    changeHrefType(hrefType) {
        let a = this.#a;
        if (a) {
            _A_UTILS.changeHrefType(a, hrefType);
        }
    }


    async prepare() {
        let isPrepared = this.#isPrepared;
        if (!isPrepared) {
            this.#isPrepared = true;
        } else {
            throw new Error("Object \'AAbstractElement\' has already been prepared.");
        }
    }

    clear() {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            let a = this.#a;
            if (a) {
                a.replaceChildren();
            }
        } else {
            throw new Error("Object \'AAbstractElement\' is not prepared.");
        }
    }

    async fill() {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            let content = await this.tryToCreateContent();
            if (content) {
                this.clear();

                let a = this.#a;
                if (a && content) {
                    a.appendChild(content);
                }
            }
        } else {
            throw new Error("Object \'AAbstractElement\' is not prepared.");
        }
    }

    showRule(ruleTypeObj, message) {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            this.clear();

            let a = this.#a;
            if (a) {
                a.appendChild(new SpanRuleElement(ruleTypeObj, message).getSpan());
            }
        } else {
            throw new Error("Object \'AAbstractElement\' is not prepared.");
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