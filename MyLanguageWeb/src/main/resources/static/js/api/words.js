import {
    URL_TO_API
} from "./api_variables.js";

import {
    buildJSONResponseByXml
} from "../utils/json_response_utils.js";

import {
    jsonReplacer, jsonReviver
} from "../utils/json_utils.js";

import {
    DateElements
} from "../utils/date_elements.js";

const URL_TO_API_WORDS = URL_TO_API + "/words";
const URL_TO_API_WORDS_FILTERED_PAGINATION = URL_TO_API_WORDS + "/filtered_pagination";
const URL_TO_API_WORDS_CUSTOMER_WORDS_FILTERED_PAGINATION =
    URL_TO_API_WORDS + "/customer_words_filtered_pagination";
const URL_TO_API_WORDS_ADD_SEVERAL = URL_TO_API_WORDS + "/add_several";
const URL_TO_API_WORDS_EDIT = URL_TO_API_WORDS + "/edit";
const URL_TO_API_WORDS_DELETE_ALL_UNCLAIMED_WORDS = URL_TO_API_WORDS + "/delete_all_unclaimed_words";
const URL_TO_API_WORDS_COUNT = URL_TO_API_WORDS + "/count";
const URL_TO_API_WORDS_COUNT_BY_WORD_STATUS_CODE = URL_TO_API_WORDS + "/count_by_word_status_code";
const URL_TO_API_WORDS_COUNT_BY_DATE_OF_CREATE = URL_TO_API_WORDS + "/count_by_date_of_create";
const URL_TO_API_WORDS_COUNT_BY_CUSTOMER_ID_AND_WORD_STATUS_CODE =
    URL_TO_API_WORDS + "/count_by_customer_id_and_word_status_code";

const URL_TO_API_WORDS_FIND = URL_TO_API_WORDS + "/find";
const URL_TO_API_WORDS_FIND_BY_TITLE = URL_TO_API_WORDS_FIND + "/by_title";

export async function getJSONResponseWordsFilteredPagination(numberOfWords, title, wordStatusCode, partOfSpeechCode,
                                                             langCode, lastWordIdOnPreviousPage) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_WORDS_FILTERED_PAGINATION);
        requestURL.searchParams.set("number_of_words", numberOfWords);
        requestURL.searchParams.set("title", title);

        if (wordStatusCode) {
            requestURL.searchParams.set("word_status_code", wordStatusCode);
        }
        if (partOfSpeechCode) {
            requestURL.searchParams.set("part_of_speech_code", partOfSpeechCode);
        }
        if (langCode) {
            requestURL.searchParams.set("lang_code", langCode);
        }

        requestURL.searchParams.set("last_word_id_on_previous_page", lastWordIdOnPreviousPage);

        let xml = new XMLHttpRequest();
        xml.open("GET", requestURL);
        xml.responseType = "json";

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send();
    })
}

export async function getJSONResponseCustomerWordsFilteredPagination(numberOfWords, customerId, title, wordStatusCode,
                                                                     partOfSpeechCode, langCode,
                                                                     lastWordIdOnPreviousPage) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_WORDS_CUSTOMER_WORDS_FILTERED_PAGINATION);
        requestURL.searchParams.set("number_of_words", numberOfWords);
        requestURL.searchParams.set("customer_id", customerId);
        requestURL.searchParams.set("title", title);

        if (wordStatusCode) {
            requestURL.searchParams.set("word_status_code", wordStatusCode);
        }
        if (partOfSpeechCode) {
            requestURL.searchParams.set("part_of_speech_code", partOfSpeechCode);
        }
        if (langCode) {
            requestURL.searchParams.set("lang_code", langCode);
        }

        requestURL.searchParams.set("last_word_id_on_previous_page", lastWordIdOnPreviousPage);

        let xml = new XMLHttpRequest();
        xml.open("GET", requestURL);
        xml.responseType = "json";

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send();
    })
}

export async function getJSONResponseWordFindByTitle(title) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_WORDS_FIND_BY_TITLE);
        requestURL.searchParams.set("title", title);

        let xml = new XMLHttpRequest();
        xml.open("GET", requestURL);
        xml.responseType = "json";

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send();
    })
}

export async function postJSONResponseAddSeveralWords(newWordsArr) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_WORDS_ADD_SEVERAL);
        let jsonStr = JSON.stringify({
            'words': []
        }, jsonReplacer);

        let jsonObj = JSON.parse(jsonStr, jsonReviver);
        for (let i = 0; i < newWordsArr.length; i++) {
            let title = newWordsArr[i][0];
            let lang_code = newWordsArr[i][1];
            let part_of_speech_code = newWordsArr[i][2];

            jsonObj['words'].push({title, lang_code, part_of_speech_code});
        }

        jsonStr = JSON.stringify(jsonObj, jsonReplacer);

        let xml = new XMLHttpRequest();
        xml.open("POST", requestURL);
        xml.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send(jsonStr);
    })
}

export async function patchJSONResponseEditWord(wordId, title, langCode, partOfSpeechCode, wordStatusCode) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_WORDS_EDIT);
        let jsonStr = JSON.stringify({
            'id': wordId,
            'title': title,
            'lang_code': langCode,
            'part_of_speech_code': partOfSpeechCode,
            'word_status_code': wordStatusCode
        }, jsonReplacer);

        let xml = new XMLHttpRequest();
        xml.open("PATCH", requestURL);
        xml.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send(jsonStr);
    })
}

export async function deleteJSONResponseDeleteAllUnclaimedWords() {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_WORDS_DELETE_ALL_UNCLAIMED_WORDS);
        let jsonStr = JSON.stringify({}, jsonReplacer);

        let xml = new XMLHttpRequest();
        xml.open("DELETE", requestURL);
        xml.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send(jsonStr);
    })
}

export async function getJSONResponseWordsCount() {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_WORDS_COUNT);

        let xml = new XMLHttpRequest();
        xml.open("GET", requestURL);

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send();
    })
}

export async function getJSONResponseWordsCountByWordStatusCode(wordStatusCode) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_WORDS_COUNT_BY_WORD_STATUS_CODE);
        requestURL.searchParams.set("word_status_code", wordStatusCode);

        let xml = new XMLHttpRequest();
        xml.open("GET", requestURL);

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send();
    })
}

export async function getJSONResponseWordsCountByDateOfCreate(dateObject) {
    return new Promise(resolve => {
        let dateObjectElements = new DateElements(dateObject);

        let requestURL = new URL(URL_TO_API_WORDS_COUNT_BY_DATE_OF_CREATE);
        requestURL.searchParams.set("date_of_create", dateObjectElements.getDatabaseDateStr());

        let xml = new XMLHttpRequest();
        xml.open("GET", requestURL);

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send();
    })
}

export async function getJSONResponseWordsCountByCustomerIdAndWordStatusCode(customerId, wordStatusCode) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_WORDS_COUNT_BY_CUSTOMER_ID_AND_WORD_STATUS_CODE);
        requestURL.searchParams.set("customer_id", customerId);
        requestURL.searchParams.set("word_status_code", wordStatusCode);

        let xml = new XMLHttpRequest();
        xml.open("GET", requestURL);

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send();
    })
}