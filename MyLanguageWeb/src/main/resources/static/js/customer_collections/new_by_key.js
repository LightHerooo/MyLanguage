import {
    checkCorrectCustomerCollectionTitle
} from "../utils/text_box_utils.js";

import {
    changeRuleStatus,
    getOrCreateRule
} from "../utils/div_rules.js";

import {
    getJSONResponseFindCollectionByKey,
    postJSONResponseCopyCollectionByKey
} from "../api/customer_collections.js";

import {
    Timer
} from "../classes/timer.js";

import {
    HttpStatuses
} from "../classes/http_statuses.js";

import {
    changeCbLangsEnabledByCbCustomerCollectionKey,
    fillCbLangs,
    fillCbPartsOfSpeech, getSelectedOptionId
} from "../utils/combo_box_utils.js";

import {
    getJSONResponseAllWordsInCollectionFilteredPagination
} from "../api/words_in_collection.js";

import {
    createSpanLangWithFlag
} from "../utils/flag_icons_utils.js";

import {
    createBtnShowMore,
    removeBtnShowMore
} from "../utils/btn_utils.js";

import {
    findInTableWithTimers,
    setMessageInsideTable
} from "../utils/table_utils.js";

import {
    showCollectionInfo
} from "../utils/word_table_utils.js";

import {
    CssMain
} from "../classes/css/css_main.js";


const _CSS_MAIN = new CssMain();
const _HTTP_STATUSES = new HttpStatuses();

const _BAD_MESSAGE_FOR_COLLECTION_INFO_STYLE_ID = "bad-message-for-collection-info";

const _TB_TITLE_ID = "tb_title";
const _TB_KEY_ID = "tb_key";
const _SUBMIT_SEND_ID = "submit_send";
const _BTN_SEND = "btn_send";
const _DIV_SEND_NEW_COLLECTION_BY_KEY_INFO_ID = "send_new_collection_by_key_info";
const _DIV_COLLECTION_INFO_ID = "div_collection_info";
const _TB_FINDER_ID = "tb_finder";
const _CB_LANGS_ID = "cb_langs";
const _CB_PARTS_OF_SPEECH_ID = "cb_parts_of_speech";
const _COLLECTION_WORD_LIST_CONTAINER_ID = "collection_word_list_container";
const _COLLECTION_WORD_TABLE_HEAD_ID = "collection_word_table_head";
const _COLLECTION_WORD_TABLE_BODY_ID = "collection_word_table_body";
const _BTN_REFRESH_ID = "btn_refresh";

const _BTN_SHOW_MORE_ID = "btn_show_more";

const _NUMBER_OF_WORDS = 20;
let _lastWordNumberInList = 0;
let _lastWordInCollectionIdOnPreviousPage = 0n;

const _T_CHECKER_MILLISECONDS = 250;
let _tChecker = new Timer(null);
let _tWaiter = new Timer(null);
let _tFinder = new Timer(null);

window.onload = async function () {
    prepareTbTitle();
    prepareTbKey();
    prepareSubmitSend();

    await prepareCbLangs();
    await prepareCbPartsOfSpeech();

    let collectionKey = document.getElementById(_TB_KEY_ID).value;
    await changeCbLangsEnabledByCbCustomerCollectionKey(collectionKey, _CB_LANGS_ID);

    prepareTbFinder();
    prepareBtnRefresh();

    await tryToFillCollectionWordListTable();
}

function waiter() {
    removeBtnShowMore(_BTN_SHOW_MORE_ID);
    let tableHead = document.getElementById(_COLLECTION_WORD_TABLE_HEAD_ID);
    let tableBody = document.getElementById(_COLLECTION_WORD_TABLE_BODY_ID);
    setMessageInsideTable(tableHead, tableBody, "Идёт поиск...", true);
}

function prepareTbTitle() {
    let tbTitle = document.getElementById(_TB_TITLE_ID);
    if (tbTitle != null) {
        tbTitle.addEventListener("input", async function() {
            changeSendNewCollectionByKeyInfoRule(null, true);
            await checkCorrectTitle();
        });
    }
}

