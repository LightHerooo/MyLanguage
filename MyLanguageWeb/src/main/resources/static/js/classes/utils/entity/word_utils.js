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
    WordsWithStatusStatisticResponseDTO
} from "../../dto/types/words_with_status_statistic.js";

import {
    DateParts
} from "../../date_parts.js";

import {
    LongResponse
} from "../../dto/other/long_response.js";

import {
    CssDynamicInfoBlock
} from "../../css/info_blocks/css_dynamic_info_block.js";

import {
    GlobalCookies
} from "../../global_cookies.js";

const _WORDS_API = new WordsAPI();

const _CSS_DYNAMIC_INFO_BLOCK = new CssDynamicInfoBlock();

const _RULE_TYPES = new RuleTypes();
const _HTTP_STATUSES = new HttpStatuses();
const _GLOBAL_COOKIES = new GlobalCookies();

export class WordUtils {
    TB_WORD_TITLE = new TbWordTitle();

    async #createDivStatisticByAllLangs(JSONResponse) {
        let div;

        if (JSONResponse && JSONResponse.status === _HTTP_STATUSES.OK) {
            div = document.createElement("div");

            let sumOfWords = 0n;

            let json = JSONResponse.json;
            let statisticsByAllLangs = [];
            for (let i = 0; i < json.length; i++) {
                let wordsWithStatusStatistic = new WordsWithStatusStatisticResponseDTO(json[i]);
                let divStatistic = await wordsWithStatusStatistic.createDiv();
                if (divStatistic) {
                    statisticsByAllLangs.push(divStatistic);
                    sumOfWords += wordsWithStatusStatistic.numberOfWords;
                }
            }

            // Создаём контейнер с общим количеством слов ---
            let divDataRow = document.createElement("div");
            divDataRow.classList.add(_CSS_DYNAMIC_INFO_BLOCK.DIV_DYNAMIC_INFO_BLOCK_DATA_ROW_STYLE_ID);

            let spanInfoAboutData = document.createElement("span");
            spanInfoAboutData.classList.add(_CSS_DYNAMIC_INFO_BLOCK.SPAN_DATA_ROW_LEFT_TEXT_STYLE_ID);
            spanInfoAboutData.textContent = "Общее количество слов:";
            divDataRow.appendChild(spanInfoAboutData);

            let spanData = document.createElement("span");
            spanData.classList.add(_CSS_DYNAMIC_INFO_BLOCK.SPAN_DATA_ROW_RIGHT_TEXT_STYLE_ID);
            spanData.textContent = `${sumOfWords}`;
            divDataRow.appendChild(spanData);

            div.appendChild(divDataRow);
            //---

            // Заполняем статистику по каждому языку ---
            for (let i = 0; i < statisticsByAllLangs.length; i++) {
                div.appendChild(statisticsByAllLangs[i]);
            }
            //---

            div.appendChild(document.createElement("br"));
        }

        return div;
    }

    async createDivStatistic() {
        let JSONResponse = await _WORDS_API.GET.getWordsWithStatusStatistics();
        let div = await this.#createDivStatisticByAllLangs(JSONResponse);

        // Создаём контейнер с количеством слов за сегодняшний день ---
        let dateNow = new Date();
        JSONResponse = await _WORDS_API.GET.getCountByDateOfCreate(dateNow);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            if (!div) {
                div = document.createElement("div");
            }

            let divDataRow = document.createElement("div");
            divDataRow.classList.add(_CSS_DYNAMIC_INFO_BLOCK.DIV_DYNAMIC_INFO_BLOCK_DATA_ROW_STYLE_ID);

            let spanInfoAboutData = document.createElement("span");
            spanInfoAboutData.classList.add(_CSS_DYNAMIC_INFO_BLOCK.SPAN_DATA_ROW_LEFT_TEXT_STYLE_ID);
            spanInfoAboutData.textContent = `За сегодня (${new DateParts(dateNow).getDateStr()}) предложено слов:`;
            divDataRow.appendChild(spanInfoAboutData);

            let spanData = document.createElement("span");
            spanData.classList.add(_CSS_DYNAMIC_INFO_BLOCK.SPAN_DATA_ROW_RIGHT_TEXT_STYLE_ID);
            spanData.textContent = `${new LongResponse(JSONResponse.json).value}`;
            divDataRow.appendChild(spanData);

            div.appendChild(divDataRow);
            div.appendChild(document.createElement("br"));
        }
        //---

        return div;
    }

    async createDivStatisticForCustomer() {
        let authId = _GLOBAL_COOKIES.AUTH_ID.getValue();
        let JSONResponse = await _WORDS_API.GET.getWordsWithStatusStatisticsByCustomerId(authId);

        return await this.#createDivStatisticByAllLangs(JSONResponse);
    }
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
                wordRequestDTO.langCode = langCode;

                let JSONResponsePromise = new Promise(resolve => {
                    customTimerObj.setHandler(async function () {
                        resolve(await _WORDS_API.POST.validateBeforeAdd(wordRequestDTO));
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