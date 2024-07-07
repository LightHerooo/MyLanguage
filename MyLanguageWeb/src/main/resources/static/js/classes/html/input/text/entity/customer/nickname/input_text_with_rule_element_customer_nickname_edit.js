import {
    InputTextWithRuleElement
} from "../../../input_text_with_rule_element.js";

import {
    RuleTypes
} from "../../../../../span/elements/rule/rule_types.js";

import {
    CustomersAPI
} from "../../../../../../api/entity/customers_api.js";

import {
    HttpStatuses
} from "../../../../../../api/classes/http/http_statuses.js";

import {
    ResponseMessageResponseDTO
} from "../../../../../../dto/other/response/response_message_response_dto.js";

import {
    InputTextElementCustomerNicknameUtils
} from "./input_text_element_customer_nickname_utils.js";

import {
    CustomerResponseDTO
} from "../../../../../../dto/entity/customer/response/customer_response_dto.js";

const _CUSTOMERS_API = new CustomersAPI();

const _RULE_TYPES = new RuleTypes();
const _HTTP_STATUSES = new HttpStatuses();

const _INPUT_TEXT_ELEMENT_CUSTOMER_NICKNAME_UTILS = new InputTextElementCustomerNicknameUtils();

export class InputTextWithRuleElementCustomerNicknameEdit extends InputTextWithRuleElement {
    #customerId;

    constructor(inputTextWithRuleElementObj) {
        super(inputTextWithRuleElementObj, inputTextWithRuleElementObj.getIsRequired());
    }

    setCustomerId(customerId) {
        this.#customerId = customerId;
    }

    async checkCorrectValue() {
        let isCorrect = await super.checkCorrectValue();
        if (isCorrect) {
            // Проводим общие проверки ---
            isCorrect = _INPUT_TEXT_ELEMENT_CUSTOMER_NICKNAME_UTILS.checkCorrectValue(this);
            //---

            if (isCorrect) {
                this.hideRule();

                let ruleType;
                let message;

                let self = this;
                let customTimerCheckerPromise = new Promise(resolve => {
                    let customTimerChecker = self.getCustomTimerChecker();
                    if (customTimerChecker) {
                        customTimerChecker.setHandler(async function() {
                            let value = self.getValue();

                            let jsonResponse = await _CUSTOMERS_API.GET.isExistsByNickname(value);
                            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                                isCorrect = false;
                                ruleType = _RULE_TYPES.ERROR;
                                message = new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage();

                                // Сравниваем никнейм пользователя с введённым никнеймом ---
                                let customerId = self.#customerId;
                                if (customerId && customTimerChecker.getIsActive()) {
                                    jsonResponse = await _CUSTOMERS_API.GET.findByNickname(value);
                                    if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                                        let customer = new CustomerResponseDTO(jsonResponse.getJson());
                                        if (customer.getId() === customerId) {
                                            isCorrect = true;
                                        }
                                    }
                                }
                                //---
                            }

                            resolve();
                        });

                        customTimerChecker.start();
                    } else {
                        resolve();
                    }
                });

                await customTimerCheckerPromise;
                //---

                if (!isCorrect) {
                    this.showRule(ruleType, message);
                } else {
                    this.hideRule();
                }
            }
        }

        return isCorrect;
    }
}