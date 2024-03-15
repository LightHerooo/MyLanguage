import {
    WordStatusesAPI
} from "../../api/word_statuses_api.js";

import {
    HttpStatuses
} from "../../http_statuses.js";

import {
    WordStatusResponseDTO
} from "../entity/word_status/word_status.js";

import {
    CssDynamicInfoBlock
} from "../../css/info_blocks/css_dynamic_info_block.js";

const _WORD_STATUSES_API = new WordStatusesAPI();

const _CSS_DYNAMIC_INFO_BLOCK = new CssDynamicInfoBlock();

const _HTTP_STATUSES = new HttpStatuses();

export class WordsWithStatusStatisticResponseDTO {
    wordStatusCode;
    numberOfWords;

    constructor(wordsWithStatusStatisticJson) {
        this.wordStatusCode = wordsWithStatusStatisticJson["word_status_code"];
        this.numberOfWords = wordsWithStatusStatisticJson["number_of_words"];
    }

    async createDiv() {
        let div;

        let JSONResponse = await _WORD_STATUSES_API.GET.findByCode(this.wordStatusCode);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            let wordStatus = new WordStatusResponseDTO(JSONResponse.json);

            // Создаём основной контейнер ---
            div = document.createElement("div");
            div.classList.add(_CSS_DYNAMIC_INFO_BLOCK.DIV_DYNAMIC_INFO_BLOCK_DATA_ROW_STYLE_ID);
            //---

            // Добавляем название статуса слова в контейнер ---
            let spanInfoAboutData = document.createElement("span");
            spanInfoAboutData.classList.add(_CSS_DYNAMIC_INFO_BLOCK.SPAN_DATA_ROW_LEFT_TEXT_STYLE_ID);

            let aWordStatus = wordStatus.createA();
            aWordStatus.textContent += ":";
            spanInfoAboutData.appendChild(aWordStatus);

            div.appendChild(spanInfoAboutData);
            //---

            // Создаём span количества ---
            let spanData = document.createElement("span");
            spanData.classList.add(_CSS_DYNAMIC_INFO_BLOCK.SPAN_DATA_ROW_RIGHT_TEXT_STYLE_ID);
            spanData.textContent = `${this.numberOfWords}`;

            div.appendChild(spanData);
            //---
        }

        return div;
    }
}