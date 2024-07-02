import {
    InputPasswordWithRuleAbstractElement
} from "../abstracts/input_password_with_rule_abstract_element.js";

import {
    RuleTypes
} from "../../../span/elements/rule/rule_types.js";

import {
    EventNames
} from "../../../event_names.js";

const _RULE_TYPES = new RuleTypes();
const _EVENT_NAMES = new EventNames();

export class InputPasswordWithRuleElementRepeat extends InputPasswordWithRuleAbstractElement {
    #firstInputPasswordElement;

    constructor(inputPasswordElementObj) {
        super(inputPasswordElementObj);
    }

    setFirstInputPasswordElement(firstInputPasswordElementObj) {
        this.#firstInputPasswordElement = firstInputPasswordElementObj;
    }

    async prepare() {
        await super.prepare();

        let firstInputPasswordElement = this.#firstInputPasswordElement;
        if (firstInputPasswordElement) {
            let inputPassword = firstInputPasswordElement.getInputPassword();
            if (inputPassword) {
                let self = this;
                inputPassword.addEventListener(_EVENT_NAMES.INPUT.PASSWORD.INPUT, function() {
                    self.checkCorrectValue();
                });
            }
        }
    }

    async checkCorrectValue() {
        let isCorrect = false;

        let isPrepared = this.getIsPrepared();
        if (isPrepared) {
            isCorrect = true;
            let ruleType;
            let message;

            let firstValue;
            let firstInputPasswordElement = this.#firstInputPasswordElement;
            if (firstInputPasswordElement) {
                firstValue = firstInputPasswordElement.getValue();
            }

            let secondValue = this.getValue();
            if (firstValue !== secondValue) {
                isCorrect = false;
                ruleType = _RULE_TYPES.ERROR;
                message = "Пароли не совпадают";
            }

            if (!isCorrect) {
                this.showRule(ruleType, message);
            } else {
                this.hideRule();
            }
        } else {
            throw new Error("Object \'InputPasswordWithRuleElementRepeat\' is not prepared.");
        }

        return isCorrect;
    }
}