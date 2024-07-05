import {
    SelectElementBooleanUtils
} from "./select_element_boolean_utils.js";

import {
    SelectWithRuleAbstractElement
} from "../../abstracts/select_with_rule_abstract_element.js";

import {
    RuleTypes
} from "../../../span/elements/rule/rule_types.js";

const _SELECT_ELEMENT_BOOLEAN_UTILS = new SelectElementBooleanUtils();
const _RULE_TYPES = new RuleTypes();

export class SelectWithRuleElementBoolean extends SelectWithRuleAbstractElement {
    constructor(select, doNeedToCreateFirstOption, isRequired) {
        super(select, doNeedToCreateFirstOption, isRequired);
    }

    getSelectedValue() {
        return _SELECT_ELEMENT_BOOLEAN_UTILS.getSelectedValue(this);
    }

    changeSelectedOptionByValue(value, doNeedToCallChangeEvent) {
        let isPrepared = this.getIsPrepared();
        if (isPrepared) {
            _SELECT_ELEMENT_BOOLEAN_UTILS.changeSelectedOptionByValue(this, value, doNeedToCallChangeEvent);
        } else {
            throw new Error("Object \'SelectWithRuleElementBoolean\' is not prepared");
        }
    }


    async createFirstOption() {
        return _SELECT_ELEMENT_BOOLEAN_UTILS.createFirstOption();
    }

    async createOptionsArr() {
        return _SELECT_ELEMENT_BOOLEAN_UTILS.createOptionsArr();
    }

    async checkCorrectValue() {
        let isCorrect = false;
        let isPrepared = this.getIsPrepared();
        if (isPrepared) {
            isCorrect = true;
            let ruleType;
            let message;

            let isRequired = this.getIsRequired();
            if (isRequired) {
                let selectedValue = this.getSelectedValue();
                if (selectedValue === null || selectedValue === undefined) {
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
            throw new Error("Object \'SelectWithRuleElementBoolean\' is not prepared");
        }

        return isCorrect;
    }
}