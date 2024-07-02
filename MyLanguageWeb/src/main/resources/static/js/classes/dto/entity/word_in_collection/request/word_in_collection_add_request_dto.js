export class WordInCollectionAddRequestDTO {
    #id;
    #wordId;
    #customerCollectionId;

    getId() {
        return this.#id;
    }

    setId(id) {
        this.#id = id;
    }

    getWordId() {
        return this.#wordId;
    }

    setWordId(wordId) {
        this.#wordId = wordId;
    }

    getCustomerCollectionId() {
        return this.#customerCollectionId;
    }

    setCustomerCollectionId(customerCollectionId) {
        this.#customerCollectionId = customerCollectionId;
    }
}