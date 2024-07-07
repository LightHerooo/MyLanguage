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

export class InputTextWithRuleElementCustomerEmail extends InputTextWithRuleElement {
    constructor(inputTextWithRuleElementObj) {
        super(inputTextWithRuleElementObj, inputTextWithRuleElementObj.getIsRequired());
    }


    async checkCorrectValue() {
        let isCorrect = await super.checkCorrectValue();
        if (isCorrect) {
            let ruleType;
            let message;

            let value = this.getValue();
            const EMAIL_REGEXP = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
            if (!EMAIL_REGEXP.test(value)) {
                isCorrect = false;
                ruleType = _RULE_TYPES.ERROR;
                message = "Некорректная электронная почта";
            }

            if (isCorrect) {
                this.hideRule();

                let self = this;
                let customTimerCheckerPromise = new Promise(resolve => {
                    let customTimerChecker = self.getCustomTimerChecker();
                    if (customTimerChecker) {
                        customTimerChecker.setHandler(async function() {
                            let jsonResponse = await _CUSTOMERS_API.GET.isExistsByEmail(value);
                            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                                isCorrect = false;
                                ruleType = _RULE_TYPES.ERROR;
                                message = new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage();
                            }
                            resolve();
                        });
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