import {
    GlobalCookies
} from "../../classes/global_cookies.js";

import {
    CustomTimer
} from "../../classes/custom_timer/custom_timer.js";

import {
    HttpStatuses
} from "../../classes/http_statuses.js";

import {
    WordStatuses
} from "../../classes/api/word_statuses/word_statuses.js";

import {
    DateParts
} from "../../classes/date_parts.js";

import {
    WordStatusWithCount,
    compareWordStatusWithCount
} from "../../classes/dto/types/TODO/word_status_with_count.js";

import {
    CustomResponseMessage
} from "../../classes/dto/other/custom_response_message.js";

import {
    WordResponseDTO
} from "../../classes/dto/entity/word.js";

import {
    WordInCollectionRequestDTO,
    WordInCollectionResponseDTO
} from "../../classes/dto/entity/word_in_collection.js";

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
    CustomerCollectionUtils
} from "../../classes/utils/entity/customer_collection_utils.js";

import {
    WordStatusesAPI
} from "../../classes/api/word_statuses/word_statuses_api.js";

import {
    CustomerCollectionsAPI
} from "../../classes/api/customer_collections_api.js";

import {
    WordsAPI
} from "../../classes/api/words_api.js";

import {
    WordsInCollectionAPI
} from "../../classes/api/words_in_collection_api.js";

import {
    TableUtils
} from "../../classes/utils/table_utils.js";

import {
    LoadingElement
} from "../../classes/loading_element.js";

import {
    AButtons
} from "../../classes/a_buttons.js";

import {
    ComboBoxUtils
} from "../../classes/utils/combo_box_utils.js";

import {
    WordTableUtils
} from "../../classes/utils/for_templates/word_table_utils.js";

import {
    CustomTimerUtils
} from "../../classes/utils/custom_timer_utils.js";

import {
    CustomerCollectionResponseDTO
} from "../../classes/dto/entity/customer_collection.js";

import {
    FlagElements
} from "../../classes/flag_elements.js";

const _WORD_STATUSES_API = new WordStatusesAPI();
const _CUSTOMER_COLLECTIONS_API = new CustomerCollectionsAPI();
const _WORDS_API = new WordsAPI();
const _WORDS_IN_COLLECTION_API = new WordsInCollectionAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _GLOBAL_COOKIES = new GlobalCookies();
const _WORD_STATUSES = new WordStatuses();
const _LANG_UTILS = new LangUtils();
const _CUSTOMER_COLLECTION_UTILS = new CustomerCollectionUtils();
const _TABLE_UTILS = new TableUtils();
const _A_BUTTONS = new AButtons();
const _COMBO_BOX_UTILS = new ComboBoxUtils();
const _WORD_TABLE_UTILS = new WordTableUtils();
const _CUSTOM_TIMER_UTILS = new CustomTimerUtils();
const _FLAG_ELEMENTS = new FlagElements();

const _CB_CUSTOMER_COLLECTIONS_ID = "cb_customer_collections";
const _TB_FINDER_ID = "tb_finder";
const _CB_LANGS_ID = "cb_langs";
const _WORDS_TABLE_HEAD_ID = "words_table_head";
const _WORDS_TABLE_BODY_ID = "words_table_body";
const _DIV_COLLECTION_INFO_ID = "div_collection_info";
const _DIV_WORDS_STATISTICS_CONTAINER_ID = "words_statistics_container";
const _BTN_REFRESH_ID = "btn_refresh";
const _DIV_LANG_FLAG_ID = "lang_flag";
const _DIV_COLLECTION_FLAG_ID = "collection_flag";

const _NUMBER_OF_WORDS = 20;
let _lastWordNumberInList = 0;
let _lastWordIdOnPreviousPage = 0n;

const _CUSTOM_TIMER_STATISTIC_WAITER = new CustomTimer();
const _CUSTOM_TIMER_STATISTIC_FINDER = new CustomTimer();
let _accessToFillStatistic = true;

const _CUSTOM_TIMER_COLLECTION_INFO_WAITER = new CustomTimer();
const _CUSTOM_TIMER_COLLECTION_INFO_FINDER = new CustomTimer();
let _accessToFillCollectionInfo = true;

