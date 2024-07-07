import {
    InputTextWithRuleElement
} from "../../input_text_with_rule_element.js";

import {
    RuleTypes
} from "../../../../span/elements/rule/rule_types.js";

import {
    WordsAPI
} from "../../../../../api/entity/words_api.js";

import {
    HttpStatuses
} from "../../../../../api/classes/http/http_statuses.js";

import {
    ResponseMessageResponseDTO
} from "../../../../../dto/other/response/response_message_response_dto.js";

import {
    WordAddRequestDTO
} from "../../../../../dto/entity/word/request/word_add_request_dto.js";

import {
    EventNames
} from "../../../../event_names.js";

const _WORDS_API = new WordsAPI();

const _RULE_TYPES = new RuleTypes();
const _HTTP_STATUSES = new HttpStatuses();
const _EVENT_NAMES = new EventNames();

export class InputTextWithRuleElementWordTitle extends InputTextWithRuleElement {
    #selectElementLangsIn;

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
            let ruleType;
            let message;

            let value = this.getValue();
            const TITLE_REGEXP = /^[^ ]+$/;
            if (!TITLE_REGEXP.test(value)) {
                isCorrect = false;
                ruleType = _RULE_TYPES.ERROR;
                message = "Слово не должно содержать пробелов";
            }

            if (isCorrect) {
                const TITLE_MAX_SIZE = 44;
                if (value.length > TITLE_MAX_SIZE) {
                    isCorrect = false;
                    ruleType = _RULE_TYPES.ERROR;
                    message = `Слово должно быть не более ${TITLE_MAX_SIZE} символов.`;
                }
            }

            if (isCorrect) {
                this.hideRule();

                let self = this;
                let customTimerCheckerPromise = new Promise(resolve => {
                    let customTimerChecker = self.getCustomTimerChecker();
                    if (customTimerChecker) {
                        customTimerChecker.setHandler(async function() {
                            let wordAddRequestDTO = new WordAddRequestDTO();
                            wordAddRequestDTO.setTitle(value);

                            let selectElementLangsIn = self.#selectElementLangsIn;
                            if (selectElementLangsIn) {
                                wordAddRequestDTO.setLangCode(selectElementLangsIn.getSelectedValue());
                            }

                            let jsonResponse = await _WORDS_API.POST.validateBeforeAdd(wordAddRequestDTO);
                            if (jsonResponse.getStatus() !== _HTTP_STATUSES.OK) {
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