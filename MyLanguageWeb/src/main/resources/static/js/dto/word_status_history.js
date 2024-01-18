import {
    WordResponseDTO
} from "./word.js";

import {
    WordStatusResponseDTO
} from "./word_status.js";

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
            this.word = new WordResponseDTO(wordStatusHistoryJson["word"]);
            this.wordStatus = new WordStatusResponseDTO(wordStatusHistoryJson["word_status"]);
        }
    }
}