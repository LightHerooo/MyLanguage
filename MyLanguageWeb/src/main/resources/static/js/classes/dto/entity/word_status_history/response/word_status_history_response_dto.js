import {
    WordResponseDTO
} from "../../word/response/word_response_dto.js";

import {
    WordStatusResponseDTO
} from "../../word_status/response/word_status_response_dto.js";

export class WordStatusHistoryResponseDTO {
    #id;
    #dateOfStart;
    #dateOfEnd;
    #word;
    #wordStatus;

    constructor(json) {
        if (json) {
            this.#id = json["id"];

            let dateOfStart = json["date_of_start"];
            if (dateOfStart) {
                this.#dateOfStart = new Date(dateOfStart);
            }

            let dateOfEnd = json["date_of_end"];
            if (dateOfEnd) {
                this.#dateOfEnd = new Date(dateOfEnd);
            }

            let word = json["word"];
            if (word) {
                this.#word = new WordResponseDTO(word);
            }

            let wordStatus = json["word_status"];
            if (wordStatus) {
                this.#wordStatus = new WordStatusResponseDTO(wordStatus);
            }
        }
    }

    getId() {
        return this.#id;
    }

    getDateOfStart() {
        return this.#dateOfStart;
    }

    getDateOfEnd() {
        return this.#dateOfEnd;
    }

    getWord() {
        return this.#word;
    }

    getWordStatus() {
        return this.#wordStatus;
    }
}