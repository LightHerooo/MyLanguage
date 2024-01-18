import {
    changeRuleStatus,
    getOrCreateRule} from "./div_rules.js";

import {
    getGlobalCookie
} from "./global_cookie_utils.js";

import {
    GlobalCookies
} from "../classes/global_cookies.js";

import {
    getJSONResponseFindCollectionByCustomerIdAndTitle
} from "../api/customer_collections.js";

import {
    getJSONResponseValidateIsItPossibleToAddWord
} from "../api/words.js";

import {
    HttpStatuses
} from "../classes/http_statuses.js";

import {
    CustomResponseMessage
} from "../dto/other/custom_response_message.js";

const _HTTP_STATUSES = new HttpStatuses();
const _GLOBAL_COOKIES = new GlobalCookies();

export async function checkCorrectCustomerCollectionTitle(tbTitle, divRuleId, timerObject, timerMilliseconds) {
    const PARENT_ID = tbTitle.parentNode.id;

    const TITLE_MIN_SIZE = 3;
    const TITLE_MAX_SIZE = 30;

    let isCorrect = true;
    let divRuleElement = getOrCreateRule(divRuleId);
    let inputText = tbTitle.value.trim();

    clearTimeout(timerObject.id);
    if (!inputText) {
        isCorrect = false;
        divRuleElement.textContent = "Название не может быть пустым.";
        changeRuleStatus(divRuleElement, PARENT_ID, isCorrect);
    } else if (inputText.length < TITLE_MIN_SIZE || inputText.length > TITLE_MAX_SIZE) {
        isCorrect = false;
        divRuleElement.textContent = `Название должно быть быть от ${TITLE_MIN_SIZE} до ${TITLE_MAX_SIZE} символов.`;
        changeRuleStatus(divRuleElement, PARENT_ID, isCorrect);
    } else {
        changeRuleStatus(divRuleElement, PARENT_ID, true);

        let authId = getGlobalCookie(_GLOBAL_COOKIES.AUTH_ID);
        let JSONResponsePromise = new Promise(resolve => {
            timerObject.id = setTimeout(async function () {
                resolve(await getJSONResponseFindCollectionByCustomerIdAndTitle(authId, inputText));
            }, timerMilliseconds);
        });

        let JSONResponse = await JSONResponsePromise;
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            isCorrect = false;

            divRuleElement.textContent = "У вас уже есть коллекция с таким названием.";
            changeRuleStatus(divRuleElement, PARENT_ID, isCorrect);
        } else {
            isCorrect = true;
            changeRuleStatus(divRuleElement, PARENT_ID, isCorrect);
        }
    }

    return isCorrect;
}

export async function checkCorrectWordTitle(tbTitle, langCode, partOfSpeechCode,
                                            divRuleId, timerObject, timerMilliseconds) {
    const PARENT_ID = tbTitle.parentNode.id;

    const TITLE_MAX_SIZE = 44;
    const TITLE_REGEXP = /^[^ ]+$/;

    let isCorrect = true;
    let divRuleElement = getOrCreateRule(divRuleId);
    let inputText = tbTitle.value.trim();

    clearTimeout(timerObject.id);
    if (!inputText) {
        isCorrect = false;
        divRuleElement.textContent = "Слово не может быть пустым.";
        changeRuleStatus(divRuleElement, PARENT_ID, isCorrect);
    } else if (!TITLE_REGEXP.test(inputText)) {
        isCorrect = false;
        divRuleElement.textContent = "Слово не должно содержать пробелов.";
        changeRuleStatus(divRuleElement, PARENT_ID, isCorrect);
    } else if (inputText.length > TITLE_MAX_SIZE) {
        isCorrect = false;
        divRuleElement.textContent = `Слово должно быть не более ${TITLE_MAX_SIZE} символов.`;
        changeRuleStatus(divRuleElement, PARENT_ID, isCorrect);
    } else {
        changeRuleStatus(divRuleElement, PARENT_ID, true);

        let JSONResponsePromise = new Promise(resolve => {
            timerObject.id = setTimeout(async function () {
                resolve(await getJSONResponseValidateIsItPossibleToAddWord(inputText, langCode, partOfSpeechCode));
            }, timerMilliseconds);
        });

        let JSONResponse = await JSONResponsePromise;
        if (JSONResponse.status !== _HTTP_STATUSES.OK) {
            isCorrect = false;

            let message = new CustomResponseMessage(JSONResponse.json);
            divRuleElement.textContent = message.text;
        } else {
            isCorrect = true;
        }

        changeRuleStatus(divRuleElement, PARENT_ID, isCorrect);
    }

    return isCorrect;
}