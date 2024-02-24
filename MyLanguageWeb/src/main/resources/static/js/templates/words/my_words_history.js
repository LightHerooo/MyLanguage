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
    TextBoxUtils
} from "../../classes/utils/text_box_utils.js";

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
const _TEXT_BOX_UTILS = new TextBoxUtils();

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

const _CUSTOM_TIMER_STATISTIC_FINDER = new CustomTimer();
const _CUSTOM_TIMER_WORDS_FINDER = new CustomTimer();
const _CUSTOM_TIMER_TB_FINDER = new CustomTimer();
const _TIMEOUT_FOR_FINDERS = 1000;

let _wordStatusHistoryItemsForFindMap = new Map();

class WordStatusHistoryItemsForFind {
    tableHistory;
    colgroupHistory;
    tBodyHistory;
    customTimerFinder;

    constructor(tableHistory, colgroupHistory, tBodyHistory, customTimerFinder) {
        this.tableHistory = tableHistory;
        this.colgroupHistory = colgroupHistory;
        this.tBodyHistory = tBodyHistory;
        this.customTimerFinder = customTimerFinder;
    }
}

window.onload = async function() {
    prepareStatisticFinder();
    prepareWordsFinder();

    await prepareCbLangs();
    await prepareCbWordStatuses();
    prepareTbFinder();
    prepareBtnRefresh();

    startAllFinders();
}

function prepareTbFinder() {
    let tbFinder = document.getElementById(_TB_FINDER_ID);

    if (tbFinder) {
        _TEXT_BOX_UTILS.prepareTbFinder(tbFinder, startAllFinders, _CUSTOM_TIMER_TB_FINDER);
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
            startAllFinders();
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
            startAllFinders();
        });
    }
}

function prepareBtnRefresh() {
    let btnRefresh = document.getElementById(_BTN_REFRESH_ID);
    if (btnRefresh) {
        btnRefresh.addEventListener("click", async function() {
            startAllFinders();
        })
    }
}

function startAllFinders() {
    startToFindStatistic();
    startToFindWords();
}

// Статистика ---
function prepareStatisticFinder() {
    _CUSTOM_TIMER_STATISTIC_FINDER.setTimeout(_TIMEOUT_FOR_FINDERS);
    _CUSTOM_TIMER_STATISTIC_FINDER.setHandler(async function() {
        await tryToFillStatistic();
    });
}

function startToFindStatistic() {
    if (_CUSTOM_TIMER_STATISTIC_FINDER) {
        _CUSTOM_TIMER_STATISTIC_FINDER.stop();
    }

    let divStatistic = document.getElementById(_MY_WORDS_HISTORY_STATISTICS_CONTAINER_ID);
    if (divStatistic) {
        divStatistic.replaceChildren();
        divStatistic.appendChild(new LoadingElement().createDiv());
    }

    if (_CUSTOM_TIMER_STATISTIC_FINDER) {
        _CUSTOM_TIMER_STATISTIC_FINDER.start();
    }
}

async function tryToFillStatistic() {
    let currentFinder = _CUSTOM_TIMER_STATISTIC_FINDER;
    let statisticItems = await createStatisticItems();

    let divStatistics = document.getElementById(_MY_WORDS_HISTORY_STATISTICS_CONTAINER_ID);
    if (divStatistics && currentFinder.getActive() === true) {
        divStatistics.replaceChildren();
        for (let i = 0; i < statisticItems.length; i++) {
            if (currentFinder.getActive() !== true) break;
            divStatistics.appendChild(statisticItems[i]);
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
//---

// Слова с текущим статусом слова ---
function prepareWordsFinder() {
    _CUSTOM_TIMER_WORDS_FINDER.setTimeout(_TIMEOUT_FOR_FINDERS);
    _CUSTOM_TIMER_WORDS_FINDER.setHandler(async function() {
        _lastWordNumberInList = 0;
        _lastWordIdOnPreviousPage = 0n;

        // Очищаем мапу таймеров историй статусов слов ---
        for (let key of _wordStatusHistoryItemsForFindMap.keys()) {
            let wordHistoryItem = _wordStatusHistoryItemsForFindMap.get(key);
            if (wordHistoryItem.customTimerFinder) {
                wordHistoryItem.customTimerFinder.stop();
            }
        }

        _wordStatusHistoryItemsForFindMap.clear();
        //---

        await tryToFillTableRows(true, true);
    });
}

function startToFindWords() {
    if (_CUSTOM_TIMER_WORDS_FINDER) {
        _CUSTOM_TIMER_WORDS_FINDER.stop();
    }

    let tableHead = document.getElementById(_MY_WORD_HISTORY_TABLE_HEAD_ID);
    let tableBody = document.getElementById(_MY_WORD_HISTORY_TABLE_BODY_ID);
    if (tableHead && tableBody) {
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);
        let trMessage = _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrLoading(numberOfColumns);

        tableBody.replaceChildren();
        tableBody.appendChild(trMessage);
    }

    if (_CUSTOM_TIMER_WORDS_FINDER) {
        _CUSTOM_TIMER_WORDS_FINDER.start();
    }
}

async function tryToFillTableRows(doNeedToClearTable, doNeedToShowTableMessage) {
    let currentFinder = _CUSTOM_TIMER_WORDS_FINDER;

    let customerId = _GLOBAL_COOKIES.AUTH_ID.getValue();
    let title = document.getElementById(_TB_FINDER_ID).value;
    let wordStatusCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBoxId(_CB_WORD_STATUSES);
    let langCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBoxId(_CB_LANGS_ID);

    let JSONResponse = await _WORDS_API.GET.getAllCustomerWordsFilteredPagination(_NUMBER_OF_WORDS, customerId,
        title, wordStatusCode, langCode, _lastWordIdOnPreviousPage);
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        let tableRows = await createTableRows(JSONResponse.json);
        let tableBody = document.getElementById(_MY_WORD_HISTORY_TABLE_BODY_ID);
        if (tableRows && tableBody && currentFinder.getActive() === true) {
            if (doNeedToClearTable === true) {
                tableBody.replaceChildren();
                for (let i = 0; i < tableRows.length; i++) {
                    if (currentFinder.getActive() !== true) break;
                    tableBody.appendChild(tableRows[i]);
                }
            }
        }
    } else if (doNeedToShowTableMessage === true) {
        let tableHead = document.getElementById(_MY_WORD_HISTORY_TABLE_HEAD_ID);
        let tableBody = document.getElementById(_MY_WORD_HISTORY_TABLE_BODY_ID);
        if (tableHead && tableBody) {
            let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);
            let trMessage = _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrCommon(
                numberOfColumns, new CustomResponseMessage(JSONResponse.json).text);

            if (currentFinder.getActive() === true) {
                tableBody.replaceChildren();
                if (currentFinder.getActive() === true) {
                    tableBody.appendChild(trMessage);
                }
            }
        }
    }
}

