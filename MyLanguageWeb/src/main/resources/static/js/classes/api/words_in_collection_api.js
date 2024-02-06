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

const URL_TO_API_WORDS_IN_COLLECTION = new UrlToAPI().VALUE + "/words_in_collection";
const URL_TO_API_WORDS_IN_COLLECTION_FIND = URL_TO_API_WORDS_IN_COLLECTION + "/find";
const URL_TO_API_WORDS_IN_COLLECTION_VALIDATE = URL_TO_API_WORDS_IN_COLLECTION + "/validate";

export class WordsInCollectionAPI {
    GET = new WordsInCollectionGETRequests();
    POST = new WordsInCollectionPOSTRequests();
    DELETE = new WordsInCollectionDELETERequests();
}

class WordsInCollectionGETRequests {
    async getAllInCollectionFilteredPagination(collectionKey, numberOfWords, title,
                                               langCode, lastWordInCollectionIdOnPreviousPage){
        let requestURL = new URL(URL_TO_API_WORDS_IN_COLLECTION + "/filtered_pagination");
        requestURL.searchParams.set("collection_key", collectionKey);
        requestURL.searchParams.set("number_of_words", numberOfWords);
        requestURL.searchParams.set("title", title);

        if (langCode) {
            requestURL.searchParams.set("lang_code", langCode);
        }
        if (lastWordInCollectionIdOnPreviousPage) {
            requestURL.searchParams
                .set("last_word_in_collection_id_on_previous_page", lastWordInCollectionIdOnPreviousPage);
        }

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async findByWordIdAndCollectionKey(wordId, collectionKey) {
        let requestURL = new URL(URL_TO_API_WORDS_IN_COLLECTION_FIND + "/by_word_id_and_collection_key");
        requestURL.searchParams.set("word_id", wordId);
        requestURL.searchParams.set("collection_key", collectionKey);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async validateLangsInWordAndCollection(wordId, collectionKey) {
        let requestURL = new URL(URL_TO_API_WORDS_IN_COLLECTION_VALIDATE + "/langs_in_word_and_collection");
        requestURL.searchParams.set("word_id", wordId);
        requestURL.searchParams.set("collection_key", collectionKey);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }

    async getCountByCollectionKey(collectionKey) {
        let requestURL = new URL(URL_TO_API_WORDS_IN_COLLECTION + "/count_by_collection_key");
        requestURL.searchParams.set("collection_key", collectionKey);

        return await _XML_UTILS.getJSONResponseByGETXml(requestURL);
    }
}

class WordsInCollectionPOSTRequests {
    async add(wordInCollectionRequestDTO) {
        let requestURL = new URL(URL_TO_API_WORDS_IN_COLLECTION);
        let jsonStr = _JSON_UTILS.stringify({
            'word_id': wordInCollectionRequestDTO.wordId,
            'customer_collection_key': wordInCollectionRequestDTO.collectionKey
        });

        return await _XML_UTILS.getJSONResponseByPOSTXml(requestURL, jsonStr);
    }
}

class WordsInCollectionDELETERequests {
    async delete(wordInCollectionRequestDTO) {
        let requestURL = new URL(URL_TO_API_WORDS_IN_COLLECTION);
        let jsonStr = _JSON_UTILS.stringify({
            'id': wordInCollectionRequestDTO.id
        });

        return await _XML_UTILS.getJSONResponseByDELETEXml(requestURL, jsonStr);
    }

    async deleteInactiveWordsInCollections() {
        let requestURL = new URL(URL_TO_API_WORDS_IN_COLLECTION + "/delete_inactive_words_in_collections");
        return await _XML_UTILS.getJSONResponseByDELETEXml(requestURL, null);
    }
}