const _CUSTOM_TIMER_TABLE_WAITER = new CustomTimer();
const _CUSTOM_TIMER_TABLE_FINDER = new CustomTimer();
let _accessToFillTable = true;

window.onload = async function () {
    prepareStatisticTimers();
    prepareCollectionInfoTimers();
    prepareTableTimers();

    await prepareCbCustomerCollections();
    await prepareCbLangs();
    prepareTbFinder();
    prepareBtnRefresh();

    startTimers();
}

function prepareStatisticTimers() {
    _CUSTOM_TIMER_STATISTIC_WAITER.handler = function () {
        _accessToFillStatistic = false;

        let wordsStatisticContainer = document.getElementById(_DIV_WORDS_STATISTICS_CONTAINER_ID);
        wordsStatisticContainer.replaceChildren();
        wordsStatisticContainer.appendChild(new LoadingElement().createDiv());
    }

    _CUSTOM_TIMER_STATISTIC_FINDER.handler = async function () {
        _accessToFillStatistic = true;
        await tryToFillStatistic();
    }
}

function prepareCollectionInfoTimers() {
    _CUSTOM_TIMER_COLLECTION_INFO_WAITER.handler = function() {
        _accessToFillCollectionInfo = false;

        let divCollectionInfo = document.getElementById(_DIV_COLLECTION_INFO_ID);
        divCollectionInfo.replaceChildren();
        divCollectionInfo.appendChild(new LoadingElement().createDiv());
    }

    _CUSTOM_TIMER_COLLECTION_INFO_FINDER.handler = async function() {
        _accessToFillCollectionInfo = true;
        await tryToFillCollectionInfo();
    }
}

function prepareTableTimers() {
    _CUSTOM_TIMER_TABLE_WAITER.handler = function () {
        _accessToFillTable = false;

        // Отображаем загрузку в таблице ---
        let tableHead = document.getElementById(_WORDS_TABLE_HEAD_ID);
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);
        let trMessage = _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrLoading(numberOfColumns);

        let tableBody = document.getElementById(_WORDS_TABLE_BODY_ID);
        tableBody.replaceChildren();
        tableBody.appendChild(trMessage);
        //---
    }

    _CUSTOM_TIMER_TABLE_FINDER.handler = async function () {
        _accessToFillTable = true;
        await tryToFillTable();
    }
}

function startTimers() {
    _CUSTOM_TIMER_UTILS.findAfterWait(_CUSTOM_TIMER_STATISTIC_WAITER, _CUSTOM_TIMER_STATISTIC_FINDER);

    let authId = _GLOBAL_COOKIES.AUTH_ID.getValue();
    if (authId) {
        _CUSTOM_TIMER_UTILS.findAfterWait(_CUSTOM_TIMER_COLLECTION_INFO_WAITER, _CUSTOM_TIMER_COLLECTION_INFO_FINDER);
    }

    _CUSTOM_TIMER_UTILS.findAfterWait(_CUSTOM_TIMER_TABLE_WAITER, _CUSTOM_TIMER_TABLE_FINDER);
}

// Подготовка поля "Поиск"
function prepareTbFinder() {
    let tbFinder = document.getElementById(_TB_FINDER_ID);
    if (tbFinder) {
        tbFinder.addEventListener("input", async function () {
            startTimers();
        });
    }
}

// Подготовка выпадающего списка "Языки"
async function prepareCbLangs() {
    let cbLangs = document.getElementById(_CB_LANGS_ID);
    if (cbLangs) {
        let firstOption = document.createElement("option");
        firstOption.textContent = "Все";

        let divLangFlag = document.getElementById(_DIV_LANG_FLAG_ID);
        _FLAG_ELEMENTS.DIV.setStyles(divLangFlag, null, true);
        await _LANG_UTILS.prepareComboBox(cbLangs, firstOption, divLangFlag);

        // Вешаем событие обновления списка при изменении элемента выпадающего списка
        cbLangs.addEventListener("change", startTimers);
    }
}