async function createTableRows(customerWordsFilteredPaginationJson){
    let currentFinder = _CUSTOM_TIMER_WORDS_FINDER;
    let tableRows = [];

    for (let i = 0; i < customerWordsFilteredPaginationJson.length; i++) {
        if (currentFinder.getActive() !== true) break;
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
    if (currentFinder.getActive() === true &&
        customerWordsFilteredPaginationJson.length === _NUMBER_OF_WORDS) {
        let tableHead = document.getElementById(_MY_WORD_HISTORY_TABLE_HEAD_ID);
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);

        let trShowMore = _TABLE_UTILS.createTrShowMore(numberOfColumns,
            _NUMBER_OF_WORDS, async function () {
                await tryToFillTableRows(false, false);
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
        let aBtnHistoryAction = createABtnHistoryAction(wordStatusHistory, divWordContainer);
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

        let colgroupParent = document.getElementById(_MY_WORD_HISTORY_TABLE_COLGROUP_ID);
        colgroupParent = colgroupParent.cloneNode(true);
        tableWordWithCurrentStatus.appendChild(colgroupParent);
        tableWordWithCurrentStatus.appendChild(tBodyWordWithCurrentStatus);

        divWordContainer.appendChild(tableWordWithCurrentStatus);
        //---

        // Создаем td элемент на все колонки таблицы, добавляем в него контейнер ---
        let tdWord = document.createElement("td");
        tdWord.style.padding = "0";
        tdWord.style.paddingTop = "5px";
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

function createABtnHistoryAction(wordStatusHistoryObj, parentContainer) {
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

function changeToShowHistoryAction(aBtnShowHistoryAction, parentElement, wordId) {
    _A_BUTTONS.A_BUTTON_ARROW_DOWN.setStyles(aBtnShowHistoryAction);
    aBtnShowHistoryAction.title = "Показать историю изменения статуса слова";
    aBtnShowHistoryAction.onclick = null;

    aBtnShowHistoryAction.onclick = async function() {
        // Ищем объект для поиска / создаём новый ---
        let wordStatusHistoryItemsForFind = _wordStatusHistoryItemsForFindMap.get(wordId);
        if (!wordStatusHistoryItemsForFind) {
            // Создаём таблицу ---
            let tableHistory = document.createElement("table");
            tableHistory.classList.add(_CSS_MAIN.TABLE_STANDARD_STYLE_ID);

            let colgroupParent = document.getElementById(_MY_WORD_HISTORY_TABLE_COLGROUP_ID);
            colgroupParent = colgroupParent.cloneNode(true);
            tableHistory.appendChild(colgroupParent);

            let tBodyHistory = document.createElement("tbody");
            tBodyHistory.appendChild(_TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrLoading())
            tableHistory.appendChild(tBodyHistory);
            //---

            // Подготавливаем таймер ---
            let customTimerHistoryFinder = new CustomTimer();
            customTimerHistoryFinder.setTimeout(_TIMEOUT_FOR_FINDERS);
            customTimerHistoryFinder.setHandler(async function() {
                await tryToFillWordStatusHistoryCurrentWordTable(wordId);
            });
            //---

            wordStatusHistoryItemsForFind = new WordStatusHistoryItemsForFind(
                tableHistory, colgroupParent, tBodyHistory, customTimerHistoryFinder);
            _wordStatusHistoryItemsForFindMap.set(wordId, wordStatusHistoryItemsForFind);
        }
        //---

        // Добавляем контейнер с историей к родителю ---
        let divHistoryContainer =
            _TABLE_UTILS.createElementBetweenTwoHorizontalDelimiters(wordStatusHistoryItemsForFind.tableHistory);
        parentElement.appendChild(divHistoryContainer);
        //---

        startToFindWordStatusHistoryByCurrentWord(wordStatusHistoryItemsForFind);
        changeToHideHistoryAction(aBtnShowHistoryAction, parentElement, wordId);
    }
}

function changeToHideHistoryAction(aBtnShowHistoryAction, parentElement, wordId) {
    _A_BUTTONS.A_BUTTON_ARROW_UP.setStyles(aBtnShowHistoryAction);
    aBtnShowHistoryAction.title = "Скрыть историю изменения статуса слова";
    aBtnShowHistoryAction.onclick = null;

    aBtnShowHistoryAction.onclick = async function() {
        // Завершаем поиск, удаляем контейнер с историей из родителя ---
        let wordStatusHistoryItemsForFind = _wordStatusHistoryItemsForFindMap.get(wordId);
        if (wordStatusHistoryItemsForFind) {
            wordStatusHistoryItemsForFind.customTimerFinder.stop();
            parentElement.removeChild(wordStatusHistoryItemsForFind.tableHistory.parentElement);
        }
        //---

        changeToShowHistoryAction(aBtnShowHistoryAction, parentElement, wordId);
    }
}
//---

// Генерация таблицы истории изменения статусов конкретного слова ---
function startToFindWordStatusHistoryByCurrentWord(wordStatusHistoryItemsForFind) {
    if (wordStatusHistoryItemsForFind) {
        wordStatusHistoryItemsForFind.customTimerFinder.stop();
    }

    let colgroupHistory = wordStatusHistoryItemsForFind.colgroupHistory;
    let tBodyHistory = wordStatusHistoryItemsForFind.tBodyHistory;
    if (tBodyHistory) {
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByColgroup(colgroupHistory);
        let trLoading = _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrLoading(numberOfColumns);
        for (let trChild of trLoading.childNodes) {
            trChild.style.padding = "20px";
        }

        tBodyHistory.replaceChildren();
        tBodyHistory.appendChild(trLoading);
    }

    if (wordStatusHistoryItemsForFind) {
        wordStatusHistoryItemsForFind.customTimerFinder.start();
    }
}

async function tryToFillWordStatusHistoryCurrentWordTable(wordId) {
    let wordStatusHistoryItemsForFind = _wordStatusHistoryItemsForFindMap.get(wordId);
    if (wordStatusHistoryItemsForFind) {
        let currentFinder = wordStatusHistoryItemsForFind.customTimerFinder;

        let JSONResponse = await _WORD_STATUS_HISTORIES.GET.getAllByWordId(wordId);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            let tableRows = createWordStatusHistoryCurrentWordTableRows(JSONResponse.json);
            let tableBody = wordStatusHistoryItemsForFind.tBodyHistory;
            if (tableRows && tableBody && currentFinder.getActive() === true) {
                tableBody.replaceChildren();
                for (let i = 0; i < tableRows.length; i++) {
                    if (currentFinder.getActive() !== true) break;
                    tableBody.appendChild(tableRows[i]);
                }
            }
        } else {
            let colgroup = wordStatusHistoryItemsForFind.colgroupHistory;
            let tableBody = wordStatusHistoryItemsForFind.tBodyHistory;
            if (colgroup && tableBody) {
                let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByColgroup(colgroup);
                let trMessage = _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrCommon(
                    numberOfColumns, new CustomResponseMessage(JSONResponse.json).text);

                if (currentFinder.getActive() === true) {
                    tableBody.replaceChildren();
                    if (currentFinder.getActive() === true) {
                        tableBody.appendChild(trMessage);
                    }
                }
            }
        }
    }
}

function createWordStatusHistoryCurrentWordTableRows(wordStatusHistoriesJson) {
    let tableRows;

    if (wordStatusHistoriesJson) {
        tableRows = [];
        for (let i = 0; i < wordStatusHistoriesJson.length; i++) {
            let wordStatusHistory =
                new WordStatusHistoryResponseDTO(wordStatusHistoriesJson[i]);
            let row = createTableRowWithoutActionColumn(wordStatusHistory, null);

            if (row) {
                let tdEmpty = document.createElement("td");
                row.appendChild(tdEmpty);

                for (let i = 0; i < row.childElementCount; i++) {
                    row.children.item(i).style.padding = "20px";
                }

                tableRows.push(row);
            }
        }
    }

    return tableRows;
}
//---