import {
    URL_TO_API
} from "./api_variables.js";

import {
    jsonReplacer
} from "../utils/json_utils.js";

import {
    buildJSONResponseByXml
} from "../utils/json_response_utils.js";

const URL_TO_API_WORDS_IN_COLLECTION = URL_TO_API + "/words_in_collection";
const URL_TO_API_WORDS_IN_COLLECTION_FILTERED_PAGINATION =
    URL_TO_API_WORDS_IN_COLLECTION + "/filtered_pagination";
const URL_TO_API_WORDS_IN_COLLECTION_DELETE_INACTIVE_WORDS_IN_COLLECTIONS =
    URL_TO_API_WORDS_IN_COLLECTION + "/delete_inactive_words_in_collections";
const URL_TO_API_WORDS_IN_COLLECTION_COUNT_BY_COLLECTION_KEY =
    URL_TO_API_WORDS_IN_COLLECTION + "/count_by_collection_key";

const URL_TO_API_WORDS_IN_COLLECTION_FIND = URL_TO_API_WORDS_IN_COLLECTION + "/find";
const URL_TO_API_WORDS_IN_COLLECTION_FIND_BY_COLLECTION_KEY_AND_WORD_ID =
    URL_TO_API_WORDS_IN_COLLECTION_FIND + "/by_collection_key_and_word_id";

const URL_TO_API_WORDS_IN_COLLECTION_VALIDATE = URL_TO_API_WORDS_IN_COLLECTION + "/validate";
const URL_TO_API_WORDS_IN_COLLECTION_VALIDATE_CUSTOMER_COLLECTION_AND_WORD_LANGS =
    URL_TO_API_WORDS_IN_COLLECTION_VALIDATE + "/customer_collection_and_word_langs";

export async function postJSONResponseAddWordInCollection(wordId, customerCollectionKey) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_WORDS_IN_COLLECTION);
        let json = JSON.stringify({
            'word_id': wordId,
            'customer_collection_key': customerCollectionKey
        }, jsonReplacer);

        let xml = new XMLHttpRequest();
        xml.open("POST", requestURL);
        xml.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send(json);
    });
}

export async function deleteJSONResponseDeleteWordInCollection(wordInCollectionId) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_WORDS_IN_COLLECTION);
        let json = JSON.stringify({
            'id': wordInCollectionId
        }, jsonReplacer);

        let xml = new XMLHttpRequest();
        xml.open("DELETE", requestURL);
        xml.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send(json);
    })
}

export async function getJSONResponseFindWordInCollectionByCollectionKeyAndWordId(collectionKey, wordId) {
    return  new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_WORDS_IN_COLLECTION_FIND_BY_COLLECTION_KEY_AND_WORD_ID);
        requestURL.searchParams.set("word_id", wordId);
        requestURL.searchParams.set("collection_key", collectionKey);

        let xml = new XMLHttpRequest();
        xml.open("GET", requestURL);
        xml.responseType = "json";

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send();
    });
}

export async function getJSONResponseAllWordsInCollectionFilteredPagination(title, numberOfWords,
    lastWordInCollectionIdOnPreviousPage, customerCollectionKey, partOfSpeechCode, langCode) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_WORDS_IN_COLLECTION_FILTERED_PAGINATION);
        requestURL.searchParams.set("title", title);
        requestURL.searchParams.set("number_of_words", numberOfWords);
        requestURL.searchParams.set("last_word_in_collection_id_on_previous_page",
            BigInt(lastWordInCollectionIdOnPreviousPage));
        if (customerCollectionKey) {
            requestURL.searchParams.set("customer_collection_key", customerCollectionKey);
        }
        if (partOfSpeechCode) {
            requestURL.searchParams.set("part_of_speech_code", partOfSpeechCode);
        }
        if (langCode) {
            requestURL.searchParams.set("lang_code", langCode);
        }

        let xml = new XMLHttpRequest();
        xml.open("GET", requestURL);
        xml.responseType = "json";

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send();
    })
}

export async function getJSONResponseValidateCollectionAndWordLangs(collectionKey, wordId) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_WORDS_IN_COLLECTION_VALIDATE_CUSTOMER_COLLECTION_AND_WORD_LANGS);
        requestURL.searchParams.set("customer_collection_key", collectionKey);
        requestURL.searchParams.set("word_id", wordId);

        let xml = new XMLHttpRequest();
        xml.open("GET", requestURL);
        xml.responseType = "json";

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send();
    });
}

export async function deleteJSONResponseDeleteInactiveWordsInCollections() {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_WORDS_IN_COLLECTION_DELETE_INACTIVE_WORDS_IN_COLLECTIONS);
        let json = JSON.stringify({}, jsonReplacer);

        let xml = new XMLHttpRequest();
        xml.open("DELETE", requestURL);
        xml.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send(json);
    })
}

export async function getJSONResponseCountOfWordsInCollectionByCollectionKey(collectionKey) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_WORDS_IN_COLLECTION_COUNT_BY_COLLECTION_KEY);
        requestURL.searchParams.set("collection_key", collectionKey);

        let xml = new XMLHttpRequest();
        xml.open("GET", requestURL);
        xml.responseType = "json";

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send();
    });
}