import {
    CountriesAPI
} from "../../../../api/entity/countries_api.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    ResponseMessageResponseDTO
} from "../../../../dto/other/response/response_message_response_dto.js";

import {
    SelectElementCountriesUtils
} from "./select_element_countries_utils.js";

import {
    RuleTypes
} from "../../../span/elements/rule/rule_types.js";

import {
    SelectWithFlagAndRuleAbstractElement
} from "../../with_flag/abstracts/select_with_flag_and_rule_abstract_element.js";


const _COUNTRIES_API = new CountriesAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _RULE_TYPES = new RuleTypes();
const _SELECT_ELEMENT_COUNTRIES_UTILS = new SelectElementCountriesUtils();

export class SelectWithRuleElementCountries extends SelectWithFlagAndRuleAbstractElement {

    constructor(divContainer, select, spanFlag, doNeedToCreateFirstOption) {
        super(divContainer, select, spanFlag, doNeedToCreateFirstOption);
    }

    async createFirstOption() {
        let option = document.createElement("option");
        option.value = "";
        option.textContent = "Выберите страну";

        return option;
    }

    async createOptionsArr() {
        return await _SELECT_ELEMENT_COUNTRIES_UTILS.createOptionsArr();
    }

    async changeFlag() {
        await _SELECT_ELEMENT_COUNTRIES_UTILS.changeFlag(this);
    }


    async checkCorrectValue(){
        let isCorrect = false;
        let isPrepared = this.getIsPrepared();
        if (isPrepared) {
            isCorrect = true;
            let ruleType;
            let message;

            let countryCode = this.getSelectedValue();
            if (!countryCode) {
                isCorrect = false;
                ruleType = _RULE_TYPES.ERROR;
                message = "Выберите страну";
            }

            // Ищем страну ---
            if (isCorrect) {
                let jsonResponse = await _COUNTRIES_API.GET.findByCode(countryCode);
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
        } else {
            throw new Error("Object \'SelectWithRuleElementCountries\' is not prepared.");
        }

        return isCorrect;
    }
}