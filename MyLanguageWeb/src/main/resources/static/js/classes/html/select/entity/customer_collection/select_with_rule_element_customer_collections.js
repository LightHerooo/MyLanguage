import {
    SelectElementCustomerCollectionsUtils
} from "./select_element_customer_collections_utils.js";

import {
    ResponseMessageResponseDTO
} from "../../../../dto/other/response/response_message_response_dto.js";

import {
    CustomerCollectionsAPI
} from "../../../../api/entity/customer_collections_api.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    RuleTypes
} from "../../../span/elements/rule/rule_types.js";

import {
    SelectWithFlagAndRuleAbstractElement
} from "../../abstracts/with_flag/select_with_flag_and_rule_abstract_element.js";

import {
    ProjectCookies
} from "../../../project_cookies.js";

const _CUSTOMER_COLLECTIONS_API = new CustomerCollectionsAPI();

const _RULE_TYPES = new RuleTypes();
const _HTTP_STATUSES = new HttpStatuses();
const _PROJECT_COOKIES = new ProjectCookies();
const _SELECT_WITH_FLAG_ELEMENT_CUSTOMER_COLLECTIONS_UTILS =
    new SelectElementCustomerCollectionsUtils();

export class SelectWithRuleElementCustomerCollections extends SelectWithFlagAndRuleAbstractElement {

    constructor(divContainer, select, spanFlag, doNeedToCreateFirstOption, isRequired) {
        super(divContainer, select, spanFlag, doNeedToCreateFirstOption, isRequired);
    }

    getSelectedValue() {
        return _SELECT_WITH_FLAG_ELEMENT_CUSTOMER_COLLECTIONS_UTILS.getSelectedValue(this);
    }

    async createFirstOption() {
        let option = document.createElement("option");
        option.value = "";
        option.textContent = "Выберите коллекцию";

        return option;
    }

    async createOptionsArr() {
        return await _SELECT_WITH_FLAG_ELEMENT_CUSTOMER_COLLECTIONS_UTILS.createOptionsArr();
    }

    async changeFlag() {
        await _SELECT_WITH_FLAG_ELEMENT_CUSTOMER_COLLECTIONS_UTILS.changeFlag(this);
    }


    async checkCorrectValue() {
        let isCorrect = await super.checkCorrectValue();
        if (isCorrect) {
            let ruleType;
            let message;

            let customerCollectionId = this.getSelectedValue();

            // Ищем коллекцию ---
            if (isCorrect) {
                let jsonResponse = await _CUSTOMER_COLLECTIONS_API.GET.findById(customerCollectionId);
                if (jsonResponse.getStatus() !== _HTTP_STATUSES.OK) {
                    isCorrect = false;
                    ruleType = _RULE_TYPES.ERROR;
                    message = new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage();
                }
            }
            //---

            // Проверяем принадлежность пользователя к искомой коллекции ---
            if (isCorrect) {
                let customerId = _PROJECT_COOKIES.CUSTOMER_ID.getValue();
                let jsonResponse = await _CUSTOMER_COLLECTIONS_API.GET.validateIsAuthor(customerId, customerCollectionId);
                if (jsonResponse.getStatus() !== _HTTP_STATUSES.OK) {
                    isCorrect = false;
                    ruleType = _RULE_TYPES.ERROR;
                    message = new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage();
                }
            }
            //---

            // Проверяем активность языка у искомой коллекции ---
            if (isCorrect) {
                let jsonResponse = await _CUSTOMER_COLLECTIONS_API.GET.validateIsLangActive(customerCollectionId);
                if (jsonResponse.getStatus() !== _HTTP_STATUSES.OK) {
                    isCorrect = false;
                    ruleType = _RULE_TYPES.ERROR;
                    message = new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage();
                }
            }
            //---

            // Проверяем активность коллекции для автора ---
            if (isCorrect) {
                let jsonResponse = await _CUSTOMER_COLLECTIONS_API.GET.validateIsActiveForAuthor(customerCollectionId);
                if (jsonResponse.getStatus() !== _HTTP_STATUSES.OK) {
                    isCorrect = false;
                    ruleType = _RULE_TYPES.ERROR;
                    message = new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage();
                }
            }
            //---

            if (!isCorrect) {
                this.showRule(ruleType, message);
            } else {
                this.hideRule();
            }
        }

        return isCorrect;
    }
}