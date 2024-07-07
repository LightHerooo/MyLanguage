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
    CustomerCollectionResponseDTO
} from "../../../../../../dto/entity/customer_collection/response/customer_collection_response_dto.js";

const _CUSTOMER_COLLECTIONS_API = new CustomerCollectionsAPI();

const _RULE_TYPES = new RuleTypes();
const _HTTP_STATUSES = new HttpStatuses();
const _INPUT_TEXT_ELEMENT_CUSTOMER_COLLECTION_TITLE_UTILS = new InputTextElementCustomerCollectionTitleUtils();

export class InputTextWithRuleElementCustomerCollectionTitleEdit extends InputTextWithRuleElement {
    #customerCollectionResponseDTO;

    constructor(inputTextWithRuleElementObj) {
        super(inputTextWithRuleElementObj, inputTextWithRuleElementObj.getIsRequired());
    }

    setCustomerCollectionResponseDTO(customerCollectionResponseDTOObj) {
        this.#customerCollectionResponseDTO = customerCollectionResponseDTOObj;
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
                            let value = self.getValue();

                            let customerCollectionResponseDTO = self.#customerCollectionResponseDTO;
                            if (customerCollectionResponseDTO) {
                                let customer = customerCollectionResponseDTO.getCustomer();
                                if (customer) {
                                    let jsonResponse = await _CUSTOMER_COLLECTIONS_API.GET.isExistsByCustomerAndTitle(
                                        customer.getId(), value);
                                    if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                                        isCorrect = false;
                                        ruleType = _RULE_TYPES.ERROR;
                                        message = new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage();

                                        // Сравниваем название изменяемой коллекции с найденной ---
                                        jsonResponse = await _CUSTOMER_COLLECTIONS_API.GET.findByCustomerAndTitle(
                                            customer.getId(), value);
                                        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                                            let foundCustomerCollection =
                                                new CustomerCollectionResponseDTO(jsonResponse.getJson());
                                            if (customerCollectionResponseDTO.getId() === foundCustomerCollection.getId()) {
                                                isCorrect = true;
                                            }
                                        }
                                        //---
                                    }
                                }
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