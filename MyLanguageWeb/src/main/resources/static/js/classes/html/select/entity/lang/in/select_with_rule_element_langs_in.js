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
} from "../../../with_flag/abstracts/select_with_flag_and_rule_abstract_element.js";

const _LANGS_API = new LangsAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _RULE_TYPES = new RuleTypes();
const _SELECT_ELEMENT_LANGS_UTILS = new SelectElementLangsUtils();

export class SelectWithRuleElementLangsIn extends SelectWithFlagAndRuleAbstractElement {

    constructor(divContainer, select, spanFlag, doNeedToCreateFirstOption) {
        super(divContainer, select, spanFlag, doNeedToCreateFirstOption);
    }

    async createFirstOption() {
        let option = document.createElement("option");
        option.value = "";
        option.textContent = "Выберите язык";

        return option;
    }

    async createOptionsArr() {
        return await _SELECT_ELEMENT_LANGS_UTILS.createOptionsArrForIn();
    }

    async changeFlag() {
        await _SELECT_ELEMENT_LANGS_UTILS.changeFlag(this);
    }


    async checkCorrectValue() {
        let isCorrect = false;
        let isPrepared = this.getIsPrepared();
        if (isPrepared) {
            isCorrect = true;
            let ruleType;
            let message;

            let langCode = this.getSelectedValue();
            if (!langCode) {
                isCorrect = false;
                ruleType = _RULE_TYPES.ERROR;
                message = "Выберите язык.";
            }

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

            // Язык должен быть активен на вход ---
            if (isCorrect) {
                let jsonResponse = await _LANGS_API.GET.validateIsActiveForIn(langCode);
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
            throw new Error("Object \'SelectWithRuleElementLangsIn\' is not prepared.");
        }

        return isCorrect;
    }
}