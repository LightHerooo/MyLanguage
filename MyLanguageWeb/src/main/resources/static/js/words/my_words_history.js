import {
    fillCbLangs,
    fillCbPartsOfSpeech,
    fillCbWordStatuses, getSelectedOptionId
} from "../utils/combo_box_utils.js";

import {
    Timer
} from "../classes/timer.js";

import {
    getGlobalCookie
} from "../utils/global_cookie_utils.js";

import {
    GlobalCookies
} from "../classes/global_cookies.js";

import {
    getJSONResponseCustomerWordsFilteredPagination,
    getJSONResponseWordsCountByCustomerIdAndWordStatusCode,
} from "../api/words.js";

import {
    HttpStatuses
} from "../classes/http_statuses.js";

import {
    findInTableWithTimers,
    setMessageInsideTable
} from "../utils/table_utils.js";

import {
    createDivLangWithFlag
} from "../utils/flag_icons_utils.js";

import {
    buildABtnArrowDown,
    buildABtnArrowUp, buildABtnDisabled,
    createBtnShowMore,
    removeBtnShowMore
} from "../utils/btn_utils.js";

import {
    getJSONResponseAllWordStatusHisoriesByWordId,
    getJSONResponseWordStatusHistoryFindCurrentByWordId
} from "../api/word_status_histories.js";

import {
    createAWordStatus, createDivWordStatusWithCount
} from "../utils/word_status_utils.js";

import {
    CssMain
} from "../classes/css/css_main.js";

import {
    getJSONResponseAllWordStatuses
} from "../api/word_statuses.js";

import {
    DateElements
} from "../utils/date_elements.js";

import {
    WordStatusWithCount,
    compareWordStatusWithCount,
} from "../classes/word_status_with_count.js";

const _CSS_MAIN = new CssMain();
const _HTTP_STATUSES = new HttpStatuses();
const _GLOBAL_COOKIES = new GlobalCookies();

const _MY_WORDS_HISTORY_STATISTICS_CONTAINER_ID = "my_words_history_statistics_container";
const _TB_FINDER_ID = "tb_finder";
const _CB_LANGS_ID = "cb_langs";
const _CB_PARTS_OF_SPEECH_ID = "cb_parts_of_speech";
const _CB_WORD_STATUSES = "cb_word_statuses";
const _MY_WORD_HISTORY_LIST_CONTAINER_ID = "my_word_history_list_container";
const _MY_WORD_HISTORY_TABLE_COLGROUP_ID = "my_word_history_table_colgroup";
const _MY_WORD_HISTORY_TABLE_HEAD_ID = "my_word_history_table_head";
const _MY_WORD_HISTORY_TABLE_BODY_ID = "my_word_history_table_body";
const _BTN_SHOW_MORE_ID = "btn_show_more";
const _BTN_REFRESH_ID = "btn_refresh";

const _NUMBER_OF_WORDS = 20;

let _lastWordNumberInList = 0;
let _lastWordIdOnPreviousPage = 0n;

let _tWaiter = new Timer(null);
let _tFinder = new Timer(null);

window.onload = async function() {
    await prepareCbPartsOfSpeech();
    await prepareCbLangs();
    await prepareCbWordStatuses();
    prepareTbFinder();
    prepareBtnRefresh();

    await tryToFillMyWordHistoryTable();
}

function waiter() {
    removeBtnShowMore(_BTN_SHOW_MORE_ID);
    let tableHead = document.getElementById(_MY_WORD_HISTORY_TABLE_HEAD_ID);
    let tableBody = document.getElementById(_MY_WORD_HISTORY_TABLE_BODY_ID);
    setMessageInsideTable(tableHead, tableBody, "Идёт поиск...", true);
}

function prepareTbFinder() {
    let tbFinder = document.getElementById(_TB_FINDER_ID);

    // Вешаем событие обновления списка при изменении текста
    tbFinder.addEventListener("input", async function () {
        findInTableWithTimers(_tWaiter, _tFinder, waiter, tryToFillMyWordHistoryTable);
    });
}

async function prepareCbLangs() {
    let cbLangs = document.getElementById(_CB_LANGS_ID);
    if (cbLangs != null) {
        let firstOption = document.createElement("option");
        firstOption.textContent = "Все";
        cbLangs.appendChild(firstOption);

        await fillCbLangs(cbLangs);
        // Вешаем событие обновления списка при изменении элемента выпадающего списка
        cbLangs.addEventListener("change", function () {
            findInTableWithTimers(_tWaiter, _tFinder, waiter, tryToFillMyWordHistoryTable);
        })
    }
}