// Подготовка выпадающего списка "Коллекция пользователя по умолчанию"
async function prepareCbCustomerCollections() {
    let cbCustomerCollections = document.getElementById(_CB_CUSTOMER_COLLECTIONS_ID);
    if (cbCustomerCollections) {
        let divCollectionFlag = document.getElementById(_DIV_COLLECTION_FLAG_ID);
        await _CUSTOMER_COLLECTION_UTILS.prepareComboBox(cbCustomerCollections, null, divCollectionFlag);

        // Создаём таймер, чтобы сменить язык в списке языков на основе языка коллекции
        // Это нужно, чтобы избежать возможных задержек при обращении к API ---
        let customTimerLangFlagChanger = new CustomTimer();
        customTimerLangFlagChanger.timeout = 1;
        customTimerLangFlagChanger.handler = async function() {
            // Ищем по ключу коллекцию и получаем из неё язык ---
            let langCode;
            let collectionKey = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(cbCustomerCollections);
            let JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET.findByKey(collectionKey);
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                let customerCollection = new CustomerCollectionResponseDTO(JSONResponse.json);

                // Берём код, только если язык активный
                JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET.validateIsLangActiveInCollectionByKey(collectionKey);
                if (JSONResponse.status === _HTTP_STATUSES.OK) {
                    langCode = customerCollection.lang.code;
                }
            }
            //---

            // Меняем язык в списке языков + его флаг ---
            let cbLangs = document.getElementById(_CB_LANGS_ID);
            cbLangs.removeEventListener("change", startTimers);
            _LANG_UTILS.changeCbLangsItemByLangCode(cbLangs, langCode, true);
            cbLangs.addEventListener("change", startTimers);
            //---
        }
        //---

        cbCustomerCollections.addEventListener("change", function () {
            customTimerLangFlagChanger.start();
            startTimers();
        });

        _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemIndex(
            cbCustomerCollections, 0, true);
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

async function sendPreparedRequest() {
    let title = document.getElementById(_TB_FINDER_ID).value;
    let langCode =  _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBoxId(_CB_LANGS_ID);

    return await _WORDS_API.GET.getAllFilteredPagination(_NUMBER_OF_WORDS, title,
        _WORD_STATUSES.ACTIVE.CODE, langCode, _lastWordIdOnPreviousPage);
}

async function tryToFillStatistic() {
    let statisticItems = await createStatisticItems();
    if (_accessToFillStatistic) {
        let wordsStatisticContainer = document.getElementById(_DIV_WORDS_STATISTICS_CONTAINER_ID);
        wordsStatisticContainer.replaceChildren();
        for (let i = 0; i < statisticItems.length; i++) {
            if (_accessToFillStatistic === true) {
                wordsStatisticContainer.appendChild(statisticItems[i]);
            }
        }
    }
}

async function createStatisticItems() {
    let statisticItems = [];

    // Генерируем статистику по всем статусам ---
    let JSONResponseWordStatuses = await _WORD_STATUSES_API.GET.getAll();
    if (JSONResponseWordStatuses.status === _HTTP_STATUSES.OK) {
        let wordStatusesJson = JSONResponseWordStatuses.json;
        let wordStatusesWithCount = [];
        let numberOfWordsSum = 0n;
        for (let i = 0; i < wordStatusesJson.length; i++) {
            let wordStatus = new WordStatusResponseDTO(wordStatusesJson[i]);
            let JSONResponseNumberOfWords =
                await _WORDS_API.GET.getCountByWordStatusCode(wordStatus.code);
            if (JSONResponseNumberOfWords.status === _HTTP_STATUSES.OK) {
                let longResponse = new LongResponse(JSONResponseNumberOfWords.json);
                numberOfWordsSum += longResponse.value;

                let wordStatusWithCount = new WordStatusWithCount(wordStatus, longResponse.value);
                wordStatusesWithCount.push(wordStatusWithCount);
            }
        }

        // Создаём контейнер с общим количеством слов ---
        let spanNumberOfWordsText = document.createElement("span");
        spanNumberOfWordsText.style.fontWeight = "bold";
        spanNumberOfWordsText.textContent = "Общее количество слов в базе";

        let spanNumberOfWordsSum = document.createElement("span");
        spanNumberOfWordsSum.textContent = `: ${numberOfWordsSum}`;

        let divNumberOfWordsSumContainer = document.createElement("div");
        divNumberOfWordsSumContainer.appendChild(spanNumberOfWordsText);
        divNumberOfWordsSumContainer.appendChild(spanNumberOfWordsSum);

        statisticItems.push(divNumberOfWordsSumContainer);
        //---

        // Создаём контейнер со статистикой по всем статусам слов ---
        wordStatusesWithCount.sort(compareWordStatusWithCount);

        let divStatisticWithWordStatuses = document.createElement("div");
        for (let i = 0; i < wordStatusesWithCount.length; i++) {
            divStatisticWithWordStatuses.appendChild(wordStatusesWithCount[i].createDiv());
        }

        statisticItems.push(divStatisticWithWordStatuses);
        //---
    }
    //---

    // Создаём контейнер с количеством слов за сегодняшний день ---
    let dateNow = new Date();
    let JSONResponseWordsToday = await _WORDS_API.GET.getCountByDateOfCreate(dateNow);
    if (JSONResponseWordsToday.status === _HTTP_STATUSES.OK) {
        let numberOfWordsToday = new LongResponse(JSONResponseWordsToday.json);
        let dateNowParts = new DateParts(dateNow);

        let spanNumberOfWordsTodayText = document.createElement("span");
        spanNumberOfWordsTodayText.style.fontWeight = "bold";
        spanNumberOfWordsTodayText.textContent = `За сегодня (${dateNowParts.getDateStr()}) добавлено`;

        let spanNumberOfWordsTodaySum = document.createElement("span");
        spanNumberOfWordsTodaySum.textContent = `: ${numberOfWordsToday.value}`;

        let divNumberOfWordsTodayContainer = document.createElement("div");
        divNumberOfWordsTodayContainer.appendChild(spanNumberOfWordsTodayText);
        divNumberOfWordsTodayContainer.appendChild(spanNumberOfWordsTodaySum);

        statisticItems.push(document.createElement("br"));
        statisticItems.push(divNumberOfWordsTodayContainer);
    }
    //---

    statisticItems.push(document.createElement("br"));
    return statisticItems;
}

async function tryToFillCollectionInfo() {
    let collectionKey = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBoxId(_CB_CUSTOMER_COLLECTIONS_ID);
    let divCollectionInfo =
        await _CUSTOMER_COLLECTION_UTILS.createDivCollectionInfoAfterValidate(collectionKey);

    let divCollectionInfoContainer = document.getElementById(_DIV_COLLECTION_INFO_ID);
    if (_accessToFillCollectionInfo === true) {
        divCollectionInfoContainer.replaceChildren();
        if (_accessToFillCollectionInfo === true) {
            divCollectionInfoContainer.appendChild(divCollectionInfo);
        }
    }
}

async function tryToFillTable() {
    let readyToFill = true;

    let authId = _GLOBAL_COOKIES.AUTH_ID.getValue();
    if (authId) {
        let collectionKey = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBoxId(_CB_CUSTOMER_COLLECTIONS_ID);
        let JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET.findByCustomerIdAndKey(authId, collectionKey);
        if (JSONResponse.status !== _HTTP_STATUSES.OK) {
            readyToFill = false;
            setMessageInsideTable(new CustomResponseMessage(JSONResponse.json).text);
        }
    }

    if (readyToFill === true) {
        _lastWordNumberInList = 0;
        _lastWordIdOnPreviousPage = 0n;

        let JSONResponse = await sendPreparedRequest();
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            let tableRows = await createTableRows(JSONResponse.json);

            if (_accessToFillTable === true) {
                let tableBody = document.getElementById(_WORDS_TABLE_BODY_ID);
                tableBody.replaceChildren();
                for (let i = 0; i < tableRows.length; i++) {
                    if (_accessToFillTable === true) {
                        tableBody.appendChild(tableRows[i]);
                    }
                }
            }
        } else {
            setMessageInsideTable(new CustomResponseMessage(JSONResponse.json).text);
        }
    }
}

