import {
    InputPasswordElement
} from "./input_password_element.js";

import {
    RuleTypes
} from "../../span/elements/rule/rule_types.js";

import {
    SpanRuleElement
} from "../../span/elements/rule/span_rule_element.js";

import {
    EventNames
} from "../../event_names.js";

const _RULE_TYPES = new RuleTypes();
const _EVENT_NAMES = new EventNames();

export class InputPasswordWithRuleElement extends InputPasswordElement {
    #isRequired = false;

    #isPrepared = false;
    #spanRuleElement;

    constructor(inputPasswordElementObj, isRequired) {
        super(inputPasswordElementObj.getInputPassword());

        this.#isRequired = isRequired;
    }

    getIsPrepared() {
        return this.#isPrepared;
    }

    getIsRequired() {
        return this.#isRequired;
    }


    prepare() {
        let isPrepared = this.#isPrepared;
        if (!isPrepared) {
            let inputPassword = this.getInputPassword();
            if (inputPassword) {
                let self = this;
                inputPassword.addEventListener(_EVENT_NAMES.INPUT.PASSWORD.INPUT, async function() {
                    await self.checkCorrectValue();
                })
            }

            this.#isPrepared = true;
        } else {
            throw new Error("Object \'InputPasswordWithRuleElement\' has already been prepared.");
        }
    }


    showRule(ruleTypeObj, message) {
        let isPrepared = this.getIsPrepared();
        if (isPrepared) {
            this.hideRule();

            let spanRuleElement = new SpanRuleElement(ruleTypeObj, message);

            let inputPassword = this.getInputPassword();
            let span = spanRuleElement.getSpan();
            if (inputPassword && span) {
                let parentElement = inputPassword.parentElement;
                if (parentElement) {
                    parentElement.appendChild(span);
                }
            }

            this.#spanRuleElement = spanRuleElement;
        } else {
            throw new Error("Object \'InputPasswordWithRuleElement\' is not prepared.");
        }
    }

    hideRule() {
        let isPrepared = this.getIsPrepared();
        if (isPrepared) {
            let spanRuleElement = this.#spanRuleElement;
            if (spanRuleElement) {
                let span = spanRuleElement.getSpan();
                if (span) {
                    let parentElement = span.parentElement;
                    if (parentElement) {
                        parentElement.removeChild(span);
                    }
                }
            }
        } else {
            throw new Error("Object \'InputPasswordWithRuleElement\' is not prepared.");
        }
    }


    async checkCorrectValue() {
        let isCorrect = false;
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            isCorrect = true;
            let ruleType;
            let message;

            let isRequired = this.#isRequired;
            if (isRequired) {
                let value = this.getValue();
                if (!value) {
                    isCorrect = false;
                    ruleType = _RULE_TYPES.ERROR;
                    message = "Обязательное поле";
                }
            }

            if (!isCorrect) {
                this.showRule(ruleType, message);
            } else {
                this.hideRule();
            }
        } else {
            throw new Error("Object \'InputPasswordWithRuleElement\' is not prepared.");
        }

        return isCorrect;
    }
}