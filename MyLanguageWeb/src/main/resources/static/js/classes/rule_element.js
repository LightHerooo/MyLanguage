import {
    CssRule
} from "./css/css_rule.js";

const _CSS_RULE = new CssRule();

export class RuleElement {
    parentElementId;
    ruleElementId;

    constructor(parentElementId) {
        this.parentElementId = parentElementId;
        this.ruleElementId = parentElementId + "_div_rule";
    }

    #createDiv() {
        let div = document.createElement("div");
        div.classList.add(_CSS_RULE.DIV_RULE_CONTAINER_STYLE_ID);
        div.id = this.ruleElementId;

        let parent = document.getElementById(this.parentElementId);
        parent.appendChild(div);
    }

    #getDiv() {
        return document.getElementById(this.ruleElementId);
    }

    createOrChangeDiv(message, ruleType) {
        let div = this.#getDiv();
        if (div) {
            div.replaceChildren();
        } else {
            this.#createDiv();
            div = this.#getDiv();
        }

        // Изображение в зависимости от типа ---
        let imgRule = document.createElement("img");
        imgRule.classList.add(_CSS_RULE.IMG_IMG_RULE_STYLE_ID);
        imgRule.src = ruleType.PATH_TO_IMAGE;
        //---

        // Стиль сообщения в зависимости от типа ---
        let spanRuleText = document.createElement("span");
        spanRuleText.classList.add(ruleType.TEXT_STYLE_ID);
        spanRuleText.textContent = message;
        //---

        div.appendChild(imgRule);
        div.appendChild(spanRuleText);
    }

    removeDiv() {
        let div = this.#getDiv();
        if (div) {
            div.parentNode.removeChild(div);
        }
    }
}

export class RuleTypes {
    ACCEPT = new RuleType(_CSS_RULE.SPAN_RULE_ACCEPT_TEXT_STYLE_ID,
        "/images/rules/accept.png");
    WARNING = new RuleType(_CSS_RULE.SPAN_RULE_WARNING_TEXT_STYLE_ID,
        "/images/rules/warning.png");
    ERROR = new RuleType(_CSS_RULE.SPAN_RULE_ERROR_TEXT_STYLE_ID,
        "/images/rules/error.png");
}

class RuleType {
    TEXT_STYLE_ID;
    PATH_TO_IMAGE;

    constructor(textStyleId, pathToImage) {
        this.TEXT_STYLE_ID = textStyleId;
        this.PATH_TO_IMAGE = pathToImage;
    }
}