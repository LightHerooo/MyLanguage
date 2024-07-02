export class WorkoutAddRandomWordsRequestDTO {
    #langInCode;
    #langOutCode;
    #numberOfWords;

    getLangInCode() {
        return this.#langInCode;
    }

    setLangInCode(langInCode) {
        this.#langInCode = langInCode;
    }

    getLangOutCode() {
        return this.#langOutCode;
    }

    setLangOutCode(langOutCode) {
        this.#langOutCode = langOutCode;
    }

    getNumberOfWords() {
        return this.#numberOfWords;
    }

    setNumberOfWords(numberOfWords) {
        this.#numberOfWords = numberOfWords;
    }
}