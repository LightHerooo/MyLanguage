import {
    InputTextWithRuleElement
} from "../../../input_text_with_rule_element.js";

import {
    RuleTypes
} from "../../../../../span/elements/rule/rule_types.js";

import {
    CustomTimer
} from "../../../../../../timer/custom_timer.js";

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

const _CUSTOMERS_API = new CustomersAPI();

const _RULE_TYPES = new RuleTypes();
const _HTTP_STATUSES = new HttpStatuses();

const _INPUT_TEXT_ELEMENT_CUSTOMER_NICKNAME_UTILS = new InputTextElementCustomerNicknameUtils();

export class InputTextWithRuleElementCustomerNicknameAdd extends InputTextWithRuleElement {
    #customTimer = new CustomTimer();

    constructor(inputTextWithRuleElementObj) {
        super(inputTextWithRuleElementObj, inputTextWithRuleElementObj.getIsRequired());
    }

    async checkCorrectValue() {
        let isCorrect = await super.checkCorrectValue();
        if (isCorrect) {
            // Останавливаем таймер, чтобы завершить предыдущие проверки ---
            let customTimer = this.#customTimer;
            if (customTimer) {
                customTimer.stop();
            }
            //---

            // Проводим общие проверки ---
            isCorrect = _INPUT_TEXT_ELEMENT_CUSTOMER_NICKNAME_UTILS.checkCorrectValue(this);
            //---

            if (isCorrect) {
                this.hideRule();

                let ruleType;
                let message;

                let self = this;
                let customTimerPromise = new Promise(resolve => {
                    let customTimer = self.#customTimer;
                    if (customTimer) {
                        customTimer.setTimeout(250);
                        customTimer.setHandler(async function() {
                            let value = self.getValue();

                            let jsonResponse = await _CUSTOMERS_API.GET.isExistsByNickname(value);
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