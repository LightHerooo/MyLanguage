import {
    WordStatusesAPI
} from "../../api/word_statuses_api.js";

import {
    HttpStatuses
} from "../../http_statuses.js";

import {
    WordStatusResponseDTO
} from "../entity/word_status/word_status.js";

const _WORD_STATUSES_API = new WordStatusesAPI();

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
            //---

            // Добавляем название статуса слова в контейнер ---
            div.appendChild(wordStatus.createA());
            //---

            // Создаём span количества ---
            let spanNumberOfWords = document.createElement("span");
            spanNumberOfWords.textContent = `: ${this.numberOfWords}`;
            div.appendChild(spanNumberOfWords);
            //---
        }

        return div;
    }
}