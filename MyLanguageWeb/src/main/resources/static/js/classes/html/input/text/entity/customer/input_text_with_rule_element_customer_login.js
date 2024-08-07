import {
    InputTextWithRuleElement
} from "../../input_text_with_rule_element.js";

import {
    RuleTypes
} from "../../../../span/elements/rule/rule_types.js";

import {
    CustomersAPI
} from "../../../../../api/entity/customers_api.js";

import {
    HttpStatuses
} from "../../../../../api/classes/http/http_statuses.js";

import {
    ResponseMessageResponseDTO
} from "../../../../../dto/other/response/response_message_response_dto.js";

const _CUSTOMERS_API = new CustomersAPI();

const _RULE_TYPES = new RuleTypes();
const _HTTP_STATUSES = new HttpStatuses();

export class InputTextWithRuleElementCustomerLogin extends InputTextWithRuleElement {
    constructor(inputTextWithRuleElementObj) {
        super(inputTextWithRuleElementObj, inputTextWithRuleElementObj.getIsRequired());
    }


    async checkCorrectValue() {
        let isCorrect = await super.checkCorrectValue();
        if (isCorrect) {
            let ruleType;
            let message;

            let value = this.getValue();
            const LOGIN_REGEXP = /^[A-Za-z0-9_]+$/;
            if (!LOGIN_REGEXP.test(value)) {
                isCorrect = false;
                ruleType = _RULE_TYPES.ERROR;
                message = "Логин должен содержать только английские буквы, цифры и знаки подчеркивания [_]";
            }

            if (isCorrect) {
                const LOGIN_MIN_SIZE = 3;
                const LOGIN_MAX_SIZE = 15;
                if (value.length < LOGIN_MIN_SIZE || value.length > LOGIN_MAX_SIZE) {
                    isCorrect = false;
                    ruleType = _RULE_TYPES.ERROR;
                    message = `Логин должен быть от ${LOGIN_MIN_SIZE} до ${LOGIN_MAX_SIZE} символов.`;
                }
            }

            if (isCorrect) {
                this.hideRule();

                let self = this;
                let customTimerCheckerPromise = new Promise(resolve => {
                    let customTimerChecker = self.getCustomTimerChecker();
                    if (customTimerChecker) {
                        customTimerChecker.setHandler(async function() {
                            let jsonResponse = await _CUSTOMERS_API.GET.isExistsByLogin(value);
                            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                                isCorrect = false;
                                ruleType = _RULE_TYPES.ERROR;
                                message = new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage();
                            }
                            resolve();
                        })
                        customTimerChecker.start();
                    } else {
                        resolve();
                    }
                });

                await customTimerCheckerPromise;
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