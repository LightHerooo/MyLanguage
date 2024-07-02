import {
    CustomerCollectionResponseDTO
} from "../../customer_collection/response/customer_collection_response_dto.js";

import {
    WordResponseDTO
} from "../../word/response/word_response_dto.js";

export class WordInCollectionResponseDTO {
    #id;
    #dateOfAdditional;
    #customerCollection;
    #word;

    constructor(json) {
        if (json) {
            this.#id = json["id"];

            let dateOfAdditional = json["date_of_additional"];
            if (dateOfAdditional) {
                this.#dateOfAdditional = new Date(dateOfAdditional);
            }

            let customerCollection = json["customer_collection"];
            if (customerCollection) {
                this.#customerCollection = new CustomerCollectionResponseDTO(customerCollection);
            }

            let word = json["word"];
            if (word) {
                this.#word = new WordResponseDTO(word);
            }
        }
    }

    getId() {
        return this.#id;
    }

    getDateOfAdditional() {
        return this.#dateOfAdditional;
    }

    getCustomerCollection() {
        return this.#customerCollection;
    }

    getWord() {
        return this.#word;
    }
}