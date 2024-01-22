import {
    URL_TO_API
} from "./variables.js";

import {
    buildJSONResponseByXml
} from "../utils/json_response_utils.js";

const URL_TO_API_PARTS_OF_SPEECH = URL_TO_API + "/parts_of_speech";

const URL_TO_API_PARTS_OF_SPEECH_FIND = URL_TO_API_PARTS_OF_SPEECH + "/find";
const URL_TO_API_PARTS_OF_SPEECH_FIND_BY_CODE = URL_TO_API_PARTS_OF_SPEECH_FIND + "/by_code";

export async function getJSONResponseAllPartsOfSpeech() {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_PARTS_OF_SPEECH);

        // Отправляем запрос на сервер
        let xml = new XMLHttpRequest();
        xml.open("GET", requestURL);
        xml.responseType = "json";

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send();
    });
}

export async function getJSONResponseFindPartOfSpeechByCode(code) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_PARTS_OF_SPEECH_FIND_BY_CODE);
        requestURL.searchParams.set("code", code);

        // Отправляем запрос на сервер
        let xml = new XMLHttpRequest();
        xml.open("GET", requestURL);
        xml.responseType = "json";

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send();
    })
}