async function prepareCbPartsOfSpeech() {
    let cbPartsOfSpeech = document.getElementById(_CB_PARTS_OF_SPEECH_ID);
    if (cbPartsOfSpeech != null) {
        let firstOption = document.createElement("option");
        firstOption.textContent = "Все";
        cbPartsOfSpeech.appendChild(firstOption);

        await fillCbPartsOfSpeech(cbPartsOfSpeech);
        // Вешаем событие обновления списка при изменении элемента выпадающего списка
        cbPartsOfSpeech.addEventListener("change", function () {
            findInTableWithTimers(_tWaiter, _tFinder, waiter, tryToFillMyWordHistoryTable);
        });
    }
}

async function prepareCbWordStatuses() {
    let cbWordStatuses = document.getElementById(_CB_WORD_STATUSES);
    if (cbWordStatuses != null) {
        let firstOption = document.createElement("option");
        firstOption.textContent = "Все";
        cbWordStatuses.appendChild(firstOption);

        await fillCbWordStatuses(cbWordStatuses);

        cbWordStatuses.addEventListener("change", function () {
            findInTableWithTimers(_tWaiter, _tFinder, waiter, tryToFillMyWordHistoryTable);
        });
    }
}

function prepareBtnRefresh() {
    let btnRefresh = document.getElementById(_BTN_REFRESH_ID);
    if (btnRefresh != null) {
        btnRefresh.addEventListener("click", async function() {
            btnRefresh.disabled = true;
            findInTableWithTimers(_tWaiter, _tFinder, waiter, tryToFillMyWordHistoryTable);
            btnRefresh.disabled = false;
        })
    }
}

// Подготавливаем GET-запрос и получаем ответ
async function getPreparedJSONResponseCustomerWordsFilteredPagination() {
    let customerId = getGlobalCookie(_GLOBAL_COOKIES.AUTH_ID);
    let title = document.getElementById(_TB_FINDER_ID).value;
    let wordStatusCode = getSelectedOptionId(_CB_WORD_STATUSES);
    let partOfSpeechCode =  getSelectedOptionId(_CB_PARTS_OF_SPEECH_ID);
    let langCode =  getSelectedOptionId(_CB_LANGS_ID);

    return await getJSONResponseCustomerWordsFilteredPagination(_NUMBER_OF_WORDS, customerId,
        title, wordStatusCode, partOfSpeechCode, langCode, _lastWordIdOnPreviousPage);
}

async function tryToFillMyWordHistoryTable() {
    _lastWordNumberInList = 0;
    _lastWordIdOnPreviousPage = 0n;

    let readyToFill = true;
    let badRequestText = null;

    // Получаем JSON для заполнения таблицы ---
    let customerWordsFilteredPaginationJson = null;
    let JSONResponse = await getPreparedJSONResponseCustomerWordsFilteredPagination();
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        customerWordsFilteredPaginationJson = JSONResponse.json;
    } else {
        readyToFill = false;
        badRequestText = JSONResponse.json["text"];
    }
    //---

    // Генерируем статистику по словам пользователя, очищаем таблицу ---
    await generateMyWordsHistoryStatistics();

    removeBtnShowMore(_BTN_SHOW_MORE_ID);
    let tableBody = document.getElementById(_MY_WORD_HISTORY_TABLE_BODY_ID);
    tableBody.replaceChildren();
    //---

    if (readyToFill) {
        // Заполняем таблицу
        await fillMyWordHistoryTable(customerWordsFilteredPaginationJson)
    } else {
        // Выводим сообщение об ошибке
        let tableHead = document.getElementById(_MY_WORD_HISTORY_TABLE_HEAD_ID);
        let tableBody = document.getElementById(_MY_WORD_HISTORY_TABLE_BODY_ID);
        setMessageInsideTable(tableHead, tableBody, badRequestText, true);
    }

}

async function fillMyWordHistoryTable(customerWordsFilteredPaginationJson) {
    let tableHead = document.getElementById(_MY_WORD_HISTORY_TABLE_HEAD_ID);
    let tableBody = document.getElementById(_MY_WORD_HISTORY_TABLE_BODY_ID);
    for (let i = 0; i < customerWordsFilteredPaginationJson.length; i++) {
        let item = customerWordsFilteredPaginationJson[i];
        let row = await createWordWithStatusAndActionRow(item, i);
        tableBody.appendChild(row);

        // Получаем id последнего элемента JSON-коллекции
        if (i === customerWordsFilteredPaginationJson.length - 1) {
            _lastWordIdOnPreviousPage = item["id"];
        }
    }

    // Создаем кнопку, только если запрос вернул максимальное количество на страницу
    if (customerWordsFilteredPaginationJson.length === _NUMBER_OF_WORDS) {
        let wordListContainer =
            document.getElementById(_MY_WORD_HISTORY_LIST_CONTAINER_ID);
        let btnShowMore = createBtnShowMore(_BTN_SHOW_MORE_ID, _NUMBER_OF_WORDS);
        if (wordListContainer != null && btnShowMore != null) {
            btnShowMore.addEventListener("click", async function () {
                let JSONResponse = await getPreparedJSONResponseCustomerWordsFilteredPagination();
                if (JSONResponse.status === _HTTP_STATUSES.OK) {
                    await fillMyWordHistoryTable(JSONResponse.json);
                }
            });
            wordListContainer.appendChild(btnShowMore);
        }
    }
}

