import {
    RuleElement
} from "../../rule/rule_element.js";

import {
    RuleTypes
} from "../../rule/rule_types.js";

import {
    CustomResponseMessage
} from "../../dto/other/custom_response_message.js";

import {
    HttpStatuses
} from "../../http_statuses.js";

import {
    WordRequestDTO
} from "../../dto/entity/word.js";

import {
    WordsAPI
} from "../../api/words_api.js";

import {
    GlobalCookies
} from "../../global_cookies.js";

const _WORDS_API = new WordsAPI();

const _RULE_TYPES = new RuleTypes();
const _HTTP_STATUSES = new HttpStatuses();
const _GLOBAL_COOKIES = new GlobalCookies();

export class WordUtils {
    TB_WORD_TITLE = new TbWordTitle();
}

class TbWordTitle {
    async checkCorrectValue(tbTitle, langCode, customTimerObj){
        let isCorrect = true;
        if (tbTitle) {
            const TITLE_MAX_SIZE = 44;
            const TITLE_REGEXP = /^[^ ]+$/;

            let ruleElement = new RuleElement(tbTitle, tbTitle.parentElement);

            customTimerObj.stop();
            let inputText = tbTitle.value.trim();
            if (!inputText) {
                isCorrect = false;
                ruleElement.message = "Слово не может быть пустым.";
                ruleElement.ruleType = _RULE_TYPES.ERROR;
            } else if (!TITLE_REGEXP.test(inputText)) {
                isCorrect = false;
                ruleElement.message = "Слово не должно содержать пробелов.";
                ruleElement.ruleType = _RULE_TYPES.ERROR;
            } else if (inputText.length > TITLE_MAX_SIZE) {
                isCorrect = false;
                ruleElement.message = `Слово должно быть не более ${TITLE_MAX_SIZE} символов.`;
                ruleElement.ruleType = _RULE_TYPES.ERROR;
            } else {
                ruleElement.removeRule();

                let wordRequestDTO = new WordRequestDTO();
                wordRequestDTO.title = tbTitle.value;
                wordRequestDTO.customerId = BigInt(_GLOBAL_COOKIES.AUTH_ID.getValue());
                wordRequestDTO.langCode = langCode;

                let JSONResponsePromise = new Promise(resolve => {
                    customTimerObj.setHandler(async function () {
                        resolve(await _WORDS_API.POST.validateBeforeCrud(wordRequestDTO));
                    });

                    customTimerObj.setTimeout(250);
                    customTimerObj.start();
                });

                let JSONResponse = await JSONResponsePromise;
                if (JSONResponse.status !== _HTTP_STATUSES.OK) {
                    isCorrect = false;
                    ruleElement.message = new CustomResponseMessage(JSONResponse.json).text;
                    ruleElement.ruleType = _RULE_TYPES.ERROR;
                }
            }

            // Отображаем предупреждение (правило), если это необходимо ---
            if (isCorrect === false) {
                ruleElement.showRule();
            } else {
                ruleElement.removeRule();
            }
            //---
        } else {
            isCorrect = false;
        }

        return isCorrect;
    }
}