import {
    URL_TO_API
} from "./variables.js";

import {
    buildJSONResponseByXml
} from "../utils/json_response_utils.js";

const URL_TO_API_CUSTOMERS = URL_TO_API + "/customers";

const URL_TO_API_CUSTOMERS_FIND = URL_TO_API_CUSTOMERS + "/find";

const URL_TO_API_CUSTOMERS_FIND_EXISTS = URL_TO_API_CUSTOMERS_FIND + "/exists";
const URL_TO_API_CUSTOMERS_FIND_EXISTS_BY_LOGIN = URL_TO_API_CUSTOMERS_FIND_EXISTS + "/by_login";
const URL_TO_API_CUSTOMERS_FIND_EXISTS_BY_EMAIL = URL_TO_API_CUSTOMERS_FIND_EXISTS + "/by_email";
const URL_TO_API_CUSTOMERS_FIND_EXISTS_BY_NICKNAME = URL_TO_API_CUSTOMERS_FIND_EXISTS + "/by_nickname";

export async function getJSONResponseFindExistsByLogin(login) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_CUSTOMERS_FIND_EXISTS_BY_LOGIN);
        requestURL.searchParams.set("login", login);

        let xml = new XMLHttpRequest();
        xml.open("GET", requestURL);
        xml.responseType = "json";

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send();
    })
}

export async function getJSONResponseFindExistsByEmail(email) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_CUSTOMERS_FIND_EXISTS_BY_EMAIL);
        requestURL.searchParams.set("email", email);

        let xml = new XMLHttpRequest();
        xml.open("GET", requestURL);
        xml.responseType = "json";

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send();
    })
}

export async function getJSONResponseFindExistsByNickname(nickname) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_CUSTOMERS_FIND_EXISTS_BY_NICKNAME);
        requestURL.searchParams.set("nickname", nickname);

        let xml = new XMLHttpRequest();
        xml.open("GET", requestURL);
        xml.responseType = "json";

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send();
    })
}
