import {
    UrlToAPI
} from "../url_to_api.js";

import {
    XmlUtils
} from "../utils/xml_utils.js";

import {
    JSONUtils
} from "../utils/json_utils.js";

import {
    HttpMethods
} from "../classes/http/http_methods.js";

const _XML_UTILS = new XmlUtils();
const _JSON_UTILS = new JSONUtils();
const _HTTP_METHODS = new HttpMethods();

const _URL_TO_API_LANGS = `${new UrlToAPI().VALUE}/langs`;
const _URL_TO_API_LANGS_GET = `${_URL_TO_API_LANGS}/get`;
const _URL_TO_API_LANGS_FIND = `${_URL_TO_API_LANGS}/find`;
const _URL_TO_API_LANGS_VALIDATE = `${_URL_TO_API_LANGS}/validate`;
const _URL_TO_API_LANGS_EDIT = `${_URL_TO_API_LANGS}/edit`;

export class LangsAPI {
    GET = new LangsGETRequests();
    PATCH = new LangsPATCHRequests();
}

class LangsGETRequests {
    async getAll(title, isActiveForIn, isActiveForOut, numberOfItems, lastLangIdOnPreviousPage) {
        let requestURL = new URL(_URL_TO_API_LANGS_GET);

        if (title) {
            requestURL.searchParams.set("title", title);
        }
        if (isActiveForIn !== null && isActiveForIn !== undefined) {
            requestURL.searchParams.set("is_active_for_in", isActiveForIn);
        }
        if (isActiveForOut !== null && isActiveForOut !== undefined) {
            requestURL.searchParams.set("is_active_for_out", isActiveForOut);
        }
        if (numberOfItems) {
            requestURL.searchParams.set("number_of_items", numberOfItems);
        }
        if (lastLangIdOnPreviousPage) {
            requestURL.searchParams.set("last_lang_id_on_previous_page", lastLangIdOnPreviousPage);
        }

        return await _XML_UTILS.sendGET(requestURL);
    }

    async getAllForIn() {
        let requestURL = new URL(`${_URL_TO_API_LANGS_GET}/for_in`);

        return await _XML_UTILS.sendGET(requestURL);
    }

    async getAllForOut() {
        let requestURL = new URL(`${_URL_TO_API_LANGS_GET}/for_out`);

        return await _XML_UTILS.sendGET(requestURL);
    }

    async getAllForInByLangOutCode(langOutCode) {
        let requestURL = new URL(`${_URL_TO_API_LANGS_GET}/for_in/by_lang_out_code`);
        requestURL.searchParams.set("lang_out_code", langOutCode);

        return await _XML_UTILS.sendGET(requestURL);
    }

    async getAllForOutByLangInCode(langInCode) {
        let requestURL = new URL(`${_URL_TO_API_LANGS_GET}/for_out/by_lang_in_code`);
        requestURL.searchParams.set("lang_in_code", langInCode);

        return await _XML_UTILS.sendGET(requestURL);
    }

    async getYandexDictionaryLangs() {
        let requestURL = new URL(`${_URL_TO_API_LANGS}/yandex_dictionary_langs`);

        return await _XML_UTILS.sendGET(requestURL);
    }

    async findByCode(code) {
        let requestURL = new URL(`${_URL_TO_API_LANGS_FIND}/by_code`);
        requestURL.searchParams.set("code", code);

        return await _XML_UTILS.sendGET(requestURL);
    }

    async validateIsActiveForIn(code) {
        let requestURL = new URL(`${_URL_TO_API_LANGS_VALIDATE}/is_active_for_in`);
        requestURL.searchParams.set("code", code);

        return await _XML_UTILS.sendGET(requestURL);
    }

    async validateIsActiveForOut(code) {
        let requestURL = new URL(`${_URL_TO_API_LANGS_VALIDATE}/is_active_for_out`);
        requestURL.searchParams.set("code", code);

        return await _XML_UTILS.sendGET(requestURL);
    }

    async validateCoupleOfLanguages(langInCode, langOutCode) {
        let requestURL = new URL(`${_URL_TO_API_LANGS_VALIDATE}/couple_of_languages`);
        requestURL.searchParams.set("lang_in_code", langInCode);
        requestURL.searchParams.set("lang_out_code", langOutCode);

        return await _XML_UTILS.sendGET(requestURL);
    }
}

class LangsPATCHRequests {
    #currentHttpMethod = _HTTP_METHODS.PATCH;
    async editIsActiveForIn(entityEditValueByCodeRequestDTOObj) {
        let requestURL = new URL(`${_URL_TO_API_LANGS_EDIT}/is_active_for_in`);

        let jsonStr = _JSON_UTILS.stringify({
            'code': entityEditValueByCodeRequestDTOObj.getCode(),
            'value': entityEditValueByCodeRequestDTOObj.getValue()
        });

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, jsonStr);
    }

    async editIsActiveForOut(entityEditValueByCodeRequestDTOObj) {
        let requestURL = new URL(`${_URL_TO_API_LANGS_EDIT}/is_active_for_out`);

        let jsonStr = _JSON_UTILS.stringify({
            'code': entityEditValueByCodeRequestDTOObj.getCode(),
            'value': entityEditValueByCodeRequestDTOObj.getValue()
        });

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, jsonStr);
    }

    async turnOnSupportedLangsIn() {
        let requestURL = new URL(`${_URL_TO_API_LANGS}/turn_on/supported_langs_in`);

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, _JSON_UTILS.createJsonStrEmpty());
    }

    async turnOnSupportedLangsOut() {
        let requestURL = new URL(`${_URL_TO_API_LANGS}/turn_on/supported_langs_out`);

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, _JSON_UTILS.createJsonStrEmpty());
    }

    async turnOffUnsupportedLangsIn() {
        let requestURL = new URL(`${_URL_TO_API_LANGS}/turn_off/unsupported_langs_in`);

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, _JSON_UTILS.createJsonStrEmpty());
    }

    async turnOffUnsupportedLangsOut() {
        let requestURL = new URL(`${_URL_TO_API_LANGS}/turn_off/unsupported_langs_out`);

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, _JSON_UTILS.createJsonStrEmpty());
    }

    async turnOffLangsIn(){
        let requestURL = new URL(`${_URL_TO_API_LANGS}/turn_off/langs_in`);

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, _JSON_UTILS.createJsonStrEmpty());
    }

    async turnOffLangsOut(){
        let requestURL = new URL(`${_URL_TO_API_LANGS}/turn_off/langs_out`);

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, _JSON_UTILS.createJsonStrEmpty());
    }
}