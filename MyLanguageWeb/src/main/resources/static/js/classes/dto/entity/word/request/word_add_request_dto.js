export class WordAddRequestDTO {
    #title;
    #langCode;

    getTitle() {
        return this.#title;
    }

    setTitle(title) {
        this.#title = title;
    }

    getLangCode() {
        return this.#langCode;
    }

    setLangCode(langCode) {
        this.#langCode = langCode;
    }
}