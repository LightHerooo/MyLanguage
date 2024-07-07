export class YandexLangsResponseDTO {
    #langCodeCouples;
    #langCodes;
    #langInCodes;
    #langOutCodes;

    constructor(json) {
        if (json) {
            this.#langCodeCouples = json["lang_code_couples"];
            this.#langCodes = json["lang_codes"];
            this.#langInCodes = json["lang_in_codes"];
            this.#langOutCodes = json["lang_out_codes"];
        }
    }

    getLangCodeCouples() {
        return this.#langCodeCouples;
    }

    getLangCodes() {
        return this.#langCodes;
    }

    getLangInCodes() {
        return this.#langInCodes;
    }

    getLangOutCodes() {
        return this.#langOutCodes;
    }

    isExistsLangInCode(langInCode) {
        let isExists;
        if (langInCode) {
            let langInCodes = this.#langInCodes;
            if (langInCodes) {
                isExists = langInCodes.indexOf(langInCode) !== -1;
            }
        }

        return isExists;
    }

    isExistsLangOutCode(langOutCode) {
        let isExists;
        if (langOutCode) {
            let langOutCodes = this.#langOutCodes;
            if (langOutCodes) {
                isExists = langOutCodes.indexOf(langOutCode) !== -1;
            }
        }

        return isExists;
    }
}