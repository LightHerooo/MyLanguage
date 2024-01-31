import {
    UrlToAPI
} from "./url_to_api.js";

import {
    XmlUtils
} from "../utils/json/xml_utils.js";

import {
    JSONUtils
} from "../utils/json/json_utils.js";

const _JSON_UTILS = new JSONUtils();
const _XML_UTILS = new XmlUtils();

const URL_TO_API_WORD_STATUS_HISTORIES = new UrlToAPI().VALUE + "/word_status_histories";
const URL_TO_API_WORD_STATUS_HISTORIES_FIND = URL_TO_API_WORD_STATUS_HISTORIES + "/find";

export class WordStatusHistoriesAPI {
    GET = new WordStatusHistoriesGETRequests();
    POST = new WordStatusHistoriesPOSTRequests();
}

class WordStatusHistoriesGETRequests {
    async getAllByWordId(wordId) {
        let requestURL = new URL(URL_TO_API_WORD_STATUS_HISTORIES + "/by_word_id");
        requestURL.searchParams.set("word_id", wordId);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async findCurrentByWordId(wordId) {
        let requestURL = new URL(URL_TO_API_WORD_STATUS_HISTORIES_FIND + "/current_by_word_id");
        requestURL.searchParams.set("id", wordId);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }
}

class WordStatusHistoriesPOSTRequests {
    async addWordStatusToWordsWithoutStatus(wordStatusHistoryRequestDTO) {
        let requestURL =
            new URL(URL_TO_API_WORD_STATUS_HISTORIES + "/add_word_status_to_words_without_status");

        let jsonStr = _JSON_UTILS.stringify({
            'word_status_code': wordStatusHistoryRequestDTO.wordStatusCode
        });

        return await _XML_UTILS.getJSONResponseByPOSTXml(requestURL, jsonStr);
    }
}