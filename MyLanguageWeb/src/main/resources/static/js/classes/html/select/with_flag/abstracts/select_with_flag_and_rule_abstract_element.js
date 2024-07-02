import {
    SelectWithFlagAbstractElement
} from "./select_with_flag_abstract_element.js";

import {
    SpanRuleElement
} from "../../../span/elements/rule/span_rule_element.js";

import {
    RuleTypes
} from "../../../span/elements/rule/rule_types.js";

import {
    EventNames
} from "../../../event_names.js";

const _RULE_TYPES = new RuleTypes();
const _EVENT_NAMES = new EventNames();

export class SelectWithFlagAndRuleAbstractElement extends SelectWithFlagAbstractElement {
    #spanRuleElement;

    constructor(divContainer, select, spanFlag, doNeedToCreateFirstOption) {
        super(divContainer, select, spanFlag, doNeedToCreateFirstOption);
        if (this.constructor === SelectWithFlagAndRuleAbstractElement) {
            throw new Error('Abstract classes can\'t be instantiated.');
        }
    }


    prepare() {
        super.prepare();

        // Вышаем событие проверки корректности значения выделенного элемента ---
        let select = this.getSelect();
        if (select) {
            let self = this;
            select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, async function() {
                await self.checkCorrectValue();
            })
        }
        //---
    }


    async refresh(doNeedToSaveSelectedPosition) {
        await super.refresh(doNeedToSaveSelectedPosition);

        await this.checkCorrectValue();
    }


    showRule(ruleTypeObj, message) {
        let isPrepared = this.getIsPrepared();
        if (isPrepared) {
            this.hideRule();

            let spanRuleElement = new SpanRuleElement(ruleTypeObj, message);

            let divContainer = this.getDivContainer();
            let span = spanRuleElement.getSpan();
            if (divContainer && span) {
                let parentElement = divContainer.parentElement;
                if (parentElement) {
                    parentElement.appendChild(span);
                }
            }

            this.#spanRuleElement = spanRuleElement;
        } else {
            throw new Error("Object \'SelectWithFlagAndRuleAbstractElement\' is not prepared.");
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
            throw new Error("Object \'SelectWithFlagAndRuleAbstractElement\' is not prepared.");
        }
    }


    async checkCorrectValue() {
        let isCorrect = false;
        let isPrepared = this.getIsPrepared();
        if (isPrepared) {
            isCorrect = true;
            let ruleType = _RULE_TYPES.ERROR;
            let message = "Проверки не подготовлены";

            //...

            isCorrect = false;
            if (!isCorrect) {
                this.showRule(ruleType, message);
            } else {
                this.hideRule();
            }
        } else {
            throw new Error("Object \'SelectWithFlagAndRuleAbstractElement\' is not prepared.");
        }

        return isCorrect;
    }
}