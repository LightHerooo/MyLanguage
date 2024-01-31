import {
    RuleElement,
    RuleTypes
} from "../../rule_element.js";

import {
    CustomResponseMessage
} from "../../dto/other/custom_response_message.js";

import {
    HttpStatuses
} from "../../http_statuses.js";

import {
    WordRequestDTO
} from "../../dto/word.js";

import {
    WordsAPI
} from "../../api/words_api.js";

const _WORDS_API = new WordsAPI();

const _RULE_TYPES = new RuleTypes();
const _HTTP_STATUSES = new HttpStatuses();

export class WordUtils {
    async checkCorrectValueInTbTitle(tbTitle, parentElement, langCode, partOfSpeechCode, customTimerObj) {
        let isCorrect = true;
        if (tbTitle && parentElement) {
            const TITLE_MAX_SIZE = 44;
            const TITLE_REGEXP = /^[^ ]+$/;

            let ruleElement = new RuleElement(tbTitle.parentNode.id);
            let message;
            let ruleType;

            let inputText = tbTitle.value.trim();
            if (!inputText) {
                isCorrect = false;
                message = "Слово не может быть пустым.";
                ruleType = _RULE_TYPES.ERROR;
            } else if (!TITLE_REGEXP.test(inputText)) {
                isCorrect = false;
                message = "Слово не должно содержать пробелов.";
                ruleType = _RULE_TYPES.ERROR;
            } else if (inputText.length > TITLE_MAX_SIZE) {
                isCorrect = false;
                message = `Слово должно быть не более ${TITLE_MAX_SIZE} символов.`;
                ruleType = _RULE_TYPES.ERROR;
            } else {
                ruleElement.removeDiv();

                let wordRequestDTO = new WordRequestDTO();
                wordRequestDTO.title = tbTitle.value;
                wordRequestDTO.langCode = langCode;
                wordRequestDTO.partOfSpeechCode = partOfSpeechCode;

                let JSONResponsePromise = new Promise(resolve => {
                    customTimerObj.handler = async function () {
                        resolve(await _WORDS_API.POST.validateBeforeCrud(wordRequestDTO));
                    };

                    customTimerObj.timeout = 250;
                    customTimerObj.start();
                });

                let JSONResponse = await JSONResponsePromise;
                if (JSONResponse.status !== _HTTP_STATUSES.OK) {
                    isCorrect = false;
                    message = new CustomResponseMessage(JSONResponse.json).text;
                    ruleType = _RULE_TYPES.ERROR;
                }
            }

            // Отображаем предупреждение (правило), если это необходимо ---
            if (isCorrect === false) {
                ruleElement.createOrChangeDiv(message, ruleType);
            } else {
                ruleElement.removeDiv();
            }
            //---
        } else {
            isCorrect = false;
        }

        return isCorrect;
    }
}