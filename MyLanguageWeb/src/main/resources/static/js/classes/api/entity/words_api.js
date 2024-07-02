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

import {
    DateParts
} from "../../html/date_parts.js";

const _JSON_UTILS = new JSONUtils();
const _XML_UTILS = new XmlUtils();
const _HTTP_METHODS = new HttpMethods();

const _URL_TO_API_WORDS = `${new UrlToAPI().VALUE}/words`;
const _URL_TO_API_WORDS_GET = `${_URL_TO_API_WORDS}/get`;
const _URL_TO_API_WORDS_COUNT = `${_URL_TO_API_WORDS}/count`;
const _URL_TO_API_WORDS_VALIDATE = `${_URL_TO_API_WORDS}/validate`;
const _URL_TO_API_WORDS_ADD = `${_URL_TO_API_WORDS}/add`;
const _URL_TO_API_WORDS_EDIT = `${_URL_TO_API_WORDS}/edit`;
const _URL_TO_API_WORDS_DELETE = `${_URL_TO_API_WORDS}/delete`;

export class WordsAPI {
    GET = new WordsGETRequests();
    POST = new WordsPOSTRequests();
    PATCH = new WordsPATCHRequests();
    DELETE = new WordsDELETERequests();
}

class WordsGETRequests {
    async getAll(title, langCode, wordStatusCode, numberOfItems, lastWordIdOnPreviousPage) {
        let requestURL = new URL(_URL_TO_API_WORDS_GET);

        if (title) {
            requestURL.searchParams.set("title", title);
        }
        if (langCode) {
            requestURL.searchParams.set("lang_code", langCode);
        }
        if (wordStatusCode) {
            requestURL.searchParams.set("word_status_code", wordStatusCode);
        }
        if (numberOfItems) {
            requestURL.searchParams.set("number_of_items", numberOfItems);
        }
        if (lastWordIdOnPreviousPage) {
            requestURL.searchParams.set("last_word_id_on_previous_page", lastWordIdOnPreviousPage);
        }

        return await _XML_UTILS.sendGET(requestURL);
    }

    async getStatistic() {
        let requestURL = new URL(`${_URL_TO_API_WORDS}/statistic`);

        return await _XML_UTILS.sendGET(requestURL);
    }

    async getCustomerStatistic(customerId) {
        let requestURL = new URL(`${_URL_TO_API_WORDS}/customer_statistic`);
        requestURL.searchParams.set("customer_id", customerId);

        return await _XML_UTILS.sendGET(requestURL);
    }

    async getCountByDateOfCreate(dateObj) {
        let dateParts = new DateParts(dateObj);

        let requestURL = new URL(`${_URL_TO_API_WORDS_COUNT}/by_date_of_create`);
        requestURL.searchParams.set("date_of_create", dateParts.getDatabaseDateStr());

        return await _XML_UTILS.sendGET(requestURL);
    }
}

class WordsPOSTRequests {
    #currentHttpMethod = _HTTP_METHODS.POST;
    async add(wordAddRequestDTOObj) {
        let requestURL = new URL(_URL_TO_API_WORDS_ADD);

        let jsonStr = _JSON_UTILS.stringify({
            'title': wordAddRequestDTOObj.getTitle(),
            'lang_code': wordAddRequestDTOObj.getLangCode()
        });

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, jsonStr);
    }

    async validateBeforeAdd(wordAddRequestDTOObj) {
        let requestURL = new URL(`${_URL_TO_API_WORDS_VALIDATE}/before_add`);
        let jsonStr = _JSON_UTILS.stringify({
            'title': wordAddRequestDTOObj.getTitle(),
            'lang_code': wordAddRequestDTOObj.getLangCode()
        });

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, jsonStr);
    }
}

class WordsPATCHRequests {
    #currentHttpMethod = _HTTP_METHODS.PATCH;
    async editWordStatus(entityEditValueByIdRequestDTOObj) {
        let requestURL = new URL(`${_URL_TO_API_WORDS_EDIT}/word_status`);
        let jsonStr = _JSON_UTILS.stringify({
            'id': entityEditValueByIdRequestDTOObj.getId(),
            'value': entityEditValueByIdRequestDTOObj.getValue()
        });

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, jsonStr);
    }
}

class WordsDELETERequests {
    #currentHttpMethod = _HTTP_METHODS.DELETE;
    async deleteAllUnclaimed() {
        let requestURL = new URL(`${_URL_TO_API_WORDS_DELETE}/all_unclaimed`);
        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, _JSON_UTILS.createJsonStrEmpty());
    }
}