async function createWordWithStatusAndActionRow(wordJson, index) {
    // Создаём контейнер для информации о слове пользователя
    // В него помещаем:
    // 1. Таблицу о текущем статусе слова
    // 2. Контейнер с историей изменений статуса слова (по нажатию кнопки)
    let divWordContainer = document.createElement("div");
    //---

    // Получаем информацию о текущем статусе слова ---
    let wordHistoryJson = null;
    let JSONResponseCurrentStatus = await
        getJSONResponseWordStatusHistoryFindCurrentByWordId(wordJson["id"]);
    if (JSONResponseCurrentStatus.status === _HTTP_STATUSES.OK) {
        wordHistoryJson = JSONResponseCurrentStatus.json;
    }
    //---

    // Создаём строку таблицы ---
    let row = createWordWithStatusRow(wordJson, wordHistoryJson, ++_lastWordNumberInList);
    //---

    // Создаём кнопку, которой будет показывать/скрывать информацию об изменения статуса слова ---
    let aBtnHistoryAction = createABtnShowHistoryAction(wordHistoryJson, divWordContainer);
    let actionColumn = document.createElement("td");
    actionColumn.appendChild(aBtnHistoryAction);

    row.appendChild(actionColumn);
    //---

    // Создаём тело таблицы с информацией о слове пользователя с его текущим статусом ---
    for (let i = 0; i < row.childElementCount; i++) {
        row.children.item(i).style.padding = "20px";
    }

    let tBodyWordWithCurrentStatus = document.createElement("tbody");
    if (index % 2 !== 0) {
        let invisibleRow = document.createElement("tr");
        tBodyWordWithCurrentStatus.appendChild(invisibleRow);
    }
    tBodyWordWithCurrentStatus.appendChild(row);
    //---

    // Создаём таблицу с информацией о слове пользователя с его текущим статусом, помещаем её в контейнер ---
    let tableWordWithCurrentStatus = document.createElement("table");
    tableWordWithCurrentStatus.classList.add(_CSS_MAIN.TABLE_STANDARD_STYLE_ID);
    tableWordWithCurrentStatus.style.borderSpacing = "5px 0px";

    let colgroupParent = document.getElementById(_MY_WORD_HISTORY_TABLE_COLGROUP_ID);
    colgroupParent = colgroupParent.cloneNode(true);
    tableWordWithCurrentStatus.appendChild(colgroupParent);
    tableWordWithCurrentStatus.appendChild(tBodyWordWithCurrentStatus);

    divWordContainer.appendChild(tableWordWithCurrentStatus);
    //---

    // Создаем td элемент на все колонки таблицы, добавляем в него контейнер ---
    let tdWord = document.createElement("td");
    tdWord.style.padding = "0px";
    tdWord.colSpan = colgroupParent.childElementCount;
    tdWord.appendChild(divWordContainer);
    //---

    // Создаём итоговую строку ---
    row = document.createElement("tr");
    row.style.background = "none";
    row.appendChild(tdWord);
    //---

    return row;
}

// Создание кнопки "Показать/скрыть историю изменения слова"
function createABtnShowHistoryAction(wordHistoryJson, parentContainer) {
    let aBtnHistoryAction = document.createElement("a");
    if (wordHistoryJson) {
        changeToShowHistory(aBtnHistoryAction, parentContainer, wordHistoryJson["word"]["id"]);
    } else {
        buildABtnArrowDown(aBtnHistoryAction);
        buildABtnDisabled(aBtnHistoryAction);
        aBtnHistoryAction.title = "Невозможно получить историю изменения статуса слова.";
    }

    let divContainer = document.createElement("div");
    divContainer.style.display = "flex";
    divContainer.style.justifyContent = "center";
    divContainer.style.alignItems = "center";
    divContainer.appendChild(aBtnHistoryAction);

    return divContainer;
}

