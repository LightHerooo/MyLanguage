export class LangAddRequestDTO {
    #langCode;
    #title;
    #countryCode;

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
}