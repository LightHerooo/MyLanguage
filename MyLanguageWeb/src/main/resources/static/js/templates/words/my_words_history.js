import {
    CustomTimer
} from "../../classes/custom_timer/custom_timer.js";

import {
    GlobalCookies
} from "../../classes/global_cookies.js";

import {
    HttpStatuses
} from "../../classes/http_statuses.js";

import {
    CssMain
} from "../../classes/css/css_main.js";

import {
    DateParts
} from "../../classes/date_parts.js";

import {
    WordStatusWithCount,
    compareWordStatusWithCount
} from "../../classes/dto/types/TODO/word_status_with_count.js";

import {
    WordStatusHistoryResponseDTO
} from "../../classes/dto/entity/word_status_history.js";

import {
    WordResponseDTO
} from "../../classes/dto/entity/word.js";

import {
    CustomResponseMessage
} from "../../classes/dto/other/custom_response_message.js";

import {
    WordStatusResponseDTO
} from "../../classes/dto/entity/word_status.js";

import {
    LongResponse
} from "../../classes/dto/other/long_response.js";

import {
    LangUtils
} from "../../classes/utils/entity/lang_utils.js";

import {
    WordStatusUtils
} from "../../classes/utils/entity/word_status_utils.js";

import {
    WordStatusesAPI
} from "../../classes/api/word_statuses/word_statuses_api.js";

import {
    WordsAPI
} from "../../classes/api/words_api.js";

import {
    WordStatusHistoriesAPI
} from "../../classes/api/word_status_histories_api.js";

import {
    TableUtils
} from "../../classes/utils/table_utils.js";

import {
    AButtons
} from "../../classes/a_buttons.js";

import {
    ComboBoxUtils
} from "../../classes/utils/combo_box_utils.js";

import {
    LoadingElement
} from "../../classes/loading_element.js";

import {
    CustomTimerUtils
} from "../../classes/utils/custom_timer_utils.js";

const _WORD_STATUSES_API = new WordStatusesAPI();
const _WORDS_API = new WordsAPI();
const _WORD_STATUS_HISTORIES = new WordStatusHistoriesAPI();

const _CSS_MAIN = new CssMain();
const _HTTP_STATUSES = new HttpStatuses();
const _GLOBAL_COOKIES = new GlobalCookies();
const _LANG_UTILS = new LangUtils();
const _WORD_STATUS_UTILS = new WordStatusUtils();
const _TABLE_UTILS = new TableUtils();
const _A_BUTTONS = new AButtons();
const _COMBO_BOX_UTILS = new ComboBoxUtils();
const _CUSTOM_TIMER_UTILS = new CustomTimerUtils();

const _MY_WORDS_HISTORY_STATISTICS_CONTAINER_ID = "my_words_history_statistics_container";
const _TB_FINDER_ID = "tb_finder";
const _CB_LANGS_ID = "cb_langs";
const _CB_WORD_STATUSES = "cb_word_statuses";
const _MY_WORD_HISTORY_TABLE_COLGROUP_ID = "my_word_history_table_colgroup";
const _MY_WORD_HISTORY_TABLE_HEAD_ID = "my_word_history_table_head";
const _MY_WORD_HISTORY_TABLE_BODY_ID = "my_word_history_table_body";
const _BTN_REFRESH_ID = "btn_refresh";
const _DIV_LANG_FLAG_ID = "lang_flag";

const _NUMBER_OF_WORDS = 20;
let _lastWordNumberInList = 0;
let _lastWordIdOnPreviousPage = 0n;

const _CUSTOM_TIMER_STATISTIC_WAITER = new CustomTimer();
const _CUSTOM_TIMER_STATISTIC_FINDER = new CustomTimer();
let _accessToFillStatistic = true;

const _CUSTOM_TIMER_TABLE_WAITER = new CustomTimer();
const _CUSTOM_TIMER_TABLE_FINDER = new CustomTimer();
let _accessToFillTable = true;

let _timersForWordHistoriesMap = new Map();

class TimersForWordHistory {
    customTimerWaiter;
    customTimerFinder;

    constructor(customTimerWaiter, customTimerFinder) {
        this.customTimerWaiter = customTimerWaiter;
        this.customTimerFinder = customTimerFinder;
    }

    stopTimers() {
        this.customTimerWaiter.stop();
        this.customTimerFinder.stop();
    }
}

window.onload = async function() {
    prepareStatisticTimers();
    prepareTableTimers();

    await prepareCbLangs();
    await prepareCbWordStatuses();
    prepareTbFinder();
    prepareBtnRefresh();

    startTimers();
}

