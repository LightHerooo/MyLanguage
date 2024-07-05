import {
    CustomTimer
} from "../../../../../timer/custom_timer.js";

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
    #customTimer = new CustomTimer();

    constructor(inputTextWithRuleElementObj) {
        super(inputTextWithRuleElementObj, inputTextWithRuleElementObj.getIsRequired());
    }


    async checkCorrectValue() {
        let isCorrect = await super.checkCorrectValue();
        if (isCorrect) {
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
                message = "Электронная почта не может быть пустой";
            }

            if (isCorrect) {
                const EMAIL_REGEXP = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
                if (!EMAIL_REGEXP.test(value)) {
                    isCorrect = false;
                    ruleType = _RULE_TYPES.ERROR;
                    message = "Некорректная электронная почта";
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
                            let jsonResponse = await _CUSTOMERS_API.GET.isExistsByEmail(value);
                            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                                isCorrect = false;
                                ruleType = _RULE_TYPES.ERROR;
                                message = new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage();
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
        }

        return isCorrect;
    }
}