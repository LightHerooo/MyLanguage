import {
    URL_TO_API
} from "./api_variables.js";

import {
    buildJSONResponseByXml
} from "../utils/json_response_utils.js";
import {
    jsonReplacer,
    jsonReviver
} from "../utils/json_utils.js";

const URL_TO_API_CUSTOMER_COLLECTIONS = URL_TO_API + "/customer_collections";
const URL_TO_API_CUSTOMER_COLLECTIONS_BY_CUSTOMER_ID = URL_TO_API_CUSTOMER_COLLECTIONS + "/by_customer_id";
const URL_TO_API_CUSTOMER_COLLECTIONS_ADD_SEVERAL = URL_TO_API_CUSTOMER_COLLECTIONS + "/add_several";
const URL_TO_API_CUSTOMER_COLLECTIONS_COPY_BY_KEY = URL_TO_API_CUSTOMER_COLLECTIONS + "/copy_by_key";
const URL_TO_API_CUSTOMER_COLLECTIONS_COUNT_BY_CUSTOMER_ID =
    URL_TO_API_CUSTOMER_COLLECTIONS + "/count_by_customer_id";
const URL_TO_API_CUSTOMER_COLLECTIONS_COUNT_BY_CUSTOMER_ID_AND_LANG_CODE =
    URL_TO_API_CUSTOMER_COLLECTIONS + "/count_by_customer_id_and_lang_code";


const URL_TO_API_CUSTOMER_COLLECTIONS_FIND = URL_TO_API_CUSTOMER_COLLECTIONS + "/find";
const URL_TO_API_CUSTOMER_COLLECTIONS_FIND_BY_KEY =
    URL_TO_API_CUSTOMER_COLLECTIONS_FIND + "/by_key";
const URL_TO_API_CUSTOMER_COLLECTIONS_FIND_BY_CUSTOMER_ID_AND_TITLE =
    URL_TO_API_CUSTOMER_COLLECTIONS_FIND + "/by_customer_id_and_title";
const URL_TO_API_CUSTOMER_COLLECTIONS_FIND_BY_CUSTOMER_ID_AND_KEY =
    URL_TO_API_CUSTOMER_COLLECTIONS_FIND + "/by_customer_id_and_key";

export async function getJSONResponseAllCollectionsByCustomerId(customerId) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_CUSTOMER_COLLECTIONS_BY_CUSTOMER_ID);
        requestURL.searchParams.set("id", customerId);

        let xml = new XMLHttpRequest();
        xml.open("GET", requestURL);
        xml.responseType = "json";

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send();
    })
}

export async function getJSONResponseFindCollectionByKey(collectionKey) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_CUSTOMER_COLLECTIONS_FIND_BY_KEY);
        requestURL.searchParams.set("key", collectionKey);

        let xml = new XMLHttpRequest();
        xml.open("GET", requestURL);
        xml.responseType = "json";

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send();
    })
}

export async function getJSONResponseFindCollectionByCustomerIdAndTitle(customerId, title) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_CUSTOMER_COLLECTIONS_FIND_BY_CUSTOMER_ID_AND_TITLE);
        requestURL.searchParams.set("customer_id", customerId);
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

export async function postJSONResponseAddSeveralCollections(newCollectionsArr) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_CUSTOMER_COLLECTIONS_ADD_SEVERAL);
        let jsonStr = JSON.stringify({
            'customer_collections': []
        }, jsonReplacer);

        let jsonObj = JSON.parse(jsonStr, jsonReviver);
        for (let i = 0; i < newCollectionsArr.length; i++) {
            let title = newCollectionsArr[i][0];
            let lang_code = newCollectionsArr[i][1];

            jsonObj['customer_collections'].push({title, lang_code});
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

export async function postJSONResponseCopyCollectionByKey(title, key) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_CUSTOMER_COLLECTIONS_COPY_BY_KEY);
        let jsonStr = JSON.stringify({
            'title': title,
            'key': key
        }, jsonReplacer);

        let xml = new XMLHttpRequest();
        xml.open("POST", requestURL);
        xml.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send(jsonStr);
    })
}

export async function getJSONResponseCountOfCollectionsByCustomerId(customerId) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_CUSTOMER_COLLECTIONS_COUNT_BY_CUSTOMER_ID);
        requestURL.searchParams.set("customer_id", customerId);

        let xml = new XMLHttpRequest();
        xml.open("GET", requestURL);
        xml.responseType = "json";

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send();
    })
}

export async function getJSONResponseCountOfCollectionsByCustomerIdAndLangCode(customerId, langCode) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_CUSTOMER_COLLECTIONS_COUNT_BY_CUSTOMER_ID_AND_LANG_CODE);
        requestURL.searchParams.set("customer_id", BigInt(customerId));

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

export async function getJSONResponseFindCollectionByCustomerIdAndKey(customerId, collectionKey) {
    return new Promise(resolve => {
        let requestURL = new URL(URL_TO_API_CUSTOMER_COLLECTIONS_FIND_BY_CUSTOMER_ID_AND_KEY);
        requestURL.searchParams.set("customer_id", BigInt(customerId));
        requestURL.searchParams.set("key", collectionKey);

        let xml = new XMLHttpRequest();
        xml.open("GET", requestURL);
        xml.responseType = "json";

        xml.onload = function () {
            resolve(buildJSONResponseByXml(xml));
        }

        xml.send();
    })
}



