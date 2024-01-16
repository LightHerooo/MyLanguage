import {
    URL_TO_API
} from "./api_variables.js";

import {
    buildJSONResponseByXml
} from "../utils/json_response_utils.js";

const URL_TO_API_WORD_STATUSES = URL_TO_API + "/word_statuses";

export async function getJSONResponseAllWordStatuses() {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_WORD_STATUSES);

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