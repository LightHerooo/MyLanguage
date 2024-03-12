import {
    UrlToAPI
} from "./url_to_api.js";

import {
    XmlUtils
} from "../utils/json/xml_utils.js";

import {
    JSONUtils
} from "../utils/json/json_utils.js";

const _XML_UTILS = new XmlUtils();
const _JSON_UTILS = new JSONUtils();

const URL_TO_API_LANGS = new UrlToAPI().VALUE + "/langs";
const URL_TO_API_LANGS_FIND = URL_TO_API_LANGS + "/find";
const URL_TO_API_LANGS_VALIDATE = URL_TO_API_LANGS + "/validate";

export class LangsAPI {
    GET = new LangsGETRequests();
    PATCH = new LangsPATCHRequests();
}

class LangsGETRequests {
    async getAllFiltered(title) {
        let requestURL = new URL(URL_TO_API_LANGS + "/filtered");

        if (title) {
            requestURL.searchParams.set("title", title);
        }

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async getAllForIn() {
        let requestURL = new URL(URL_TO_API_LANGS + "/for_in");

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async getAllForOut() {
        let requestURL = new URL(URL_TO_API_LANGS + "/for_out");

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async getAllForInByLangOutCode(langOutCode) {
        let requestURL = new URL(URL_TO_API_LANGS + "/for_in_by_lang_out_code");
        requestURL.searchParams.set("lang_out_code", langOutCode);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async getAllForOutByLangInCode(langInCode) {
        let requestURL = new URL(URL_TO_API_LANGS + "/for_out_by_lang_in_code");
        requestURL.searchParams.set("lang_in_code", langInCode);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async getYandexDictionaryLangs() {
        let requestURL = new URL(URL_TO_API_LANGS + "/yandex_dictionary_langs");

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async findByCode(code) {
        let requestURL = new URL(URL_TO_API_LANGS_FIND + "/by_code");
        requestURL.searchParams.set("code", code);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async validateIsActiveForInByCode(code) {
        let requestURL = new URL(URL_TO_API_LANGS_VALIDATE + "/is_active_for_in_by_code");
        requestURL.searchParams.set("code", code);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async validateIsActiveForOutByCode(code) {
        let requestURL = new URL(URL_TO_API_LANGS_VALIDATE + "/is_active_for_out_by_code");
        requestURL.searchParams.set("code", code);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async validateCoupleOfLanguages(langInCode, langOutCode) {
        let requestURL = new URL(URL_TO_API_LANGS_VALIDATE + "/couple_of_languages");
        requestURL.searchParams.set("lang_in_code", langInCode);
        requestURL.searchParams.set("lang_out_code", langOutCode);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }
}

class LangsPATCHRequests {
    async changeActivityForIn(langRequestDTO) {
        let requestURL = new URL(URL_TO_API_LANGS + "/change_activity_for_in");

        let jsonStr = _JSON_UTILS.stringify({
            'code': langRequestDTO.code,
            'is_active_for_in': langRequestDTO.isActiveForIn
        });

        return await _XML_UTILS.getJSONResponseByPATCHXml(requestURL, jsonStr);
    }

    async changeActivityForOut(langRequestDTO) {
        let requestURL = new URL(URL_TO_API_LANGS + "/change_activity_for_out");

        let jsonStr = _JSON_UTILS.stringify({
            'code': langRequestDTO.code,
            'is_active_for_out': langRequestDTO.isActiveForOut
        });

        return await _XML_UTILS.getJSONResponseByPATCHXml(requestURL, jsonStr);
    }

    async onLangsSupportedForIn() {
        let requestURL = new URL(URL_TO_API_LANGS + "/on_langs_supported_for_in");

        return await _XML_UTILS.getJSONResponseByPATCHXml(requestURL, null);
    }

    async onLangsSupportedForOut() {
        let requestURL = new URL(URL_TO_API_LANGS + "/on_langs_supported_for_out");

        return await _XML_UTILS.getJSONResponseByPATCHXml(requestURL, null);
    }

    async offLangsDoesntSupportedForIn() {
        let requestURL = new URL(URL_TO_API_LANGS + "/off_langs_doesnt_supported_for_in");

        return await _XML_UTILS.getJSONResponseByPATCHXml(requestURL, null);
    }

    async offLangsDoesntSupportedForOut() {
        let requestURL = new URL(URL_TO_API_LANGS + "/off_langs_doesnt_supported_for_out");

        return await _XML_UTILS.getJSONResponseByPATCHXml(requestURL, null);
    }
}