function prepareTbKey() {
    let tbTitle = document.getElementById(_TB_KEY_ID);
    if (tbTitle != null) {
        tbTitle.addEventListener("input", async function() {
            changeSendNewCollectionByKeyInfoRule(null, true);
            await checkCorrectKey();

            let collectionKey = document.getElementById(_TB_KEY_ID).value;
            await changeCbLangsEnabledByCbCustomerCollectionKey(collectionKey, _CB_LANGS_ID);

            await tryToFillCollectionWordListTable();
        });
    }
}

function prepareSubmitSend() {
    let submitSend = document.getElementById(_SUBMIT_SEND_ID);
    let btnSend = document.getElementById(_BTN_SEND);
    if (submitSend != null) {
        submitSend.addEventListener("submit", async function(event) {
            btnSend.disabled = true;
            event.preventDefault();

            if (await checkBeforeSend() && await sendNewCollectionByKey()) {
                submitSend.submit();
            }

            btnSend.disabled = false;
        });
    }
}

async function checkCorrectTitle() {
    let tbTitle = document.getElementById(_TB_TITLE_ID);
    const DIV_RULE_ID = tbTitle.id + "_div_rule";

    return await checkCorrectCustomerCollectionTitle(tbTitle, DIV_RULE_ID, _tChecker, _T_CHECKER_MILLISECONDS);
}

async function checkCorrectKey() {
    let tbKey = document.getElementById(_TB_KEY_ID);
    const DIV_RULE_ID = tbKey.id + "_div_rule";
    const PARENT_ID = tbKey.parentElement.id;

    let isCorrect = true;
    let divRuleElement = getOrCreateRule(DIV_RULE_ID);
    let inputText = tbKey.value.trim();

    clearTimeout(_tChecker.id);
    if (!inputText) {
        isCorrect = false;
        divRuleElement.textContent = "Ключ не может быть пустым.";
        changeRuleStatus(divRuleElement, PARENT_ID, isCorrect);
    } else {
        changeRuleStatus(divRuleElement, PARENT_ID, true);

        let JSONResponsePromise = new Promise(resolve => {
            _tChecker.id = setTimeout(async function () {
                resolve(await getJSONResponseFindCollectionByKey(inputText));
            }, _T_CHECKER_MILLISECONDS);
        });

        let JSONResponse = await JSONResponsePromise;
        if (JSONResponse.status !== _HTTP_STATUSES.OK) {
            isCorrect = false;
            divRuleElement.textContent = "Коллекции с таким ключом не существует.";
            changeRuleStatus(divRuleElement, PARENT_ID, isCorrect);
        } else {
            isCorrect = true;
            changeRuleStatus(divRuleElement, PARENT_ID, isCorrect);
        }
    }

    return isCorrect;
}

async function checkBeforeSend() {
    let isKeyCorrect = await checkCorrectKey();
    let isTitleCorrect = await checkCorrectTitle();

    return isKeyCorrect && isTitleCorrect;
}

async function sendNewCollectionByKey() {
    let isCorrect = true;

    let title = document.getElementById(_TB_TITLE_ID).value;
    let key = document.getElementById(_TB_KEY_ID).value;
    let JSONResponse = await postJSONResponseCopyCollectionByKey(title, key);
    if (JSONResponse.status !== _HTTP_STATUSES.OK) {
        isCorrect = false;
        changeSendNewCollectionByKeyInfoRule(JSONResponse.json["text"], isCorrect);
    } else {
        isCorrect = true;
        changeSendNewCollectionByKeyInfoRule(null, isCorrect);
    }

    return isCorrect;
}

function changeSendNewCollectionByKeyInfoRule(text, isRuleCorrect) {
    let divRuleElement =
        getOrCreateRule(_DIV_SEND_NEW_COLLECTION_BY_KEY_INFO_ID + "_div_rule");
    divRuleElement.textContent = text;
    changeRuleStatus(divRuleElement, _DIV_SEND_NEW_COLLECTION_BY_KEY_INFO_ID, isRuleCorrect);
}

