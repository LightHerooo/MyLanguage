import {
    InputTextWithRuleAbstractElement
} from "../../abstracts/input_text_with_rule_abstract_element.js";

import {
    RuleTypes
} from "../../../../span/elements/rule/rule_types.js";

import {
    CustomTimer
} from "../../../../../timer/custom_timer.js";

import {
    CustomersAPI
} from "../../../../../api/entity/customers_api.js";

import {
    HttpStatuses
} from "../../../../../api/classes/http/http_statuses.js";

import {
    ResponseMessageResponseDTO
} from "../../../../../dto/other/response/response_message_response_dto.js";

import {
    CustomerResponseDTO
} from "../../../../../dto/entity/customer/response/customer_response_dto.js";

const _CUSTOMERS_API = new CustomersAPI();

const _RULE_TYPES = new RuleTypes();
const _HTTP_STATUSES = new HttpStatuses();

export class InputTextWithRuleElementCustomerNickname extends InputTextWithRuleAbstractElement {
    #customerId;

    #customTimer = new CustomTimer();

    constructor(inputTextElementObj) {
        super(inputTextElementObj);
    }

    setCustomerId(customerId) {
        this.#customerId = customerId;
    }


    async checkCorrectValue() {
        let isCorrect = false;
        let isPrepared = this.getIsPrepared();
        if (isPrepared) {
            isCorrect = true;
            let ruleType;
            let message;

            // Останавливаем таймер, чтобы завершить предыдущие проверки ---
            let customTimer = this.#customTimer;
            if (customTimer) {
                customTimer.stop();
            }
            //---

            let value = this.getValue();
            if (!value) {
                isCorrect = false;
                ruleType = _RULE_TYPES.ERROR;
                message = "Никнейм не может быть пустым.";
            }

            if (isCorrect) {
                const NICKNAME_MIN_SIZE = 3;
                const NICKNAME_MAX_SIZE = 15;
                if (value.length < NICKNAME_MIN_SIZE || value.length > NICKNAME_MAX_SIZE) {
                    isCorrect = false;
                    ruleType = _RULE_TYPES.ERROR;
                    message = `Никнейм должен быть от ${NICKNAME_MIN_SIZE} до ${NICKNAME_MAX_SIZE} символов.`;
                }
            }

            if (isCorrect) {
                this.hideRule();

                let self = this;
                let customTimerPromise = new Promise(resolve => {
                    let customTimer = self.#customTimer;
                    if (customTimer) {
                        customTimer.setTimeout(250);
                        customTimer.setHandler(async function() {
                            let jsonResponse = await _CUSTOMERS_API.GET.isExistsByNickname(value);
                            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                                isCorrect = false;
                                ruleType = _RULE_TYPES.ERROR;
                                message = new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage();

                                // Если указан id пользователя, то мы должны проверить совпадение по его никнейму ---
                                let customerId = self.#customerId;
                                if (customerId && customTimer.getIsActive()) {
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
                        customTimer.start();
                    } else {
                        resolve();
                    }
                });

                await customTimerPromise;
            }

            if (!isCorrect) {
                this.showRule(ruleType, message);
            } else {
                this.hideRule();
            }
        } else {
            throw new Error("Object \'InputTextWithRuleAbstractElement\' is not prepared.");
        }

        return isCorrect;
    }
}