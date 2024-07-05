import {
    RuleTypes
} from "../../../../../span/elements/rule/rule_types.js";

const _RULE_TYPES = new RuleTypes();

export class InputTextElementCustomerCollectionTitleUtils {
    checkCorrectValue(inputTextElementCustomerCollectionTitleObj) {
        let isCorrect = false;
        if (inputTextElementCustomerCollectionTitleObj) {
            isCorrect = true;
            let ruleType;
            let message;

            let value = inputTextElementCustomerCollectionTitleObj.getValue();
            const TITLE_MIN_SIZE = 3;
            const TITLE_MAX_SIZE = 30;
            if (value.length < TITLE_MIN_SIZE || value.length > TITLE_MAX_SIZE) {
                isCorrect = false;
                ruleType = _RULE_TYPES.ERROR;
                message = `Название должно быть быть от ${TITLE_MIN_SIZE} до ${TITLE_MAX_SIZE} символов.`;
            }

            if (!isCorrect) {
                inputTextElementCustomerCollectionTitleObj.showRule(ruleType, message);
            } else {
                inputTextElementCustomerCollectionTitleObj.hideRule();
            }
        }

        return isCorrect;
    }
}