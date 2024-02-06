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
    customer;

    constructor(wordJson) {
        if (wordJson) {
            this.id = wordJson["id"];
            this.title = wordJson["title"];
            this.lang = new LangResponseDTO(wordJson["lang"]);
            this.customer = new CustomerResponseDTO(wordJson["customer"]);
        }
    }
}

export class WordRequestDTO {
    id;
    title;
    customerId;
    langCode;
}