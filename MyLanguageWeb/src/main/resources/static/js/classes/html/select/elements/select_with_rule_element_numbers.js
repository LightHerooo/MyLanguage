import {
    SelectWithRuleAbstractElement
} from "../abstracts/select_with_rule_abstract_element.js";

import {
    RuleTypes
} from "../../span/elements/rule/rule_types.js";

const _RULE_TYPES = new RuleTypes();

export class SelectWithRuleElementNumbers extends SelectWithRuleAbstractElement {
    #numbersArr = [1, 2, 3, 4, 5];

    constructor(select, numbersArr, doNeedToCreateFirstOption, isRequired) {
        super(select, doNeedToCreateFirstOption, isRequired);
        this.#numbersArr = numbersArr;
    }

    getSelectedValue() {
        let value;

        let valueStr = super.getSelectedValue();
        if (valueStr) {
            value = Number(valueStr);
        }

        return value;
    }

    async createFirstOption() {
        let option = document.createElement("option");
        option.value = "";
        option.textContent = "Выберите число";

        return option;
    }

    async createOptionsArr() {
        let optionsArr = [];
        let numbersArr = this.#numbersArr;
        if (numbersArr) {
            for (let i = 0; i < numbersArr.length; i++) {
                let number = numbersArr[i];

                let option = document.createElement("option");
                option.value = `${number}`;
                option.textContent = `${number}`;
                optionsArr.push(option);
            }
        }

        return optionsArr;
    }

    async checkCorrectValue() {
        let isCorrect = await super.checkCorrectValue();
        if (isCorrect) {
            let ruleType;
            let message;

            // Значение должно быть числом ---
            let value = this.getSelectedValue();
            const NUMBER_OF_WORDS_REGEXP = /^[0-9]+$/;
            if (!NUMBER_OF_WORDS_REGEXP.test(value)) {
                isCorrect = false;
                ruleType = _RULE_TYPES.ERROR;
                message = "Выберите число";
            }
            //---

            // Ищем значение в массиве ---
            if (isCorrect) {
                let numbersArr = this.#numbersArr;
                if (numbersArr) {
                    let isValueInArr = false;
                    for (let i = 0; i < numbersArr.length; i++) {
                        if (value === numbersArr[i]) {
                            isValueInArr = true;
                            break;
                        }
                    }

                    if (!isValueInArr) {
                        isCorrect = false;
                        message = "Недопустимое число";
                        ruleType = _RULE_TYPES.ERROR;
                    }
                }
            }
            //---

            if (!isCorrect) {
                this.showRule(ruleType, message);
            } else {
                this.hideRule();
            }
        }

        return isCorrect;
    }
}