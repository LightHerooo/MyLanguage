import {
    WordStatusResponseDTO
} from "../../word_status/response/word_status_response_dto.js";

export class WordsStatisticResponseDTO {
    #numberOfWords;
    #wordStatus;

    constructor(json) {
        if (json) {
            this.#numberOfWords = json["number_of_words"];

            let wordStatus = json["word_status"];
            if (wordStatus) {
                this.#wordStatus = new WordStatusResponseDTO(wordStatus);
            }
        }
    }

    getNumberOfWords() {
        return this.#numberOfWords;
    }

    getWordStatus() {
        return this.#wordStatus;
    }
}