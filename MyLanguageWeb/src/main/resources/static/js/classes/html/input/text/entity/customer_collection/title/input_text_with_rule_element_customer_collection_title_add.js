import {
    InputTextWithRuleElement
} from "../../../input_text_with_rule_element.js";

import {
    CustomTimer
} from "../../../../../../timer/custom_timer.js";

import {
    RuleTypes
} from "../../../../../span/elements/rule/rule_types.js";

import {
    CustomerCollectionsAPI
} from "../../../../../../api/entity/customer_collections_api.js";

import {
    HttpStatuses
} from "../../../../../../api/classes/http/http_statuses.js";

import {
    ResponseMessageResponseDTO
} from "../../../../../../dto/other/response/response_message_response_dto.js";

import {
    CustomerCollectionAddRequestDTO
} from "../../../../../../dto/entity/customer_collection/request/customer_collection_add_request_dto.js";

import {
    EventNames
} from "../../../../../event_names.js";

import {
    InputTextElementCustomerCollectionTitleUtils
} from "./input_text_element_customer_collection_title_utils.js";

const _CUSTOMER_COLLECTIONS_API = new CustomerCollectionsAPI();

const _RULE_TYPES = new RuleTypes();
const _HTTP_STATUSES = new HttpStatuses();
const _EVENT_NAMES = new EventNames();
const _INPUT_TEXT_ELEMENT_CUSTOMER_COLLECTION_TITLE_UTILS = new InputTextElementCustomerCollectionTitleUtils();

export class InputTextWithRuleElementCustomerCollectionTitleAdd extends InputTextWithRuleElement {
    #selectElementLangsIn;

    #customTimer = new CustomTimer();

    constructor(inputTextWithRuleElementObj) {
        super(inputTextWithRuleElementObj, inputTextWithRuleElementObj.getIsRequired());
    }

    setSelectElementLangsIn(selectElementLangsInObj) {
        this.#selectElementLangsIn = selectElementLangsInObj;
    }


    prepare() {
        super.prepare();

        let selectElementLangsIn = this.#selectElementLangsIn;
        if (selectElementLangsIn) {
            let select = selectElementLangsIn.getSelect();
            if (select) {
                let self = this;
                select.addEventListener(_EVENT_NAMES.SELECT.CHANGE, async function() {
                    await self.checkCorrectValue();
                })
            }
        }
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
            isCorrect = _INPUT_TEXT_ELEMENT_CUSTOMER_COLLECTION_TITLE_UTILS.checkCorrectValue(this);
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

                            let customerCollectionAddRequestDTO = new CustomerCollectionAddRequestDTO();
                            customerCollectionAddRequestDTO.setTitle(value);

                            let selectElementLangsIn = self.#selectElementLangsIn;
                            if (selectElementLangsIn) {
                                customerCollectionAddRequestDTO.setLangCode(selectElementLangsIn.getSelectedValue());
                            }

                            let jsonResponse = await _CUSTOMER_COLLECTIONS_API.POST.validateBeforeAdd(
                                customerCollectionAddRequestDTO);
                            if (jsonResponse.getStatus() !== _HTTP_STATUSES.OK) {
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