function prepareStatisticTimers() {
    _CUSTOM_TIMER_STATISTIC_WAITER.handler = function() {
        _accessToFillStatistic = false;

        let divStatistic = document.getElementById(_MY_WORDS_HISTORY_STATISTICS_CONTAINER_ID);
        divStatistic.replaceChildren();
        divStatistic.appendChild(new LoadingElement().createDiv());
    }

    _CUSTOM_TIMER_STATISTIC_FINDER.handler = async function() {
        _accessToFillStatistic = true;
        await tryToFillStatistics();
    }
}

function prepareTableTimers() {
    _CUSTOM_TIMER_TABLE_WAITER.handler = function () {
        _accessToFillTable = false;

        let tableHead = document.getElementById(_MY_WORD_HISTORY_TABLE_HEAD_ID);
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);
        let trMessage = _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrLoading(numberOfColumns);

        let tableBody = document.getElementById(_MY_WORD_HISTORY_TABLE_BODY_ID);
        tableBody.replaceChildren();
        tableBody.appendChild(trMessage);
    }

    _CUSTOM_TIMER_TABLE_FINDER.handler = async function() {
        _accessToFillTable = true;
        await tryToFillTable();
    }
}

function startTimers() {
    _CUSTOM_TIMER_UTILS.findAfterWait(_CUSTOM_TIMER_STATISTIC_WAITER, _CUSTOM_TIMER_STATISTIC_FINDER);
    _CUSTOM_TIMER_UTILS.findAfterWait(_CUSTOM_TIMER_TABLE_WAITER, _CUSTOM_TIMER_TABLE_FINDER);
}

function prepareTbFinder() {
    let tbFinder = document.getElementById(_TB_FINDER_ID);

    if (tbFinder) {
        // Вешаем событие обновления списка при изменении текста
        tbFinder.addEventListener("input", async function () {
            startTimers();
        });
    }
}

async function prepareCbLangs() {
    let cbLangs = document.getElementById(_CB_LANGS_ID);
    if (cbLangs) {
        let firstOption = document.createElement("option");
        firstOption.textContent = "Все";

        let divLangFlag = document.getElementById(_DIV_LANG_FLAG_ID);
        await _LANG_UTILS.prepareComboBox(cbLangs, firstOption, divLangFlag);

        // Вешаем событие обновления списка при изменении элемента выпадающего списка
        cbLangs.addEventListener("change", function () {
            startTimers();
        })
    }
}

async function prepareCbWordStatuses() {
    let cbWordStatuses = document.getElementById(_CB_WORD_STATUSES);
    if (cbWordStatuses) {
        let firstOption = document.createElement("option");
        firstOption.textContent = "Все";

        await _WORD_STATUS_UTILS.fillComboBox(cbWordStatuses, firstOption);

        cbWordStatuses.addEventListener("change", function () {
            startTimers();
        });
    }
}

function prepareBtnRefresh() {
    let btnRefresh = document.getElementById(_BTN_REFRESH_ID);
    if (btnRefresh) {
        btnRefresh.addEventListener("click", async function() {
            startTimers();
        })
    }
}

async function tryToFillStatistics() {
    let statisticItems = await createStatisticItems();

    if (_accessToFillStatistic === true) {
        let divStatistics = document.getElementById(_MY_WORDS_HISTORY_STATISTICS_CONTAINER_ID);
        divStatistics.replaceChildren();
        for (let i = 0; i < statisticItems.length; i++) {
            if (_accessToFillStatistic === true) {
                divStatistics.appendChild(statisticItems[i]);
            }
        }
    }
}

