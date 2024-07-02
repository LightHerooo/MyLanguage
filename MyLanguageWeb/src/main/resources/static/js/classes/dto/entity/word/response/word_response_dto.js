import {
    CustomerResponseDTO
} from "../../customer/response/customer_response_dto.js";

import {
    LangResponseDTO
} from "../../lang/response/lang_response_dto.js";

export class WordResponseDTO {
    #id;
    #title;
    #lang;
    #customer;

    constructor(json) {
        if (json) {
            this.#id = json["id"];
            this.#title = json["title"];

            let lang = json["lang"];
            if (lang) {
                this.#lang = new LangResponseDTO(lang);
            }

            let customer = json["customer"];
            if (customer) {
                this.#customer = new CustomerResponseDTO(customer);
            }
        }
    }

    getId() {
        return this.#id;
    }

    getTitle() {
        return this.#title;
    }

    getLang() {
        return this.#lang;
    }

    getCustomer() {
        return this.#customer;
    }
}