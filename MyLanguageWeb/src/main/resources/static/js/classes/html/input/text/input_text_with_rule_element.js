import {
    InputTextElement
} from "./input_text_element.js";

import {
    SpanRuleElement
} from "../../span/elements/rule/span_rule_element.js";

import {
    RuleTypes
} from "../../span/elements/rule/rule_types.js";

import {
    EventNames
} from "../../event_names.js";

import {
    CustomTimer
} from "../../../timer/custom_timer.js";

const _RULE_TYPES = new RuleTypes();
const _EVENT_NAMES = new EventNames();

export class InputTextWithRuleElement extends InputTextElement {
    #isRequired = false;

    #isPrepared = false;
    #customTimerChecker = new CustomTimer();
    #spanRuleElement;

    constructor(inputTextElementObj, isRequired) {
        super(inputTextElementObj.getInputText());

        this.#isRequired = isRequired;
    }

    getIsPrepared() {
        return this.#isPrepared;
    }

    getIsRequired() {
        return this.#isRequired;
    }

    getCustomTimerChecker() {
        return this.#customTimerChecker;
    }


    prepare() {
        let isPrepared = this.#isPrepared;
        if (!isPrepared) {
            let inputText = this.getInputText();
            if (inputText) {
                let self = this;
                inputText.addEventListener(_EVENT_NAMES.INPUT.TEXT.INPUT, async function() {
                    await self.checkCorrectValue();
                })
            }

            // Устанавливаем задержку таймеру ---
            let customTimerChecker = this.#customTimerChecker;
            if (customTimerChecker) {
                customTimerChecker.setTimeout(250);
            }
            //---

            this.#isPrepared = true;
        } else {
            throw new Error("Object \'InputTextWithRuleElement\' has already been prepared");
        }
    }


    showRule(ruleTypeObj, message) {
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            this.hideRule();

            let spanRuleElement = new SpanRuleElement(ruleTypeObj, message);

            let inputText = this.getInputText();
            let span = spanRuleElement.getSpan();
            if (inputText && span) {
                let parentElement = inputText.parentElement;
                if (parentElement) {
                    parentElement.appendChild(span);
                }
            }

            this.#spanRuleElement = spanRuleElement;
        } else {
            throw new Error("Object \'InputTextWithRuleElement\' is not prepared");
        }
    }

    hideRule() {
        let isPrepared = this.#isPrepared;
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
            throw new Error("Object \'InputTextWithRuleElement\' is not prepared");
        }
    }


    async checkCorrectValue() {
        let isCorrect = false;
        let isPrepared = this.#isPrepared;
        if (isPrepared) {
            isCorrect = true;
            let ruleType;
            let message;

            // Останавливаем таймер от предыдущих проверок ---
            let customTimerChecker = this.#customTimerChecker;
            if (customTimerChecker) {
                customTimerChecker.stop();
            }
            //---

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
            throw new Error("Object \'InputTextWithRuleElement\' is not prepared");
        }

        return isCorrect;
    }
}