async function createStatisticItems() {
    let statisticItems = [];

    // Генерируем статистику по всем статусам слов пользователя
    let JSONResponseWordStatuses = await _WORD_STATUSES_API.GET.getAll();
    if (JSONResponseWordStatuses.status === _HTTP_STATUSES.OK) {
        // Генерируем контейнер для статистики всех статусов слов ---
        let divStatisticForCustomerWords = document.createElement("div");
        //---

        // Генерируем статистику по всем статусам ---
        let wordStatusesWithCount = [];
        let customerId = _GLOBAL_COOKIES.AUTH_ID.getValue();
        let wordStatusesJson = JSONResponseWordStatuses.json;
        let numberOfWordsSum = 0n;
        for (let i = 0; i < wordStatusesJson.length; i++) {
            if (_accessToFillStatistic === true) {
                let wordStatus = new WordStatusResponseDTO(wordStatusesJson[i]);
                let JSONResponseNumberOfWords =
                    await _WORDS_API.GET.getCountByCustomerIdAndWordStatusCode(customerId, wordStatus.code);
                if (JSONResponseNumberOfWords.status === _HTTP_STATUSES.OK) {
                    let longResponse = new LongResponse(JSONResponseNumberOfWords.json);
                    numberOfWordsSum += longResponse.value;

                    let wordStatusWithCount = new WordStatusWithCount(wordStatus, longResponse.value);
                    wordStatusesWithCount.push(wordStatusWithCount);
                }
            }
        }

        // Сортируем статусы по убыванию количества
        wordStatusesWithCount.sort(compareWordStatusWithCount);
        for (let i = 0; i < wordStatusesWithCount.length; i++) {
            divStatisticForCustomerWords.appendChild(wordStatusesWithCount[i].createDiv());
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
        let divStatistic = document.createElement("div");
        divStatistic.appendChild(divNumberOfWordsSumContainer);
        divStatistic.appendChild(divStatisticForCustomerWords);
        divStatistic.appendChild(document.createElement("br"));

        statisticItems.push(divStatistic);
        //---
    }

    return statisticItems;
}

async function sendPreparedRequest() {
    let customerId = _GLOBAL_COOKIES.AUTH_ID.getValue();
    let title = document.getElementById(_TB_FINDER_ID).value;
    let wordStatusCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBoxId(_CB_WORD_STATUSES);
    let langCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBoxId(_CB_LANGS_ID);

    return await _WORDS_API.GET.getAllCustomerWordsFilteredPagination(_NUMBER_OF_WORDS, customerId,
        title, wordStatusCode, langCode, _lastWordIdOnPreviousPage);
}

async function tryToFillTable() {
    _lastWordNumberInList = 0;
    _lastWordIdOnPreviousPage = 0n;
    _timersForWordHistoriesMap.clear();

    // Получаем JSON для заполнения таблицы ---
    let JSONResponse = await sendPreparedRequest();
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        let tableRows = await createTableRows(JSONResponse.json);
        if (_accessToFillTable === true) {
            let tableBody = document.getElementById(_MY_WORD_HISTORY_TABLE_BODY_ID);
            tableBody.replaceChildren();
            for (let i = 0; i < tableRows.length; i++) {
                if (_accessToFillTable === true) {
                    tableBody.appendChild(tableRows[i]);
                }
            }
        }
    } else {
        // Выводим сообщение об ошибке
        let tableHead = document.getElementById(_MY_WORD_HISTORY_TABLE_HEAD_ID);
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);
        let trMessage = _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrCommon(
            numberOfColumns, new CustomResponseMessage(JSONResponse.json).text);

        if (_accessToFillTable === true) {
            let tableBody = document.getElementById(_MY_WORD_HISTORY_TABLE_BODY_ID);
            tableBody.replaceChildren();
            if (_accessToFillTable === true) {
                tableBody.appendChild(trMessage);
            }
        }
    }
    //---
}

async function createTableRows(customerWordsFilteredPaginationJson){
    let tableRows = [];

    for (let i = 0; i < customerWordsFilteredPaginationJson.length; i++) {
        let word = new WordResponseDTO(customerWordsFilteredPaginationJson[i]);

        let row = await createTableRow(word, i);
        if (row) {
            tableRows.push(row);
        }

        // Получаем id последнего элемента JSON-коллекции
        if (i === customerWordsFilteredPaginationJson.length - 1) {
            _lastWordIdOnPreviousPage = word.id;
        }
    }

    // Создаем кнопку, только если запрос вернул максимальное количество на страницу
    if (_accessToFillTable === true && customerWordsFilteredPaginationJson.length === _NUMBER_OF_WORDS) {
        let tableHead = document.getElementById(_MY_WORD_HISTORY_TABLE_HEAD_ID);
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);

        let trShowMore = _TABLE_UTILS.createTrShowMore(numberOfColumns,
            _NUMBER_OF_WORDS, async function () {
                let JSONResponse = await sendPreparedRequest();
                if (JSONResponse.status === _HTTP_STATUSES.OK) {
                    let tableBody = document.getElementById(_MY_WORD_HISTORY_TABLE_BODY_ID);
                    let tableRows = await createTableRows(JSONResponse.json);
                    for (let i = 0; i < tableRows.length; i++) {
                        if (_accessToFillTable === true) {
                            tableBody.appendChild(tableRows[i]);
                        }
                    }
                }
            });

        tableRows.push(trShowMore);
    }

    return tableRows;
}

