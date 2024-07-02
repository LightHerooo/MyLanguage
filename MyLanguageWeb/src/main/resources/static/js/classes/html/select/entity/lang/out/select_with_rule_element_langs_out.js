import {
    SelectElementLangsUtils
} from "../select_element_langs_utils.js";

import {
    ResponseMessageResponseDTO
} from "../../../../../dto/other/response/response_message_response_dto.js";

import {
    LangsAPI
} from "../../../../../api/entity/langs_api.js";

import {
    HttpStatuses
} from "../../../../../api/classes/http/http_statuses.js";

import {
    RuleTypes
} from "../../../../span/elements/rule/rule_types.js";

import {
    SelectWithFlagAndRuleAbstractElement
} from "../../../abstracts/with_flag/select_with_flag_and_rule_abstract_element.js";

const _LANGS_API = new LangsAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _RULE_TYPES = new RuleTypes();
const _SELECT_ELEMENT_LANGS_UTILS = new SelectElementLangsUtils();

export class SelectWithRuleElementLangsOut extends SelectWithFlagAndRuleAbstractElement {

    constructor(divContainer, select, spanFlag, doNeedToCreateFirstOption, isRequired) {
        super(divContainer, select, spanFlag, doNeedToCreateFirstOption, isRequired);
    }

    async createFirstOption() {
        let option = document.createElement("option");
        option.value = "";
        option.textContent = "Выберите язык";

        return option;
    }

    async createOptionsArr() {
        return await _SELECT_ELEMENT_LANGS_UTILS.createOptionsArrForOut();
    }

    async changeFlag() {
        await _SELECT_ELEMENT_LANGS_UTILS.changeFlag(this);
    }


    async checkCorrectValue() {
        let isCorrect = await super.checkCorrectValue();
        if (isCorrect) {
            let ruleType;
            let message;

            let langCode = this.getSelectedValue();

            // Ищем язык ---
            if (isCorrect) {
                let jsonResponse = await _LANGS_API.GET.findByCode(langCode);
                if (jsonResponse.getStatus() !== _HTTP_STATUSES.OK) {
                    isCorrect = false;
                    ruleType = _RULE_TYPES.ERROR;
                    message = new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage();
                }
            }
            //---

            // Язык должен быть активен на выход ---
            if (isCorrect) {
                let jsonResponse = await _LANGS_API.GET.validateIsActiveForOut(langCode);
                if (jsonResponse.getStatus() !== _HTTP_STATUSES.OK) {
                    isCorrect = false;
                    ruleType = _RULE_TYPES.ERROR;
                    message = new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage();
                } else {
                    isCorrect = true;
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