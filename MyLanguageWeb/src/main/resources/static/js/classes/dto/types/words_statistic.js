import {
    WordStatusResponseDTO
} from "../entity/word_status/word_status.js";

import {
    CssDynamicInfoBlock
} from "../../css/info_blocks/css_dynamic_info_block.js";

const _CSS_DYNAMIC_INFO_BLOCK = new CssDynamicInfoBlock();

export class WordsStatisticResponseDTO {
    numberOfWords;
    wordStatus;

    constructor(wordsWithStatusStatisticJson) {
        this.numberOfWords = wordsWithStatusStatisticJson["number_of_words"];

        let wordStatus = wordsWithStatusStatisticJson["word_status"];
        if (wordStatus) {
            this.wordStatus = new WordStatusResponseDTO(wordStatus);
        }
    }

    async createDiv() {
        let div;

        if (this.wordStatus) {
            // Создаём основной контейнер ---
            div = document.createElement("div");
            div.classList.add(_CSS_DYNAMIC_INFO_BLOCK.DIV_DYNAMIC_INFO_BLOCK_DATA_ROW_STYLE_ID);
            //---

            // Добавляем название статуса слова в контейнер ---
            let spanInfoAboutData = document.createElement("span");
            spanInfoAboutData.classList.add(_CSS_DYNAMIC_INFO_BLOCK.SPAN_DATA_ROW_LEFT_TEXT_STYLE_ID);

            let aWordStatus = this.wordStatus.createA();
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