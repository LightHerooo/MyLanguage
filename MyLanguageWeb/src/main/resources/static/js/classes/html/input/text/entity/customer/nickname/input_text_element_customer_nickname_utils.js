import {
    RuleTypes
} from "../../../../../span/elements/rule/rule_types.js";

const _RULE_TYPES = new RuleTypes();

export class InputTextElementCustomerNicknameUtils {
    checkCorrectValue(inputTextWithRuleElementCustomerNicknameObj) {
        let isCorrect = false;
        if (inputTextWithRuleElementCustomerNicknameObj) {
            isCorrect = true;
            let ruleType;
            let message;

            let value = inputTextWithRuleElementCustomerNicknameObj.getValue();
            const NICKNAME_MIN_SIZE = 3;
            const NICKNAME_MAX_SIZE = 15;
            if (value.length < NICKNAME_MIN_SIZE || value.length > NICKNAME_MAX_SIZE) {
                isCorrect = false;
                ruleType = _RULE_TYPES.ERROR;
                message = `Никнейм должен быть от ${NICKNAME_MIN_SIZE} до ${NICKNAME_MAX_SIZE} символов.`;
            }

            if (!isCorrect) {
                inputTextWithRuleElementCustomerNicknameObj.showRule(ruleType, message);
            } else {
                inputTextWithRuleElementCustomerNicknameObj.hideRule();
            }
        }

        return isCorrect;
    }
}