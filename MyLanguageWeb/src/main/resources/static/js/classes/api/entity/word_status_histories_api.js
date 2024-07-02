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

const _JSON_UTILS = new JSONUtils();
const _XML_UTILS = new XmlUtils();
const _HTTP_METHODS = new HttpMethods();

const _URL_TO_API_WORD_STATUS_HISTORIES = `${new UrlToAPI().VALUE}/word_status_histories`;
const _URL_TO_API_WORD_STATUS_HISTORIES_GET = `${_URL_TO_API_WORD_STATUS_HISTORIES}/get`;
const _URL_TO_API_WORD_STATUS_HISTORIES_ADD = `${_URL_TO_API_WORD_STATUS_HISTORIES}/add`;

export class WordStatusHistoriesAPI {
    GET = new WordStatusHistoriesGETRequests();
    POST = new WordStatusHistoriesPOSTRequests();
}

class WordStatusHistoriesGETRequests {
    async getAllWordsWithCurrentStatus(title, langCode, wordStatusCode, customerId, numberOfItems,
                                       lastWordStatusHistoryIdOnPreviousPage) {
        let requestURL = new URL(`${_URL_TO_API_WORD_STATUS_HISTORIES_GET}/words_with_current_status`);
        if (title) {
            requestURL.searchParams.set("title", title);
        }
        if (langCode) {
            requestURL.searchParams.set("lang_code", langCode);
        }
        if (wordStatusCode) {
            requestURL.searchParams.set("word_status_code", wordStatusCode);
        }
        if (customerId) {
            requestURL.searchParams.set("customer_id", customerId);
        }
        if (numberOfItems) {
            requestURL.searchParams.set("number_of_items", numberOfItems);
        }
        if (lastWordStatusHistoryIdOnPreviousPage) {
            requestURL.searchParams.set("last_word_status_history_id_on_previous_page", lastWordStatusHistoryIdOnPreviousPage);
        }

        return await _XML_UTILS.sendGET(requestURL);
    }

    async getAllWordChangesHistory(wordId) {
        let requestURL = new URL(`${_URL_TO_API_WORD_STATUS_HISTORIES_GET}/word_changes_history`);
        if (wordId) {
            requestURL.searchParams.set("word_id", wordId);
        }

        return await _XML_UTILS.sendGET(requestURL);
    }
}

class WordStatusHistoriesPOSTRequests {
    #currentHttpMethod = _HTTP_METHODS.POST;
    async addWordStatusToWordsWithoutStatus(entityValueRequestDTOObj) {
        let requestURL = new URL(`${_URL_TO_API_WORD_STATUS_HISTORIES_ADD}/word_status_to_words_without_status`);

        let jsonStr = _JSON_UTILS.stringify({
            'value': entityValueRequestDTOObj.getValue()
        });

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, jsonStr);
    }
}