import {
    PartOfSpeechResponseDTO
} from "./part_of_speech.js";

import {
    LangResponseDTO
} from "./lang.js";

import {
    CustomerResponseDTO
} from "./customer.js";

export class WordResponseDTO {
    id;
    title;
    lang;
    partOfSpeech;
    customer;

    constructor(wordJson) {
        if (wordJson) {
            this.id = wordJson["id"];
            this.title = wordJson["title"];
            this.partOfSpeech = new PartOfSpeechResponseDTO(wordJson["part_of_speech"]);
            this.lang = new LangResponseDTO(wordJson["lang"]);
            this.customer = new CustomerResponseDTO(wordJson["customer"]);
        }
    }
}

export class WordRequestDTO {
    id;
    title;
    langCode;
    partOfSpeechCode;

    constructor(title, langCode, partOfSpeechCode) {
        this.title = title;
        this.langCode = langCode;
        this.partOfSpeechCode = partOfSpeechCode;
    }
}