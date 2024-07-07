import {
    CssDivElement
} from "../../../css/elements/div/css_div_element.js";

import {
    CssRoot
} from "../../../css/css_root.js";

import {
    SpanRuleElement
} from "../../span/elements/rule/span_rule_element.js";

import {
    CssInfoBlock
} from "../../../css/info_block/css_info_block.js";

const _CSS_ROOT = new CssRoot();
const _CSS_INFO_BLOCK = new CssInfoBlock();
const _CSS_DIV_ELEMENT = new CssDivElement();

export class DivAbstractElement {
    #div;

    #isPrepared = false;

    constructor(div) {
        if (this.constructor === DivAbstractElement) {
            throw new Error('Abstract classes can\'t be instantiated.');
        }

        this.#div = div;

        this.#tryToSetDefaultValues();
    }

    getDiv() {
        return this.#div;
    }

    getIsPrepared() {
        return this.#isPrepared;
    }


    #tryToSetDefaultValues() {
        let div = this.#div;
        if (!div) {
            div = document.createElement("div");
        }

        this.#div = div;
    }


    async prepare() {
        let isPrepared = this.#isPrepared;
        if (!isPrepared) {
            this.#isPrepared = true;
        } else {
            throw new Error("Object \'DivAbstractElement\' has already been prepared");
        }
    }


    clear() {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            let div = this.#div;
            if (div) {
                div.replaceChildren();
            }
        } else {
            throw new Error("Object \'DivAbstractElement\' is not prepared");
        }
    }

    async fill() {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            let content = await this.tryToCreateContent();

            if (content) {
                this.clear();

                let div = this.#div;
                if (div) {
                    div.appendChild(content);
                }
            }
        } else {
            throw new Error("Object \'DivAbstractElement\' is not prepared");
        }
    }

    addInfoBlockContainerClassStyle() {
        let div = this.#div;
        if (div) {
            div.classList.add(_CSS_INFO_BLOCK.DIV_INFO_BLOCK_CONTAINER_CLASS_ID);
        }
    }

    removeInfoBlockContainerClassStyle() {
        let div = this.#div;
        if (div) {
            div.classList.remove(_CSS_INFO_BLOCK.DIV_INFO_BLOCK_CONTAINER_CLASS_ID);
        }
    }

    showMessage(message, rootFontSize) {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            if (!message) {
                message = "???";
            }

            if (!rootFontSize) {
                rootFontSize = _CSS_ROOT.SMALL_FONT_SIZE_STYLE_ID;
            }

            let divMessage = document.createElement("div");
            divMessage.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_CONTENT_CENTER_CLASS_ID);
            divMessage.style.fontSize = rootFontSize;
            divMessage.textContent = message;

            this.clear();

            let div = this.#div;
            if (div) {
                div.appendChild(divMessage);
            }
        } else {
            throw new Error("Object \'DivAbstractElement\' is not prepared");
        }
    }

    showRule(ruleTypeObj, message) {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            let divContentCenter = document.createElement("div");
            divContentCenter.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_CONTENT_CENTER_CLASS_ID);
            divContentCenter.appendChild(new SpanRuleElement(ruleTypeObj, message).getSpan());

            this.clear();

            let div = this.#div;
            if (div) {
                div.appendChild(divContentCenter);
            }
        } else {
            throw new Error("Object \'DivAbstractElement\' is not prepared");
        }
    }


    async tryToCreateContent() {
        let div;

        let testValue = true;
        if (testValue) {
            div = document.createElement("div");
            div.classList.add(_CSS_DIV_ELEMENT.DIV_ELEMENT_CONTENT_CENTER_CLASS_ID);
            div.textContent = "Генерация контента не подготовлена";
        } else {
            this.showMessage("Сообщение не подготовлено", _CSS_ROOT.MEDIUM_FONT_SIZE_STYLE_ID);
        }

        return div;
    }


    changeDisabledStatusToDivInstruments(isDisabled) {
        throw new Error('Method \'changeDisabledStatusToDivInstruments(isDisabled)\' must be implemented.');
    }
}