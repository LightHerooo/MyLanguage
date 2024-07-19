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
    UrlPaths
} from "../../url/path/url_paths.js";

const _JSON_UTILS = new JSONUtils();
const _XML_UTILS = new XmlUtils();
const _HTTP_METHODS = new HttpMethods();

const _URL_TO_API_WORDS_IN_COLLECTION = `${new UrlPaths().API.createFullPath()}/words_in_collection`;
const _URL_TO_API_WORDS_IN_COLLECTION_GET = `${_URL_TO_API_WORDS_IN_COLLECTION}/get`;
const _URL_TO_API_WORDS_IN_COLLECTION_FIND = `${_URL_TO_API_WORDS_IN_COLLECTION}/find`;
const _URL_TO_API_WORDS_IN_COLLECTION_VALIDATE = `${_URL_TO_API_WORDS_IN_COLLECTION}/validate`;
const _URL_TO_API_WORDS_IN_COLLECTION_ADD = `${_URL_TO_API_WORDS_IN_COLLECTION}/add`;
const _URL_TO_API_WORDS_IN_COLLECTION_DELETE = `${_URL_TO_API_WORDS_IN_COLLECTION}/delete`;

export class WordsInCollectionAPI {
    GET = new WordsInCollectionGETRequests();
    POST = new WordsInCollectionPOSTRequests();
    DELETE = new WordsInCollectionDELETERequests();
}

class WordsInCollectionGETRequests {
    async getAll(customerCollectionId, numberOfItems, title, lastWordInCollectionIdOnPreviousPage){
        let requestURL = new URL(_URL_TO_API_WORDS_IN_COLLECTION_GET);

        requestURL.searchParams.set("customer_collection_id", customerCollectionId);
        if (title) {
            requestURL.searchParams.set("title", title);
        }
        if (numberOfItems) {
            requestURL.searchParams.set("number_of_items", numberOfItems);
        }
        if (lastWordInCollectionIdOnPreviousPage) {
            requestURL.searchParams
                .set("last_word_in_collection_id_on_previous_page", lastWordInCollectionIdOnPreviousPage);
        }

        return await _XML_UTILS.sendGET(requestURL);
    }

    async findWordInCollection(wordId, customerCollectionId) {
        let requestURL = new URL(`${_URL_TO_API_WORDS_IN_COLLECTION_FIND}/word_in_collection`);
        requestURL.searchParams.set("word_id", wordId);
        requestURL.searchParams.set("customer_collection_id", customerCollectionId);

        return await _XML_UTILS.sendGET(requestURL);
    }
}

class WordsInCollectionPOSTRequests {
    #currentHttpMethod = _HTTP_METHODS.POST;
    async add(wordInCollectionRequestDTOObj) {
        let requestURL = new URL(_URL_TO_API_WORDS_IN_COLLECTION_ADD);
        let jsonStr = _JSON_UTILS.stringify({
            'word_id': wordInCollectionRequestDTOObj.getWordId(),
            'customer_collection_id': wordInCollectionRequestDTOObj.getCustomerCollectionId()
        });

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, jsonStr);
    }

    async validateBeforeAdd(wordInCollectionAddRequestDTOObj) {
        let requestURL = new URL(`${_URL_TO_API_WORDS_IN_COLLECTION_VALIDATE}/before_add`);
        let jsonStr = _JSON_UTILS.stringify({
            'word_id': wordInCollectionAddRequestDTOObj.getWordId(),
            'customer_collection_id': wordInCollectionAddRequestDTOObj.getCustomerCollectionId()
        });

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, jsonStr);
    }

    async validateBeforeDelete(entityIdRequestDTOObj) {
        let requestURL = new URL(`${_URL_TO_API_WORDS_IN_COLLECTION_VALIDATE}/before_delete`);
        let jsonStr = _JSON_UTILS.stringify({
            'id': entityIdRequestDTOObj.getId()
        });

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, jsonStr);
    }
}

class WordsInCollectionDELETERequests {
    #currentHttpMethod = _HTTP_METHODS.DELETE;
    async delete(entityIdRequestDTOObj) {
        let requestURL = new URL(_URL_TO_API_WORDS_IN_COLLECTION_DELETE);
        let jsonStr = _JSON_UTILS.stringify({
            'id': entityIdRequestDTOObj.getId()
        });

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, jsonStr);
    }

    async deleteAllWithoutActiveStatus() {
        let requestURL = new URL(`${_URL_TO_API_WORDS_IN_COLLECTION_DELETE}/all_without_active_status`);

        return await _XML_UTILS.sendJson(requestURL, this.#currentHttpMethod, _JSON_UTILS.createJsonStrEmpty());
    }
}