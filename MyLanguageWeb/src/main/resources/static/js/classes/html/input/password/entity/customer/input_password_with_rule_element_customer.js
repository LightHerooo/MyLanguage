import {
    InputPasswordWithRuleElement
} from "../../input_password_with_rule_element.js";

import {
    RuleTypes
} from "../../../../span/elements/rule/rule_types.js";

const _RULE_TYPES = new RuleTypes();

export class InputPasswordWithRuleElementCustomerPassword extends InputPasswordWithRuleElement {
    constructor(inputPasswordWithRuleElementObj) {
        super(inputPasswordWithRuleElementObj, inputPasswordWithRuleElementObj.getIsRequired());
    }

    async checkCorrectValue() {
        let isCorrect = await super.checkCorrectValue();
        if (isCorrect) {
            let ruleType;
            let message;

            let value = this.getValue();

            const PASSWORD_MIN_SIZE = 8;
            if (value.length < PASSWORD_MIN_SIZE) {
                isCorrect = false;
                ruleType = _RULE_TYPES.ERROR;
                message = `Пароль должен быть не менее ${PASSWORD_MIN_SIZE} символов.`;
            }

            if (isCorrect) {
                const PASSWORD_REGEXP_DIGITS = /^.*[0-9]+.*$/;
                if (!PASSWORD_REGEXP_DIGITS.test(value)) {
                    isCorrect = false;
                    ruleType = _RULE_TYPES.ERROR;
                    message = "Пароль должен содержать минимум одну цифру [0-9].";
                }
            }

            if (isCorrect) {
                const PASSWORD_REGEXP_SPECIAL_SYMBOLS = /^.*[%@?~#-]+.*$/;
                const PASSWORD_SPECIAL_SYMBOLS = "%, @, ?, ~, #, -";
                if (!PASSWORD_REGEXP_SPECIAL_SYMBOLS.test(value)) {
                    isCorrect = false;
                    ruleType = _RULE_TYPES.ERROR;
                    message = `Пароль должен содержать минимум один специальный символ (${PASSWORD_SPECIAL_SYMBOLS}).`;
                }
            }

            if (!isCorrect) {
                this.showRule(ruleType, message);
            } else {
                this.hideRule();
            }
        }

        return isCorrect;
    }
}