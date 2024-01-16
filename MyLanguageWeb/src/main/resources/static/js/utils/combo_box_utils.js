import {
    getJSONResponseAllPartsOfSpeech,
    getJSONResponseFindPartOfSpeechByCode
} from "../api/parts_of_speech.js";

import {
    getJSONResponseAllLangs,
    getJSONResponseFindLangByCode
} from "../api/langs.js";

import {
    getJSONResponseAllCollectionsByCustomerId,
    getJSONResponseFindCollectionByKey,
} from "../api/customer_collections.js";

import {
    GlobalCookies
} from "../classes/global_cookies.js";

import {
    getGlobalCookie
} from "./global_cookie_utils.js";

import {
    HttpStatuses
} from "../classes/http_statuses.js";

import {
    changeRuleStatus,
    getOrCreateRule
} from "./div_rules.js";

import {
    getJSONResponseAllWordStatuses
} from "../api/word_statuses.js";

import {
    setFlag
} from "./flag_icons_utils.js";

const _HTTP_STATUSES = new HttpStatuses();
const _GLOBAL_COOKIES = new GlobalCookies();


export function getSelectedOption(cbElementId) {
    let cbElement = document.getElementById(cbElementId);
    if (cbElement != null) {
        if (cbElement.selectedIndex > -1) {
            return cbElement.options[cbElement.selectedIndex];
        }
    }

    return null;
}
// Получение Id выделенного элемента списка
export function getSelectedOptionId(cbElementId) {
    let selectedOption = getSelectedOption(cbElementId);
    if (selectedOption != null) {
        return selectedOption.id;
    }

    return null;
}

// Изменение выделенного элемента списка по Id
export function changeSelectedOptionById(cbElementId, optionElementId) {
    let cbElement = document.getElementById(cbElementId);
    if (cbElement != null) {
        for (let i = 0; i < cbElement.options.length; i++) {
            if (cbElement.options[i].id === optionElementId) {
                cbElement.selectedIndex = i;
                break;
            }
        }
    }
}

// Изменение выделенного элемента списка по индексу
export function changeSelectedOptionByIndex(cbElementId, index) {
    let cbElement = document.getElementById(cbElementId);
    if (cbElement != null) {
        cbElement.selectedIndex = index;
    }
}

// Заполнение списка "Части речи"
export async function fillCbPartsOfSpeech(cbPartsOfSpeechElement) {
    let JSONResponse = await getJSONResponseAllPartsOfSpeech();
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        let json = JSONResponse.json;
        for (let i = 0; i < json.length; i++) {
            let jsonItem = json[i];

            let option = document.createElement("option");
            option.textContent = jsonItem["title"];
            option.id = jsonItem["code"];

            cbPartsOfSpeechElement.appendChild(option);
        }
    }
}

// Заполнение списка "Языки"
export async function fillCbLangs(cbLangsElement) {
    let jsonResponse = await getJSONResponseAllLangs();
    if (jsonResponse.status === _HTTP_STATUSES.OK) {
        let json = jsonResponse.json;
        for (let i = 0; i < json.length; i++) {
            let jsonItem = json[i];

            let option = document.createElement("option");
            option.id = jsonItem["code"];
            option.textContent = jsonItem["title"];
            option.value = "RU";

            cbLangsElement.appendChild(option);
        }
    }
}

// Заполнение списка "Коллекции пользователя"
export async function fillCbCustomerCollections(cbCustomerCollectionsElement) {
    let authId = getGlobalCookie(_GLOBAL_COOKIES.AUTH_ID);
    let JSONResponse = await getJSONResponseAllCollectionsByCustomerId(authId);
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        let json = JSONResponse.json;
        for (let i = 0; i < json.length; i++) {
            let jsonItem = json[i];

            let option = document.createElement("option");
            option.textContent = jsonItem["title"];
            option.id = jsonItem["key"];

            cbCustomerCollectionsElement.appendChild(option);
        }
    }
}

export async function fillCbWordStatuses(cbWordStatusesElement) {
    let jsonResponse = await getJSONResponseAllWordStatuses();
    if (jsonResponse.status === _HTTP_STATUSES.OK) {
        let json = jsonResponse.json;
        for (let i = 0; i < json.length; i++) {
            let jsonItem = json[i];

            let option = document.createElement("option");
            option.style.color = "#" + jsonItem['color_hex_code'];
            option.textContent = jsonItem["title"];
            option.id = jsonItem["code"];

            cbWordStatusesElement.appendChild(option);
        }

        cbWordStatusesElement.addEventListener("change", function () {
            let selectedOption = getSelectedOption(this.id);
            this.style.backgroundColor = selectedOption.style.color;
        })
    }
}

export async function changeCbLangsEnabledByCbCustomerCollectionKey(customerCollectionKey, cbLangsId) {
    let JSONResponse = await getJSONResponseFindCollectionByKey(customerCollectionKey);
    let customerCollectionLangCode = null;
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        let json = JSONResponse.json;
        let lang = json["lang"];
        if (lang) {
            customerCollectionLangCode = lang["code"];
        }
    }

    let cbLangs = document.getElementById(cbLangsId);
    if (customerCollectionLangCode) {
        changeSelectedOptionById(cbLangs.id, customerCollectionLangCode);
        cbLangs.disabled = true;
    } else {
        changeSelectedOptionByIndex(cbLangs.id, 0);
        cbLangs.disabled = false;
    }
}

export async function checkCorrectCbLangs(cbLangs, divRuleId) {
    const PARENT_ID = cbLangs.parentElement.id;

    let isCorrect = true;
    let divRuleElement = getOrCreateRule(divRuleId);
    let langCode = getSelectedOptionId(cbLangs.id);

    let JSONResponse = await getJSONResponseFindLangByCode(langCode);
    if (JSONResponse.status !== _HTTP_STATUSES.OK) {
        isCorrect = false;
        divRuleElement.textContent = JSONResponse.json["text"];
    }

    changeRuleStatus(divRuleElement, PARENT_ID, isCorrect);
    return isCorrect;
}

export async function checkCorrectCbPartsOfSpeech(cbPartsOfSpeech, divRuleId) {
    const PARENT_ID = cbPartsOfSpeech.parentElement.id;

    let isCorrect = true;
    let divRuleElement = getOrCreateRule(divRuleId);
    let partOfSpeechCode = getSelectedOptionId(cbPartsOfSpeech.id);
    let JSONResponse = await getJSONResponseFindPartOfSpeechByCode(partOfSpeechCode);
    if (JSONResponse.status !== _HTTP_STATUSES.OK) {
        isCorrect = false;
        divRuleElement.textContent = JSONResponse.json["text"];
    }

    changeRuleStatus(divRuleElement, PARENT_ID, isCorrect);
    return isCorrect;
}

