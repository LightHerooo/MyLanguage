import {
    URL_TO_API
} from "./api_variables.js";

import {
    buildJSONResponseByXml
} from "../utils/json_response_utils.js";

import {
    jsonReplacer
} from "../utils/json_utils.js";

const URL_TO_API_WORD_STATUS_HISTORIES = URL_TO_API + "/word_status_histories";
const URL_TO_API_WORD_STATUS_HISTORIES_BY_WORD_ID =
    URL_TO_API_WORD_STATUS_HISTORIES + "/by_word_id";
const URL_TO_API_WORD_STATUS_HISTORIES_ADD_WORD_STATUS_TO_WORDS_WITHOUT_STATUS =
    URL_TO_API_WORD_STATUS_HISTORIES + "/add_word_status_to_words_without_status";

const URL_TO_API_WORD_STATUS_HISTORIES_FIND = URL_TO_API_WORD_STATUS_HISTORIES + "/find";
const URL_TO_API_WORD_STATUS_HISTORIES_FIND_CURRENT_BY_WORD_ID =
    URL_TO_API_WORD_STATUS_HISTORIES_FIND + "/current_by_word_id";

export async function getJSONResponseWordStatusHistoryFindCurrentByWordId(wordId) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_WORD_STATUS_HISTORIES_FIND_CURRENT_BY_WORD_ID);
        requestURL.searchParams.set("id", wordId);

        let xml = new XMLHttpRequest();
        xml.open("GET", requestURL);
        xml.responseType = "json";

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }
        xml.send();
    });
}

export async function postJSONResponseAddWordStatusToWordsWithoutStatus(wordStatusCode) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_WORD_STATUS_HISTORIES_ADD_WORD_STATUS_TO_WORDS_WITHOUT_STATUS);
        let jsonStr = JSON.stringify({
            'word_status_code': wordStatusCode
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

export async function getJSONResponseAllWordStatusHisoriesByWordId(wordId) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_WORD_STATUS_HISTORIES_BY_WORD_ID);
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

