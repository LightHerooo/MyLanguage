import {
    UrlToAPI
} from "./url_to_api.js";

import {
    XmlUtils
} from "../utils/json/xml_utils.js";

const _XML_UTILS = new XmlUtils();

const URL_TO_API_LANGS = new UrlToAPI().VALUE + "/langs";
const URL_TO_API_LANGS_FIND = URL_TO_API_LANGS + "/find";
const URL_TO_API_LANGS_VALIDATE = URL_TO_API_LANGS + "/validate";

export class LangsAPI {
    GET = new LangsGETRequests();
}

class LangsGETRequests {
    async getAll() {
        let requestURL = new URL(URL_TO_API_LANGS);

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