import {
    CssRule
} from "../css/other/css_rule.js";

import {
    RuleTypes
} from "./rule_types.js";

const _CSS_RULE = new CssRule();
const _RULE_TYPES = new RuleTypes();

export class RuleElement {
    #ruleElementId;
    #parentElement;
    message;
    ruleType;

    constructor(elementForRule, parentElement) {
        this.#ruleElementId = elementForRule.id + "_rule_element";
        this.#parentElement = parentElement;
    }

    #getRule() {
        return document.getElementById(this.#ruleElementId);
    }

    showRule() {
        let rule = this.#getRule();
        if (!rule) {
            rule = document.createElement("div");
            rule.classList.add(_CSS_RULE.DIV_RULE_CONTAINER_STYLE_ID);
            rule.id = this.#ruleElementId;

            if (this.#parentElement) {
                this.#parentElement.appendChild(rule);
            }
        } else {
            rule.replaceChildren();
        }

        // Изображение в зависимости от типа ---
        let imgRule = document.createElement("img");
        imgRule.classList.add(_CSS_RULE.IMG_IMG_RULE_STYLE_ID);
        imgRule.src = this.ruleType
            ? this.ruleType.PATH_TO_IMAGE
            : _RULE_TYPES.ERROR.PATH_TO_IMAGE;
        //---

        // Стиль сообщения в зависимости от типа ---
        let spanRuleText = document.createElement("span");
        spanRuleText.classList.add(this.ruleType
            ? this.ruleType.TEXT_STYLE_ID
            : _RULE_TYPES.ERROR.TEXT_STYLE_ID);
        spanRuleText.textContent = this.message
            ? this.message
            : "Неизвестная ошибка.";
        //---

        rule.appendChild(imgRule);
        rule.appendChild(spanRuleText);
    }

    removeRule() {
        let rule = this.#getRule();
        if (rule) {
            rule.parentElement.removeChild(rule);
        }
    }
}