// Действие показа истории изменения слова
function changeToShowHistory(aBtnShowAllHistory, parentElement, wordId) {
    buildABtnArrowDown(aBtnShowAllHistory);
    aBtnShowAllHistory.title = "Показать историю изменения статуса слова";
    aBtnShowAllHistory.onclick = null;

    aBtnShowAllHistory.onclick = async function() {
        let divWordStatusHistoryContainer =
            await createDivWordStatusHistoryContainer(parentElement, wordId);
        parentElement.appendChild(divWordStatusHistoryContainer);

        changeToHideHistory(aBtnShowAllHistory, parentElement, wordId, divWordStatusHistoryContainer);
    }
}

// Действие сокрытия истории изменения слова
function changeToHideHistory(aBtnShowAllHistory, parentElement, wordId, wordStatusHistoryContainer) {
    buildABtnArrowUp(aBtnShowAllHistory);
    aBtnShowAllHistory.title = "Скрыть историю изменения статуса слова";
    aBtnShowAllHistory.onclick = null;

    aBtnShowAllHistory.onclick = async function() {
        parentElement.removeChild(wordStatusHistoryContainer);
        changeToShowHistory(aBtnShowAllHistory, parentElement, wordId);
    }
}

// Создание контейнера истории изменения статуса слова
async function createDivWordStatusHistoryContainer(parentElement, wordId) {
    // Создаём контейнер истории изменения статуса слова ---
    let divWordStatusHistory = document.createElement("div");
    divWordStatusHistory.style.paddingTop = "5px";
    //---

    let JSONResponseWordStatusHistories = await getJSONResponseAllWordStatusHisoriesByWordId(wordId);
    if (JSONResponseWordStatusHistories.status === _HTTP_STATUSES.OK) {
        // Горизонтальный разделитель ---
        let divDelimiter = document.createElement("div");
        divDelimiter.classList.add(_CSS_MAIN.DIV_HORIZONTAL_DELIMITER_STYLE_ID);

        let divDelimiterContainer = document.createElement("div");
        divDelimiterContainer.style.height = "15px";
        divDelimiterContainer.style.display = "flex";
        divDelimiterContainer.style.flexDirection = "column";
        divDelimiterContainer.style.justifyContent = "center";
        divDelimiterContainer.appendChild(divDelimiter);

        divWordStatusHistory.appendChild(divDelimiterContainer);
        //---

        // Таблица истории изменения статуса слова ---
        let tBodyWordStatusHistories = document.createElement("tbody");
        let json = JSONResponseWordStatusHistories.json;
        for (let i = 0; i < json.length; i++) {
            let wordHistoryJson = json[i];
            let wordJson = wordHistoryJson["word"];
            let row = createWordWithStatusRow(wordJson, wordHistoryJson, null);

            let tdEmpty = document.createElement("td");
            row.appendChild(tdEmpty);

            for (let j = 0; j < row.childElementCount; j++) {
                row.children.item(j).style.padding = "20px";
            }

            tBodyWordStatusHistories.appendChild(row);
        }

        let tableWordStatusHistories = document.createElement("table");
        tableWordStatusHistories.classList.add(_CSS_MAIN.TABLE_STANDARD_STYLE_ID);

        let colgroupParent = document.getElementById(_MY_WORD_HISTORY_TABLE_COLGROUP_ID);
        colgroupParent = colgroupParent.cloneNode(true);
        tableWordStatusHistories.appendChild(colgroupParent);
        tableWordStatusHistories.appendChild(tBodyWordStatusHistories);

        divWordStatusHistory.appendChild(tableWordStatusHistories);
        //---

        // Горизонтальный разделитель ---
        divDelimiterContainer = divDelimiterContainer.cloneNode(true);
        divWordStatusHistory.appendChild(divDelimiterContainer);
        //---
    }

    return divWordStatusHistory;
}

