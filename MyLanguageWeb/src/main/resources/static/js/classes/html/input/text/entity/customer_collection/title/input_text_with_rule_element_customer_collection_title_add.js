import {
    InputTextWithRuleElement
} from "../../../input_text_with_rule_element.js";

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
    InputTextElementCustomerCollectionTitleUtils
} from "./input_text_element_customer_collection_title_utils.js";

import {
    ProjectCookies
} from "../../../../../project_cookies.js";

const _CUSTOMER_COLLECTIONS_API = new CustomerCollectionsAPI();

const _RULE_TYPES = new RuleTypes();
const _HTTP_STATUSES = new HttpStatuses();
const _PROJECT_COOKIES = new ProjectCookies();
const _INPUT_TEXT_ELEMENT_CUSTOMER_COLLECTION_TITLE_UTILS = new InputTextElementCustomerCollectionTitleUtils();

export class InputTextWithRuleElementCustomerCollectionTitleAdd extends InputTextWithRuleElement {
    constructor(inputTextWithRuleElementObj) {
        super(inputTextWithRuleElementObj, inputTextWithRuleElementObj.getIsRequired());
    }


    async checkCorrectValue() {
        let isCorrect = await super.checkCorrectValue();
        if (isCorrect) {
            // Проводим общие проверки ---
            isCorrect = _INPUT_TEXT_ELEMENT_CUSTOMER_COLLECTION_TITLE_UTILS.checkCorrectValue(this);
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
                            let customerId = _PROJECT_COOKIES.CUSTOMER_ID.getValue();
                            let value = self.getValue();

                            let jsonResponse = await _CUSTOMER_COLLECTIONS_API.GET.isExistsByCustomerAndTitle(
                                customerId, value);
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