// Подготовка поля "Поиск"
function prepareTbFinder() {
    let tbFinder = document.getElementById(_TB_FINDER_ID);

    if (tbFinder != null) {
        tbFinder.addEventListener("input", async function () {
           findInTableWithTimers(_tWaiter, _tFinder, waiter, tryToFillCollectionWordListTable);
        });
    }
}

// Подготовка выпадающего списка "Языки"
async function prepareCbLangs() {
    let cbLangs = document.getElementById(_CB_LANGS_ID);
    if (cbLangs != null) {
        let firstOption = document.createElement("option");
        firstOption.textContent = "Все";
        cbLangs.appendChild(firstOption);

        await fillCbLangs(cbLangs);
        cbLangs.addEventListener("change", function () {
           findInTableWithTimers(_tWaiter, _tFinder, waiter, tryToFillCollectionWordListTable);
        })
    }
}

// Подготовка выпадающего списка "Части речи"
async function prepareCbPartsOfSpeech() {
    let cbPartsOfSpeech = document.getElementById(_CB_PARTS_OF_SPEECH_ID);
    if (cbPartsOfSpeech != null) {
        let firstOption = document.createElement("option");
        firstOption.textContent = "Все";
        cbPartsOfSpeech.appendChild(firstOption);

        await fillCbPartsOfSpeech(cbPartsOfSpeech);
        cbPartsOfSpeech.addEventListener("change", function () {
            findInTableWithTimers(_tWaiter, _tFinder, waiter, tryToFillCollectionWordListTable);
        });
    }
}

function prepareBtnRefresh() {
    let btnRefresh = document.getElementById(_BTN_REFRESH_ID);
    if (btnRefresh != null) {
        btnRefresh.addEventListener("click", async function() {
            btnRefresh.disabled = true;
            findInTableWithTimers(_tWaiter, _tFinder, waiter, tryToFillCollectionWordListTable);
            btnRefresh.disabled = false;
        })
    }
}

// Очистка таблицы
function clearData() {

}

// Подготавливаем GET-запрос и получаем ответ
async function getPreparedJSONResponseAllWordsInCollectionFilteredPagination() {
    let customerCollectionKey = document.getElementById(_TB_KEY_ID).value;
    let tbFinderValue = document.getElementById(_TB_FINDER_ID).value;
    let cbPartsOfSpeechValue = getSelectedOptionId(_CB_PARTS_OF_SPEECH_ID);
    let cbLangCodeValue = getSelectedOptionId(_CB_LANGS_ID);

    return await getJSONResponseAllWordsInCollectionFilteredPagination(tbFinderValue,
        _NUMBER_OF_WORDS, BigInt(_lastWordInCollectionIdOnPreviousPage), customerCollectionKey,
        cbPartsOfSpeechValue, cbLangCodeValue);
}