// Создание строки слова со статусом (без колонки действий)
function createWordWithStatusRow(wordJson, wordHistoryJson, numberInTable) {
    // Создаём строку для новой таблицы ---
    let row = document.createElement("tr");
    //---

    // Номер строки ---
    let numberColumn = document.createElement("td");
    if (numberInTable) {
        numberColumn.textContent = `${numberInTable}.`;
    }
    numberColumn.style.textAlign = "center";
    row.appendChild(numberColumn);
    //---

    // Название ---
    let titleColumn = document.createElement("td");
    titleColumn.textContent = wordJson["title"];
    row.appendChild(titleColumn);
    //---

    // Язык ---
    let langColumn = document.createElement("td");
    let divLang = createDivLangWithFlag(wordJson["lang"]);
    langColumn.appendChild(divLang);
    row.appendChild(langColumn);
    //---

    // Часть речи ---
    let partOfSpeechColumn = document.createElement("td");
    partOfSpeechColumn.textContent = wordJson["part_of_speech"]["title"];
    row.appendChild(partOfSpeechColumn);
    //---

    // Статус ---
    if (wordHistoryJson) {
        let wordStatusJSON = wordHistoryJson["word_status"];
        let aCurrentWordStatus = createAWordStatus(wordStatusJSON);

        let wordStatusColumn = document.createElement("td");
        wordStatusColumn.appendChild(aCurrentWordStatus);

        row.appendChild(wordStatusColumn);
    } else {
        let divBadRequest = document.createElement("div");
        divBadRequest.textContent = "Неизвестно";
        divBadRequest.style.fontWeight = "bold";
        row.appendChild(divBadRequest);
    }
    //---

    // Дата изменения статуса ---
    if (wordHistoryJson) {
        let dateOfStartStr = wordHistoryJson["date_of_start"];
        let dateOfStart = new Date(dateOfStartStr);
        let dateOfStartElements = new DateElements(dateOfStart);

        let dateOfStartColumn = document.createElement("td");
        dateOfStartColumn.textContent = dateOfStartElements.getDateWithTimeStr();
        row.appendChild(dateOfStartColumn);
    } else {
        let divBadRequest = document.createElement("div");
        divBadRequest.textContent = "Неизвестно";
        divBadRequest.style.fontWeight = "bold";
        row.appendChild(divBadRequest);
    }
    //---

    return row;
}

async function generateMyWordsHistoryStatistics() {
    let myWordsHistoryStatisticsContainer =
        document.getElementById(_MY_WORDS_HISTORY_STATISTICS_CONTAINER_ID);
    if (myWordsHistoryStatisticsContainer != null) {
        // Генерируем статистику по всем статусам слов пользователя
        let JSONResponseWordStatuses = await getJSONResponseAllWordStatuses();
        if (JSONResponseWordStatuses.status === _HTTP_STATUSES.OK) {
            let jsonWordStatuses = JSONResponseWordStatuses.json;

            // Генерируем контейнер для статистики всех статусов слов ---
            let divStatisticForCustomerWords = document.createElement("div");
            //---

            // Генерируем статистику по всем статусам ---
            let wordStatusesWithCount = [];
            let customerId = getGlobalCookie(_GLOBAL_COOKIES.AUTH_ID);
            let numberOfWordsSum = 0;
            for (let i = 0; i < jsonWordStatuses.length; i++) {
                let wordStatusJson = jsonWordStatuses[i];
                let JSONResponseNumberOfWords =
                    await getJSONResponseWordsCountByCustomerIdAndWordStatusCode(customerId, wordStatusJson["code"]);
                if (JSONResponseNumberOfWords.status === _HTTP_STATUSES.OK) {
                    let numberOfWords = JSONResponseNumberOfWords.json["count_of_words"];
                    numberOfWordsSum += numberOfWords;

                    let wordStatusWithCount = new WordStatusWithCount(wordStatusJson, numberOfWords);
                    wordStatusesWithCount.push(wordStatusWithCount);
                }
            }

            // Сортируем статусы по убыванию количества
            wordStatusesWithCount.sort(compareWordStatusWithCount);
            for (let i = 0; i < wordStatusesWithCount.length; i++) {
                let item = wordStatusesWithCount[i];
                let divWordStatusWithCount =
                    createDivWordStatusWithCount(item.wordStatusJson, item.count);

                divStatisticForCustomerWords.appendChild(divWordStatusWithCount);
            }
            //---

            // Сумма всех слов ---
            let spanNumberOfWordsText = document.createElement("span");
            spanNumberOfWordsText.style.fontWeight = "bold";
            spanNumberOfWordsText.textContent = "Общее количество предложенных вами слов";

            let spanNumberOfWordsSum = document.createElement("span");
            spanNumberOfWordsSum.textContent = `: ${numberOfWordsSum}`;

            let divNumberOfWordsSumContainer = document.createElement("div");
            divNumberOfWordsSumContainer.appendChild(spanNumberOfWordsText);
            divNumberOfWordsSumContainer.appendChild(spanNumberOfWordsSum);
            //---

            // Добавляем элементы в основной контейнер ---
            myWordsHistoryStatisticsContainer.replaceChildren();
            myWordsHistoryStatisticsContainer.appendChild(divNumberOfWordsSumContainer);
            myWordsHistoryStatisticsContainer.appendChild(divStatisticForCustomerWords);
            myWordsHistoryStatisticsContainer.appendChild(document.createElement("br"));
            //---
        }
    }
}

