import {
    WordResponseDTO
} from "./word.js";

import {
    WordStatusResponseDTO
} from "./word_status/word_status.js";

export class WordStatusHistoryResponseDTO {
    id;
    dateOfStart;
    dateOfEnd;
    word;
    wordStatus;

    constructor(wordStatusHistoryJson) {
        if (wordStatusHistoryJson) {
            this.id = wordStatusHistoryJson["id"];
            this.dateOfStart = wordStatusHistoryJson["date_of_start"];
            this.dateOfEnd = wordStatusHistoryJson["date_of_end"];

            let word = wordStatusHistoryJson["word"];
            if (word) {
                this.word = new WordResponseDTO(word);
            }

            let wordStatus = wordStatusHistoryJson["word_status"];
            if (wordStatus) {
                this.wordStatus = new WordStatusResponseDTO(wordStatus);
            }
        }
    }
}

export class WordStatusHistoryRequestDTO {
    id;
    wordId;
    wordStatusCode;

    constructor(id, wordId, wordStatusCode) {
        this.id = id;
        this.wordId = wordId;
        this.wordStatusCode = wordStatusCode;
    }
}