import {
    CustomerResponseDTO
} from "./customer.js";

import {
    LangResponseDTO
} from "./lang.js";

export class CustomerCollectionResponseDTO {
    id;
    title;
    dateOfCreate;
    customer;
    lang;
    key;

    constructor(customerCollectionJson) {
        if (customerCollectionJson) {
            this.id = customerCollectionJson["id"];
            this.title = customerCollectionJson["title"];
            this.dateOfCreate = customerCollectionJson["date_of_create"];
            this.customer = new CustomerResponseDTO(customerCollectionJson["customer"]);
            this.key = customerCollectionJson["key"];
            this.lang = new LangResponseDTO(customerCollectionJson["lang"]);
        }
    }
}

export class CustomerCollectionRequestDTO {
    title;
    langCode;

    constructor(title, langCode) {
        this.title = title;
        this.langCode = langCode;
    }
}