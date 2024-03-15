import {
    CustomerCollectionResponseDTO
} from "./customer_collection.js";

import {
    WordResponseDTO
} from "./word.js";

export class WordInCollectionResponseDTO {
    id;
    dateOfAdditional;
    customerCollection;
    word;

    constructor(wordInCollectionJson) {
        if (wordInCollectionJson) {
            this.id = wordInCollectionJson["id"];
            this.dateOfAdditional = wordInCollectionJson["date_of_additional"];

            let customerCollection = wordInCollectionJson["customer_collection"];
            if (customerCollection) {
                this.customerCollection = new CustomerCollectionResponseDTO(customerCollection);
            }

            let word = wordInCollectionJson["word"];
            if (word) {
                this.word = new WordResponseDTO(word);
            }
        }
    }
}

export class WordInCollectionRequestDTO {
    id;
    wordId;
    collectionId;
}