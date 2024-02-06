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
            this.customerCollection = new CustomerCollectionResponseDTO(wordInCollectionJson["customer_collection"]);
            this.word = new WordResponseDTO(wordInCollectionJson["word"]);
        }
    }
}

export class WordInCollectionRequestDTO {
    id;
    wordId;
    collectionKey;
}