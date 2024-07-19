import {
    XmlUtils
} from "../utils/xml_utils.js";

import {
    UrlPaths
} from "../../url/path/url_paths.js";

const _XML_UTILS = new XmlUtils();

const _URL_TO_API_WORD_STATUS_HISTORIES = `${new UrlPaths().API.createFullPath()}/word_status_histories`;
const _URL_TO_API_WORD_STATUS_HISTORIES_GET = `${_URL_TO_API_WORD_STATUS_HISTORIES}/get`;

export class WordStatusHistoriesAPI {
    GET = new WordStatusHistoriesGETRequests();
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