async function createTableRow(wordResponseDTO, index) {
    // Получаем информацию о текущем статусе слова, генерируем строку, если успешно ---
    let JSONResponse = await _WORD_STATUS_HISTORIES.GET.findCurrentByWordId(wordResponseDTO.id);
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        // Создаём строку таблицы ---
        let wordStatusHistory = new WordStatusHistoryResponseDTO(JSONResponse.json);
        let row = createTableRowWithoutActionColumn(wordStatusHistory, ++_lastWordNumberInList);
        //---

        // Создаём контейнер для информации о слове пользователя
        // В него помещаем:
        // 1. Таблицу о текущем статусе слова
        // 2. Контейнер с таблицей истории изменения статуса слова (по нажатию кнопки) ---
        let divWordContainer = document.createElement("div");
        //---

        // Создаём кнопку, которая будет показывать/скрывать информацию об изменения статуса слова ---
        let aBtnHistoryAction = createABtnShowHistoryAction(wordStatusHistory, divWordContainer);
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
    //---
}

// Создание строки слова со статусом (без колонки действий)
function createTableRowWithoutActionColumn(wordStatusHistoryObj, numberInTable) {
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

    // Название слова ---
    let titleColumn = document.createElement("td");
    titleColumn.textContent = wordStatusHistoryObj.word.title;
    row.appendChild(titleColumn);
    //---

    // Язык ---
    let langColumn = document.createElement("td");
    langColumn.appendChild(wordStatusHistoryObj.word.lang.createDiv());
    row.appendChild(langColumn);
    //---

    // Статус ---
    if (wordStatusHistoryObj.wordStatus) {
        let wordStatusColumn = document.createElement("td");
        wordStatusColumn.appendChild(wordStatusHistoryObj.wordStatus.createA());

        row.appendChild(wordStatusColumn);
    } else {
        let divBadRequest = document.createElement("div");
        divBadRequest.textContent = "Неизвестно";
        divBadRequest.style.fontWeight = "bold";
        row.appendChild(divBadRequest);
    }
    //---

    // Дата изменения статуса ---
    if (wordStatusHistoryObj.dateOfStart) {
        let dateOfStartStr = wordStatusHistoryObj.dateOfStart;
        let dateOfStart = new Date(dateOfStartStr);
        let dateOfStartParts = new DateParts(dateOfStart);

        let dateOfStartColumn = document.createElement("td");
        dateOfStartColumn.textContent = dateOfStartParts.getDateWithTimeStr();
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

// Создание кнопки "Показать/скрыть историю изменения слова"
function createABtnShowHistoryAction(wordStatusHistoryObj, parentContainer) {
    let aBtnHistoryAction = document.createElement("a");
    if (wordStatusHistoryObj) {
        changeToShowHistoryAction(aBtnHistoryAction, parentContainer, wordStatusHistoryObj.word.id);
    } else {
        _A_BUTTONS.A_BUTTON_ARROW_DOWN.setStyles(aBtnHistoryAction);
        _A_BUTTONS.A_BUTTON_DISABLED.setStyles(aBtnHistoryAction);
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
function changeToShowHistoryAction(aBtnShowHistoryAction, parentElement, wordId) {
    _A_BUTTONS.A_BUTTON_ARROW_DOWN.setStyles(aBtnShowHistoryAction);
    aBtnShowHistoryAction.title = "Показать историю изменения статуса слова";
    aBtnShowHistoryAction.onclick = null;

    // Останавливаем таймеры, если они не успели прогрузиться до сокрытия истории ---
    let timersForWordHistory = _timersForWordHistoriesMap.get(wordId);
    if (timersForWordHistory) {
        timersForWordHistory.stopTimers();
    }
    //---

    aBtnShowHistoryAction.onclick = async function() {
        let divWithWordStatusHistory =
            await createDivWithWordStatusHistoryTable(wordId);
        divWithWordStatusHistory.style.marginTop = "5px";
        parentElement.appendChild(divWithWordStatusHistory);

        changeToHideHistoryAction(aBtnShowHistoryAction, parentElement, wordId, divWithWordStatusHistory);
    }
}

// Действие сокрытия истории изменения слова
function changeToHideHistoryAction(aBtnShowHistoryAction, parentElement, wordId, tableWordStatusHistory) {
    _A_BUTTONS.A_BUTTON_ARROW_UP.setStyles(aBtnShowHistoryAction);
    aBtnShowHistoryAction.title = "Скрыть историю изменения статуса слова";
    aBtnShowHistoryAction.onclick = null;

    aBtnShowHistoryAction.onclick = async function() {
        parentElement.removeChild(tableWordStatusHistory);
        changeToShowHistoryAction(aBtnShowHistoryAction, parentElement, wordId);
    }
}

// Создание контейнера с таблицей история слова
async function createDivWithWordStatusHistoryTable(wordId) {
    // Создаём разделитель ---
    let divDelimiter = document.createElement("div");
    divDelimiter.classList.add(_CSS_MAIN.DIV_HORIZONTAL_DELIMITER_STYLE_ID);

    let divDelimiterContainer = document.createElement("div");
    divDelimiterContainer.style.display = "grid";
    divDelimiterContainer.style.alignItems = "center";
    divDelimiterContainer.style.height = "30px";
    divDelimiterContainer.appendChild(divDelimiter);
    //---

    // Создаём таблицу, в которой будем отбражать историю слова
    let tableWordStatusHistories = document.createElement("table");
    tableWordStatusHistories.classList.add(_CSS_MAIN.TABLE_STANDARD_STYLE_ID);

    // Добавляем все элементы в контейнер
    let divWithWordStatusHistoryTable = document.createElement("div");
    divWithWordStatusHistoryTable.style.display = "grid";
    divWithWordStatusHistoryTable.appendChild(divDelimiterContainer);
    divWithWordStatusHistoryTable.appendChild(tableWordStatusHistories);
    divWithWordStatusHistoryTable.appendChild(divDelimiterContainer.cloneNode(true));
    //---

    // Получаем colgroup главной таблицы (чтобы колонки были по размерам такие же) ---
    let colgroupParent = document.getElementById(_MY_WORD_HISTORY_TABLE_COLGROUP_ID);
    let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByColgroup(colgroupParent);
    //---

    // Создаём тело таблицы, помещаем в таблицу colgroup и body ---
    let tBodyWordStatusHistories = document.createElement("tbody");
    tableWordStatusHistories.appendChild(colgroupParent.cloneNode(true));
    tableWordStatusHistories.appendChild(tBodyWordStatusHistories);
    //---

    // Подготавливаем таймеры (чтобы отобразить загрузку, если не будет прогружать) ---
    let timersForWordHistory = _timersForWordHistoriesMap.get(wordId);
    if (!timersForWordHistory) {
        let customTimerWaiterForWordHistory = new CustomTimer();
        let customTimerFinderForWordHistory = new CustomTimer();

        timersForWordHistory =
            new TimersForWordHistory(customTimerWaiterForWordHistory, customTimerFinderForWordHistory);
        _timersForWordHistoriesMap.set(wordId, timersForWordHistory);
    }

    timersForWordHistory.customTimerWaiter.handler = function () {
        tBodyWordStatusHistories.replaceChildren();

        let trMessage = _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrLoading(numberOfColumns);
        tBodyWordStatusHistories.appendChild(trMessage);
    }
    timersForWordHistory.customTimerWaiter.timeout = 1;

    timersForWordHistory.customTimerFinder.handler = async function() {
        // Генерируем историю статуса слова или выводим сообщение ---
        let JSONResponseWordStatusHistories = await _WORD_STATUS_HISTORIES.GET.getAllByWordId(wordId);
        if (JSONResponseWordStatusHistories.status === _HTTP_STATUSES.OK) {
            tBodyWordStatusHistories.replaceChildren();
            let json = JSONResponseWordStatusHistories.json;
            for (let i = 0; i < json.length; i++) {
                let wordStatusHistory = new WordStatusHistoryResponseDTO(json[i]);
                let row = createTableRowWithoutActionColumn(wordStatusHistory, null);

                if (row) {
                    let tdEmpty = document.createElement("td");
                    row.appendChild(tdEmpty);

                    for (let i = 0; i < row.childElementCount; i++) {
                        row.children.item(i).style.padding = "20px";
                    }

                    tBodyWordStatusHistories.appendChild(row);
                }
            }
        } else {
            tBodyWordStatusHistories.replaceChildren();
            let trMessage = _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrCommon(numberOfColumns,
                new CustomResponseMessage(JSONResponseWordStatusHistories.json).text);
            tBodyWordStatusHistories.appendChild(trMessage);
        }
        //---
    }

    _CUSTOM_TIMER_UTILS.findAfterWait(timersForWordHistory.customTimerWaiter, timersForWordHistory.customTimerFinder);
    //---

    return divWithWordStatusHistoryTable;
}

