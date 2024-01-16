import { URL_TO_API } from "./api_variables.js";

import {
    buildJSONResponseByXml
} from "../utils/json_response_utils.js";

const URL_TO_API_LANGS = URL_TO_API + "/langs";

const URL_TO_API_LANGS_FIND = URL_TO_API_LANGS + "/find";
const URL_TO_API_LANGS_FIND_BY_CODE = URL_TO_API_LANGS_FIND + "/by_code";

export async function getJSONResponseAllLangs() {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_LANGS);

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

export async function getJSONResponseFindLangByCode(code) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_LANGS_FIND_BY_CODE);
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