async function createTableRows(wordsFilteredPaginationJson) {
    let tableRows = [];

    for (let i = 0; i < wordsFilteredPaginationJson.length; i++) {
        if (_accessToFillTable === true) {
            let word = new WordResponseDTO(wordsFilteredPaginationJson[i]);

            let row = await createTableRow(word);
            if (row) {
                tableRows.push(row);
            }

            if (i === wordsFilteredPaginationJson.length - 1) {
                _lastWordIdOnPreviousPage = word.id;
            }
        }
    }

    if (_accessToFillTable === true && wordsFilteredPaginationJson.length === _NUMBER_OF_WORDS) {
        let tableHead = document.getElementById(_WORDS_TABLE_HEAD_ID);
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);

        let trShowMore = _TABLE_UTILS.createTrShowMore(numberOfColumns,
            _NUMBER_OF_WORDS, async function() {
                let JSONResponse = await sendPreparedRequest();
                if (JSONResponse.status === _HTTP_STATUSES.OK) {
                    let tableBody = document.getElementById(_WORDS_TABLE_BODY_ID);
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

async function createTableRow(wordResponseDTO) {
    let row = document.createElement("tr");

    // Порядковый номер строки ---
    let numberColumn = document.createElement("td");
    numberColumn.style.textAlign = "center";
    numberColumn.textContent = `${++_lastWordNumberInList}.`;
    row.appendChild(numberColumn);
    //---

    // Текст слова ---
    let titleColumn = document.createElement("td");
    titleColumn.textContent = wordResponseDTO.title;
    row.appendChild(titleColumn);
    //---

    // Язык ---
    let langColumn = document.createElement("td");
    langColumn.appendChild(wordResponseDTO.lang.createDiv());
    row.appendChild(langColumn);
    //---

    // Кнопка добавления/удаления слова (только для авторизированных пользователей) ---
    let authId = _GLOBAL_COOKIES.AUTH_ID.getValue();
    if (authId) {
        let wordInCollectionRequestDTO = new WordInCollectionRequestDTO();
        wordInCollectionRequestDTO.wordId = wordResponseDTO.id;
        wordInCollectionRequestDTO.collectionKey =
            _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBoxId(_CB_CUSTOMER_COLLECTIONS_ID);

        let actionColumn = document.createElement("td");
        actionColumn.appendChild(await createBtnAction(wordInCollectionRequestDTO));
        row.appendChild(actionColumn);
    }
    //---

    return row;
}

function setMessageInsideTable(message) {
    let tableHead = document.getElementById(_WORDS_TABLE_HEAD_ID);
    let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);
    let trMessage = _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrCommon(numberOfColumns, message);

    let tableBody = document.getElementById(_WORDS_TABLE_BODY_ID);
    if (_accessToFillTable === true) {
        tableBody.replaceChildren();
        if (_accessToFillTable === true) {
            tableBody.appendChild(trMessage);
        }
    }
}

async function createBtnAction(wordInCollectionRequestDTO) {
    let aBtnAction = _A_BUTTONS.A_BUTTON_ACCEPT.createA();

    let wordId = wordInCollectionRequestDTO.wordId;
    let collectionKey = wordInCollectionRequestDTO.collectionKey;
    let JSONResponse = await _WORDS_IN_COLLECTION_API.GET.validateLangsInWordAndCollection(
        wordId, collectionKey);
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        JSONResponse = await
            _WORDS_IN_COLLECTION_API.GET.findByWordIdAndCollectionKey(wordId, collectionKey);
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            let wordInCollection = new WordInCollectionResponseDTO(JSONResponse.json);
            wordInCollectionRequestDTO.id = wordInCollection.id;

            await _WORD_TABLE_UTILS.changeToRemoveAction(aBtnAction, wordInCollectionRequestDTO);
        } else {
            await _WORD_TABLE_UTILS.changeToAddAction(aBtnAction, wordInCollectionRequestDTO);
        }

        aBtnAction.addEventListener("click", function () {
            _CUSTOM_TIMER_UTILS.findAfterWait(_CUSTOM_TIMER_COLLECTION_INFO_WAITER, _CUSTOM_TIMER_COLLECTION_INFO_FINDER);
        })
    } else {
        _A_BUTTONS.A_BUTTON_DISABLED.setStyles(aBtnAction);

        let message = new CustomResponseMessage(JSONResponse.json);
        aBtnAction.title = message.text;
    }



    let divContainer = document.createElement("div");
    divContainer.style.display = "flex";
    divContainer.style.justifyContent = "center";
    divContainer.style.alignItems = "center";
    divContainer.appendChild(aBtnAction);

    return divContainer;
}