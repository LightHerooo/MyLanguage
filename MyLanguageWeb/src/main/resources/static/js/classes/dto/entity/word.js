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

            let lang = wordJson["lang"];
            if (lang) {
                this.lang = new LangResponseDTO(lang);
            }

            let customer = wordJson["customer"];
            if (customer) {
                this.customer = new CustomerResponseDTO(customer);
            }
        }
    }
}

export class WordRequestDTO {
    id;
    title;
    customerId;
    langCode;
}