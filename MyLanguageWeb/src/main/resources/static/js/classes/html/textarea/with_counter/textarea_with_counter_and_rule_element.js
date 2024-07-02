import {
    TextareaWithCounterElement
} from "./textarea_with_counter_element.js";

import {
    EventNames
} from "../../event_names.js";

import {
    SpanRuleElement
} from "../../span/elements/rule/span_rule_element.js";

import {
    RuleTypes
} from "../../span/elements/rule/rule_types.js";

const _EVENT_NAMES = new EventNames();
const _RULE_TYPES = new RuleTypes();

export class TextareaWithCounterAndRuleElement extends TextareaWithCounterElement {
    #isRequired = false;

    #spanRuleElement;

    constructor(textareaWithCounterElementObj, isRequired) {
        super(textareaWithCounterElementObj.getDivContainer(), textareaWithCounterElementObj,
            textareaWithCounterElementObj.getSpanCounter());
        this.#isRequired = isRequired;
    }

    getIsRequired() {
        return this.#isRequired;
    }

    prepare() {
        super.prepare();

        let textarea = this.getTextarea();
        if (textarea) {
            let self = this;
            textarea.addEventListener(_EVENT_NAMES.TEXTAREA.INPUT, async function() {
                await self.checkCorrectValue();
            })
        }
    }

    showRule(ruleTypeObj, message) {
        let isPrepared = this.getIsPrepared();
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
            throw new Error("Object \'TextareaWithCounterAndRuleElement\' is not prepared.");
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
            throw new Error("Object \'TextareaWithCounterAndRuleElement\' is not prepared.");
        }
    }


    async checkCorrectValue() {
        let isCorrect = false;
        let isPrepared = this.getIsPrepared();
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
            throw new Error("Object \'TextareaWithCounterAndRuleElement\' is not prepared.");
        }

        return isCorrect;
    }
}