export class CustomerCollectionEditRequestDTO {
    #id;
    #title;
    #isActiveForAuthor;
    #description;
    #doNeedToDeleteAllWords;
    #excludedWordInCollectionIdsArr;

    getId() {
        return this.#id;
    }

    setId(id) {
        this.#id = id;
    }

    getTitle() {
        return this.#title;
    }

    setTitle(title) {
        this.#title = title;
    }

    getIsActiveForAuthor() {
        return this.#isActiveForAuthor;
    }

    setIsActiveForAuthor(isActiveForAuthor) {
        this.#isActiveForAuthor = isActiveForAuthor;
    }

    getDescription() {
        return this.#description;
    }

    setDescription(description) {
        this.#description = description;
    }

    getDoNeedToDeleteAllWords() {
        return this.#doNeedToDeleteAllWords;
    }

    setDoNeedToDeleteAllWords(doNeedToDeleteAllWords) {
        this.#doNeedToDeleteAllWords = doNeedToDeleteAllWords;
    }

    getExcludedWordInCollectionIdsArr() {
        return this.#excludedWordInCollectionIdsArr;
    }

    setExcludedWordInCollectionIdsArr(excludedWordInCollectionIdsArr) {
        this.#excludedWordInCollectionIdsArr = excludedWordInCollectionIdsArr;
    }
}