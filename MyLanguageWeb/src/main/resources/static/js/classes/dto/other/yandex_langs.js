export class YandexDictionaryLangs {
    langCouples;
    allLangs;
    langsIn;
    langsOut;

    constructor(yandexDictionaryLangsJson) {
        if (yandexDictionaryLangsJson) {
            this.langCouples = yandexDictionaryLangsJson["lang_couples"];
            this.allLangs = yandexDictionaryLangsJson["all_langs"];
            this.langsIn = yandexDictionaryLangsJson["langs_in"];
            this.langsOut = yandexDictionaryLangsJson["langs_out"];
        }
    }
}