import {
    CustomerResponseDTO
} from "../../customer/response/customer_response_dto.js";

import {
    LangResponseDTO
} from "../../lang/response/lang_response_dto.js";

export class CustomerCollectionResponseDTO {
    #id;
    #title;
    #numberOfWords;
    #isActiveForAuthor;
    #dateOfCreate;
    #customer;
    #lang;

    constructor(json) {
        if (json) {
            this.#id = json["id"];
            this.#title = json["title"];
            this.#numberOfWords = json["number_of_words"];
            this.#isActiveForAuthor = json["is_active_for_author"];

            let dateOfCreate = json["date_of_create"];
            if (dateOfCreate) {
                this.#dateOfCreate = new Date(dateOfCreate);
            }

            let customer = json["customer"];
            if (customer) {
                this.#customer = new CustomerResponseDTO(customer);
            }

            let lang = json["lang"];
            if (lang) {
                this.#lang = new LangResponseDTO(lang);
            }
        }
    }

    getId() {
        return this.#id;
    }

    getTitle() {
        return this.#title;
    }

    getDateOfCreate() {
        return this.#dateOfCreate;
    }

    getNumberOfWords() {
        return this.#numberOfWords;
    }

    getIsActiveForAuthor() {
        return this.#isActiveForAuthor;
    }

    getCustomer() {
        return this.#customer;
    }

    getLang() {
        return this.#lang;
    }
}