async function tryToFillCollectionWordListTable() {
    _lastWordNumberInList = 0;
    _lastWordInCollectionIdOnPreviousPage = 0n;

    let readyToFill = true;
    let badRequestText = null;

    // Проверяем, существует ли коллекция с таким ключом
    let collectionKey = document.getElementById(_TB_KEY_ID).value;
    let JSONResponse = await getJSONResponseFindCollectionByKey(collectionKey);
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        let divCollectionInfo = document.getElementById(_DIV_COLLECTION_INFO_ID);
        divCollectionInfo.replaceChildren();

        await showCollectionInfo(_DIV_COLLECTION_INFO_ID, collectionKey);
    } else {
        readyToFill = false;
        badRequestText = "Введите корректный ключ коллекции, чтобы увидеть информацию о ней.";

        let divCollectionInfo = document.getElementById(_DIV_COLLECTION_INFO_ID);
        divCollectionInfo.replaceChildren();

        let divBadMessageForCollectionInfo = document.createElement("div");
        divBadMessageForCollectionInfo.classList.add(_BAD_MESSAGE_FOR_COLLECTION_INFO_STYLE_ID);
        divBadMessageForCollectionInfo.classList.add(_CSS_MAIN.DIV_BLOCK_INFO_STANDARD_STYLE_ID);
        divBadMessageForCollectionInfo.textContent = badRequestText;
        divCollectionInfo.appendChild(divBadMessageForCollectionInfo);
    }

    // Получаем JSON для заполнения таблицы ---
    let allWordsInCollectionFilteredPagination = null;
    if (readyToFill) {
        let JSONResponse = await getPreparedJSONResponseAllWordsInCollectionFilteredPagination();
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            allWordsInCollectionFilteredPagination = JSONResponse.json;
        } else {
            readyToFill = false;
            badRequestText = JSONResponse.json["text"];
        }
    }
    //---

    // Чистим таблицу ---
    removeBtnShowMore(_BTN_SHOW_MORE_ID);
    let tableBody = document.getElementById(_COLLECTION_WORD_TABLE_BODY_ID);
    tableBody.replaceChildren();
    //---

    if (readyToFill) {
        // Заполняем таблицу
        await fillCollectionWordListTable(allWordsInCollectionFilteredPagination);
    } else {
        // Выводим сообщение об ошибке
        let tableHead = document.getElementById(_COLLECTION_WORD_TABLE_HEAD_ID);
        let tableBody = document.getElementById(_COLLECTION_WORD_TABLE_BODY_ID);
        setMessageInsideTable(tableHead, tableBody, badRequestText, true);
    }
}

async function fillCollectionWordListTable(allWordsInCollectionFilteredPaginationJson) {
    let tableBody = document.getElementById(_COLLECTION_WORD_TABLE_BODY_ID);
    for (let i = 0; i < allWordsInCollectionFilteredPaginationJson.length; i++) {
        let item = allWordsInCollectionFilteredPaginationJson[i];

        let row = document.createElement("tr");
        let numberColumn = document.createElement("td");
        let titleColumn = document.createElement("td");
        let langColumn = document.createElement("td");
        let partOfSpeechColumn = document.createElement("td");

        numberColumn.textContent = `${++_lastWordNumberInList}.`;
        numberColumn.style.textAlign = "center";
        titleColumn.textContent = item["word"]["title"];
        partOfSpeechColumn.textContent = item["word"]["part_of_speech"]["title"];

        // Язык ---
        let langJSON = item["word"]["lang"];
        let spanLangFlagWithTitle = createSpanLangWithFlag(langJSON);
        langColumn.appendChild(spanLangFlagWithTitle);
        //---

        row.appendChild(numberColumn);
        row.appendChild(titleColumn);
        row.appendChild(langColumn);
        row.appendChild(partOfSpeechColumn);

        tableBody.appendChild(row);

        // Получаем id последнего элемента JSON-коллекции
        if (i === allWordsInCollectionFilteredPaginationJson.length - 1) {
            _lastWordInCollectionIdOnPreviousPage = item["id"];
        }
    }

    // Создаем кнопку, только если запрос вернул максимальное количество на страницу
    if (allWordsInCollectionFilteredPaginationJson.length === _NUMBER_OF_WORDS) {
        let collectionWordListContainer =
            document.getElementById(_COLLECTION_WORD_LIST_CONTAINER_ID);
        let btnShowMore = createBtnShowMore(_BTN_SHOW_MORE_ID, _NUMBER_OF_WORDS);
        if (collectionWordListContainer != null && btnShowMore != null) {
            btnShowMore.addEventListener("click", async function () {
            let JSONResponse = await getPreparedJSONResponseAllWordsInCollectionFilteredPagination();
                if (JSONResponse.status === _HTTP_STATUSES.OK) {
                    await fillCollectionWordListTable(JSONResponse.json);
                }
            });
            collectionWordListContainer.appendChild(btnShowMore);
        }
    }
}