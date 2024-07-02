import {
    SelectAbstractElement
} from "./select_abstract_element.js";

import {
    SpanRuleElement
} from "../../span/elements/rule/span_rule_element.js";

import {
    RuleTypes
} from "../../span/elements/rule/rule_types.js";

import {
    EventNames
} from "../../event_names.js";

const _RULE_TYPES = new RuleTypes();
const _EVENT_NAMES = new EventNames();

export class SelectWithRuleAbstractElement extends SelectAbstractElement {
    #spanRuleElement;

    constructor(select, doNeedToCreateFirstOption) {
        super(select, doNeedToCreateFirstOption);
        if (this.constructor === SelectWithRuleAbstractElement) {
            throw new Error('Abstract classes can\'t be instantiated.');
        }
    }


    prepare() {
        super.prepare();

        let select = this.getSelect();
        if (select) {
            let self = this;
            select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, async function() {
                await self.checkCorrectValue();
            })
        }
    }


    async refresh(doNeedToSaveSelectedPosition){
        await super.refresh(doNeedToSaveSelectedPosition);

        await this.checkCorrectValue();
    }


    showRule(ruleTypeObj, message) {
        let isPrepared = this.getIsPrepared();
        if (isPrepared) {
            this.hideRule();

            let spanRuleElement = new SpanRuleElement(ruleTypeObj, message);

            let select = this.getSelect();
            let span = spanRuleElement.getSpan();
            if (select && span) {
                let parentElement = select.parentElement;
                if (parentElement) {
                    parentElement.appendChild(span);
                }
            }

            this.#spanRuleElement = spanRuleElement;
        } else {
            throw new Error("Object \'SelectWithRuleAbstractElement\' is not prepared.");
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
            throw new Error("Object \'SelectWithRuleAbstractElement\' is not prepared.");
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
            throw new Error("Object \'SelectWithRuleAbstractElement\' is not prepared.");
        }

        return isCorrect;
    }
}