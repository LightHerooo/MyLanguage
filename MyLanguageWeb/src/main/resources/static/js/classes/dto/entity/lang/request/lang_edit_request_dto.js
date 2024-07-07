export class LangEditRequestDTO {
    #langCode;
    #title;
    #countryCode;
    #isActiveForIn;
    #isActiveForOut;

    getLangCode() {
        return this.#langCode;
    }

    setLangCode(langCode) {
        this.#langCode = langCode;
    }

    getTitle() {
        return this.#title;
    }

    setTitle(title) {
        this.#title = title;
    }

    getCountryCode() {
        return this.#countryCode;
    }

    setCountryCode(countryCode) {
        this.#countryCode = countryCode;
    }

    getIsActiveForIn() {
        return this.#isActiveForIn;
    }

    setIsActiveForIn(isActiveForIn) {
        this.#isActiveForIn = isActiveForIn;
    }

    getIsActiveForOut() {
        return this.#isActiveForOut;
    }

    setIsActiveForOut(isActiveForOut) {
        this.#isActiveForOut = isActiveForOut;
    }
}