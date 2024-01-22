import {
    URL_TO_API
} from "./variables.js";

import {
    buildJSONResponseByXml
} from "../utils/json_response_utils.js";

import {
    jsonReplacer, jsonReviver
} from "../utils/json_utils.js";

import {
    DateElements
} from "../classes/date_elements.js";

const URL_TO_API_WORDS = URL_TO_API + "/words";
const URL_TO_API_WORDS_FILTERED_PAGINATION = URL_TO_API_WORDS + "/filtered_pagination";
const URL_TO_API_WORDS_CUSTOMER_WORDS_FILTERED_PAGINATION =
    URL_TO_API_WORDS + "/customer_words_filtered_pagination";
const URL_TO_API_WORDS_ADD_SEVERAL = URL_TO_API_WORDS + "/add_several";
const URL_TO_API_WORDS_EDIT = URL_TO_API_WORDS + "/edit";
const URL_TO_API_WORDS_DELETE_ALL_UNCLAIMED_WORDS = URL_TO_API_WORDS + "/delete_all_unclaimed_words";
const URL_TO_API_WORDS_COUNT_BY_WORD_STATUS_CODE = URL_TO_API_WORDS + "/count_by_word_status_code";
const URL_TO_API_WORDS_COUNT_BY_DATE_OF_CREATE = URL_TO_API_WORDS + "/count_by_date_of_create";
const URL_TO_API_WORDS_COUNT_BY_CUSTOMER_ID_AND_WORD_STATUS_CODE =
    URL_TO_API_WORDS + "/count_by_customer_id_and_word_status_code";

const URL_TO_API_WORDS_VALIDATE = URL_TO_API_WORDS + "/validate";
const URL_TO_API_WORDS_VALIDATE_IS_IT_POSSIBLE_TO_ADD_WORD =
    URL_TO_API_WORDS_VALIDATE + "/is_it_possible_to_add_word";

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

export async function postJSONResponseAddSeveralWords(wordRequestDTOs) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_WORDS_ADD_SEVERAL);

        let newWordJsons = [];
        for (let i = 0; i < wordRequestDTOs.length; i++) {
            let wordRequestDTO = wordRequestDTOs[i];
            let newWordJsonStr = JSON.stringify({
                'title': wordRequestDTO.title,
                'lang_code': wordRequestDTO.langCode,
                'part_of_speech_code': wordRequestDTO.partOfSpeechCode
            })

            newWordJsons.push(JSON.parse(newWordJsonStr));
        }

        let jsonStr = JSON.stringify({
            'words': newWordJsons
        }, jsonReplacer);

        let xml = new XMLHttpRequest();
        xml.open("POST", requestURL);
        xml.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xml.responseType = "json";

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
        xml.responseType = "json";

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
        xml.responseType = "json";

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send(jsonStr);
    })
}

export async function getJSONResponseWordsCountByWordStatusCode(wordStatusCode) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_WORDS_COUNT_BY_WORD_STATUS_CODE);
        requestURL.searchParams.set("word_status_code", wordStatusCode);

        let xml = new XMLHttpRequest();
        xml.open("GET", requestURL);
        xml.responseType = "json";

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
        xml.responseType = "json";

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
        xml.responseType = "json";

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send();
    })
}

export async function getJSONResponseValidateIsItPossibleToAddWord(title, langCode, partOfSpeechCode) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_WORDS_VALIDATE_IS_IT_POSSIBLE_TO_ADD_WORD);
        requestURL.searchParams.set("title", title);
        requestURL.searchParams.set("lang_code", langCode);
        requestURL.searchParams.set("part_of_speech_code", partOfSpeechCode);

        let xml = new XMLHttpRequest();
        xml.open("GET", requestURL);
        xml.responseType = "json";

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send();
    })
}