import {
    UrlToAPI
} from "./url_to_api.js";

import {
    DateParts
} from "../date_parts.js";

import {
    XmlUtils
} from "../utils/json/xml_utils.js";

import {
    JSONUtils
} from "../utils/json/json_utils.js";

const _JSON_UTILS = new JSONUtils();
const _XML_UTILS = new XmlUtils();

const URL_TO_API_WORDS = new UrlToAPI().VALUE + "/words";
const URL_TO_API_WORDS_VALIDATE = URL_TO_API_WORDS + "/validate";

export class WordsAPI {
    GET = new WordsGETRequests();
    POST = new WordsPOSTRequests();
    PATCH = new WordsPATCHRequests();
    DELETE = new WordsDELETERequests();
}

class WordsGETRequests {
    async getAllFilteredPagination(numberOfWords, title, wordStatusCode,
                                   langCode, lastWordIdOnPreviousPage) {
        let requestURL = new URL(URL_TO_API_WORDS + "/filtered_pagination");
        requestURL.searchParams.set("number_of_words", numberOfWords);
        requestURL.searchParams.set("title", title);

        if (wordStatusCode) {
            requestURL.searchParams.set("word_status_code", wordStatusCode);
        }
        if (langCode) {
            requestURL.searchParams.set("lang_code", langCode);
        }
        if (lastWordIdOnPreviousPage) {
            requestURL.searchParams.set("last_word_id_on_previous_page", lastWordIdOnPreviousPage);
        }

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async getAllCustomerFilteredPagination(numberOfWords, customerId, title, wordStatusCode,
                                           langCode, lastWordIdOnPreviousPage) {
        let requestURL = new URL(URL_TO_API_WORDS + "/customer_filtered_pagination");
        requestURL.searchParams.set("number_of_words", numberOfWords);
        requestURL.searchParams.set("customer_id", customerId);
        requestURL.searchParams.set("title", title);

        if (wordStatusCode) {
            requestURL.searchParams.set("word_status_code", wordStatusCode);
        }
        if (langCode) {
            requestURL.searchParams.set("lang_code", langCode);
        }
        if (lastWordIdOnPreviousPage) {
            requestURL.searchParams.set("last_word_id_on_previous_page", lastWordIdOnPreviousPage);
        }

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async getWordsWithStatusStatistics() {
        let requestURL = new URL(URL_TO_API_WORDS + "/words_with_status_statistics");

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async getWordsWithStatusStatisticsByCustomerId(customerId) {
        let requestURL = new URL(URL_TO_API_WORDS + "/words_with_status_statistics_by_customer_id");
        requestURL.searchParams.set("customer_id", customerId);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async getCountByDateOfCreate(dateObj) {
        let dateParts = new DateParts(dateObj);

        let requestURL = new URL(URL_TO_API_WORDS + "/count_by_date_of_create");
        requestURL.searchParams.set("date_of_create", dateParts.getDatabaseDateStr());

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }
}

class WordsPOSTRequests {
    async add(wordRequestDTO) {
        let requestURL = new URL(URL_TO_API_WORDS);

        let jsonStr = _JSON_UTILS.stringify({
            'title': wordRequestDTO.title,
            'customer_id': wordRequestDTO.customerId,
            'lang_code': wordRequestDTO.langCode
        });

        return await _XML_UTILS.getJSONResponseByPOSTXml(requestURL, jsonStr);
    }

    async validateBeforeAdd(wordRequestDTO) {
        let requestURL = new URL(URL_TO_API_WORDS_VALIDATE + "/before_add");
        let jsonStr = _JSON_UTILS.stringify({
            'id': wordRequestDTO.id,
            'title': wordRequestDTO.title,
            'lang_code': wordRequestDTO.langCode
        });

        return await _XML_UTILS.getJSONResponseByPOSTXml(requestURL, jsonStr);
    }
}

class WordsPATCHRequests {
    async changeWordStatus(wordRequestDTO) {
        let requestURL = new URL(URL_TO_API_WORDS + "/change_word_status");
        let jsonStr = _JSON_UTILS.stringify({
            'id': wordRequestDTO.id,
            'word_status_code': wordRequestDTO.wordStatusCode
        });

        return await _XML_UTILS.getJSONResponseByPATCHXml(requestURL, jsonStr);
    }
}

class WordsDELETERequests {
    async deleteAllUnclaimedWords() {
        let requestURL = new URL(URL_TO_API_WORDS + "/delete_all_unclaimed_words");
        return await _XML_UTILS.getJSONResponseByDELETEXml(requestURL, null);
    }
}