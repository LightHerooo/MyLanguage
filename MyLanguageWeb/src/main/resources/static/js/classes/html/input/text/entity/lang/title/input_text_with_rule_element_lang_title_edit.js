import {
    InputTextWithRuleElement
} from "../../../input_text_with_rule_element.js";

import {
    LangsAPI
} from "../../../../../../api/entity/langs_api.js";

import {
    HttpStatuses
} from "../../../../../../api/classes/http/http_statuses.js";

import {
    RuleTypes
} from "../../../../../span/elements/rule/rule_types.js";

import {
    ResponseMessageResponseDTO
} from "../../../../../../dto/other/response/response_message_response_dto.js";

import {
    LangResponseDTO
} from "../../../../../../dto/entity/lang/response/lang_response_dto.js";

const _LANGS_API = new LangsAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _RULE_TYPES = new RuleTypes();

export class InputTextWithRuleElementLangTitleEdit extends InputTextWithRuleElement {
    #langCode;

    constructor(inputTexWithRuleElementObj) {
        super(inputTexWithRuleElementObj, inputTexWithRuleElementObj.getIsRequired());
    }

    setLangCode(langCode) {
        this.#langCode = langCode;
    }

    async checkCorrectValue() {
        let isCorrect = await super.checkCorrectValue();
        if (isCorrect) {
            let ruleType;
            let message;

            let value = this.getValue();

            this.hideRule();

            let self = this;
            let customTimerCheckerPromise = new Promise(resolve => {
                let customTimerChecker = self.getCustomTimerChecker();
                if (customTimerChecker) {
                    customTimerChecker.setHandler(async function() {
                        let jsonResponse = await _LANGS_API.GET.isExistsByTitle(value);
                        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                            isCorrect = false;
                            ruleType = _RULE_TYPES.ERROR;
                            message = new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage();

                            // Сравниваем найденный язык с изменяемым ---
                            let langCode = self.#langCode;
                            if (langCode) {
                                jsonResponse = await _LANGS_API.GET.findByTitle(value);
                                if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                                    let langResponseDTO = new LangResponseDTO(jsonResponse.getJson());
                                    if (langResponseDTO.getCode() === langCode) {
                                        isCorrect = true;
                                    }
                                }
                            }

                            //---
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

        return isCorrect;
    }
}