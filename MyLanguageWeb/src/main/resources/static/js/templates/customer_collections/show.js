import {
    CustomTimer
} from "../../classes/custom_timer/custom_timer.js";

import {
    HttpStatuses
} from "../../classes/http_statuses.js";

import {
    GlobalCookies
} from "../../classes/global_cookies.js";

import {
    compareLangWithCount,
    LangWithCount
} from "../../classes/dto/types/TODO/lang_with_count.js";

import {
    changeEndOfTheWordByNumberOfItems,
    EndOfTheWord
} from "../../classes/end_of_the_word.js";

import {
    WordInCollectionRequestDTO,
    WordInCollectionResponseDTO
} from "../../classes/dto/entity/word_in_collection.js";

import {
    LangResponseDTO
} from "../../classes/dto/entity/lang.js";

import {
    LongResponse
} from "../../classes/dto/other/long_response.js";

import {
    CustomResponseMessage
} from "../../classes/dto/other/custom_response_message.js";

import {
    CustomerCollectionUtils
} from "../../classes/utils/entity/customer_collection_utils.js";

import {
    LangsAPI
} from "../../classes/api/langs_api.js";

import {
    CustomerCollectionsAPI
} from "../../classes/api/customer_collections_api.js";

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

const _LANGS_API = new LangsAPI();
const _CUSTOMER_COLLECTIONS_API = new CustomerCollectionsAPI();
const _WORDS_IN_COLLECTION_API = new WordsInCollectionAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _GLOBAL_COOKIES = new GlobalCookies();
const _CUSTOMER_COLLECTION_UTILS = new CustomerCollectionUtils();
const _TABLE_UTILS = new TableUtils();
const _A_BUTTONS = new AButtons();
const _COMBO_BOX_UTILS = new ComboBoxUtils();
const _WORD_TABLE_UTILS = new WordTableUtils();
const _CUSTOM_TIMER_UTILS = new CustomTimerUtils();

const _TB_FINDER_ID = "tb_finder";
const _CB_CUSTOMER_COLLECTIONS_ID = "cb_customer_collections";
const _DIV_COLLECTION_INFO_ID = "div_collection_info";
const _COLLECTION_WORD_TABLE_HEAD_ID = "collection_word_table_head";
const _COLLECTION_WORD_TABLE_BODY_ID = "collection_word_table_body";
const _DIV_COLLECTIONS_STATISTICS_CONTAINER_ID = "collections_statistics_container";
const _BTN_REFRESH_ID = "btn_refresh";
const _DIV_COLLECTION_FLAG_ID = "collection_flag";

const _MAX_NUMBER_OF_COLLECTIONS_FOR_STATISTICS = 5;
const _NUMBER_OF_WORDS = 20;
let _lastWordNumberInList = 0;
let _lastWordInCollectionIdOnPreviousPage = 0n;

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
    prepareTbFinder();
    prepareBtnRefresh();

    startTimers();
}

function prepareStatisticTimers() {
    _CUSTOM_TIMER_STATISTIC_WAITER.handler = function () {
        _accessToFillStatistic = false;

        let divStatistics = document.getElementById(_DIV_COLLECTIONS_STATISTICS_CONTAINER_ID);
        divStatistics.replaceChildren();
        divStatistics.appendChild(new LoadingElement().createDiv());
    }

    _CUSTOM_TIMER_STATISTIC_FINDER.handler = async function () {
        _accessToFillStatistic = true;
        await tryToFillStatistic();
    }
}

function prepareCollectionInfoTimers() {
    _CUSTOM_TIMER_COLLECTION_INFO_WAITER.handler = function () {
        _accessToFillCollectionInfo = false;

        let divCollectionInfo = document.getElementById(_DIV_COLLECTION_INFO_ID);
        divCollectionInfo.replaceChildren();
        divCollectionInfo.appendChild(new LoadingElement().createDiv());
    }

    _CUSTOM_TIMER_COLLECTION_INFO_FINDER.handler = async function () {
        _accessToFillCollectionInfo = true;
        await tryToFillCollectionInfo();
    }
}

function prepareTableTimers() {
    _CUSTOM_TIMER_TABLE_WAITER.handler = function () {
        _accessToFillTable = false;
        // Отображаем загрузку в таблице ---
        let tableHead = document.getElementById(_COLLECTION_WORD_TABLE_HEAD_ID);
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);
        let trMessage =
            _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrLoading(numberOfColumns);

        let tableBody = document.getElementById(_COLLECTION_WORD_TABLE_BODY_ID);
        tableBody.replaceChildren();
        tableBody.appendChild(trMessage);
        //---
    }

    _CUSTOM_TIMER_TABLE_FINDER.handler = async function() {
        _accessToFillTable = true;
        await tryToFillTable();
    }
}

function startTimers() {
    _CUSTOM_TIMER_UTILS.findAfterWait(_CUSTOM_TIMER_STATISTIC_WAITER, _CUSTOM_TIMER_STATISTIC_FINDER);
    _CUSTOM_TIMER_UTILS.findAfterWait(_CUSTOM_TIMER_COLLECTION_INFO_WAITER, _CUSTOM_TIMER_COLLECTION_INFO_FINDER);
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

// Подготовка выпадающего списка "Коллекции пользователя"
async function prepareCbCustomerCollections() {
    let cbCustomerCollections = document.getElementById(_CB_CUSTOMER_COLLECTIONS_ID);
    if (cbCustomerCollections) {
        let divCollectionFlag = document.getElementById(_DIV_COLLECTION_FLAG_ID);
        await _CUSTOMER_COLLECTION_UTILS.prepareComboBox(cbCustomerCollections, null, divCollectionFlag);

        cbCustomerCollections.addEventListener("change", async function () {
            startTimers();
        })

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

async function tryToFillStatistic() {
    let statisticItems = await createStatisticItems();
    if (_accessToFillStatistic === true) {
        let divStatistics = document.getElementById(_DIV_COLLECTIONS_STATISTICS_CONTAINER_ID);
        divStatistics.replaceChildren();
        if (_accessToFillStatistic) {
            for (let i = 0; i < statisticItems.length; i++) {
                divStatistics.appendChild(statisticItems[i]);
            }
        }
    }
}

async function createStatisticItems() {
    let statisticItems = [];

    // Генерируем статистику по всем коллекциям слов по языкам ---
    let JSONResponseLangs = await _LANGS_API.GET.getAll();
    if (JSONResponseLangs.status === _HTTP_STATUSES.OK) {
        let langsWithCount = [];
        let numberOfCollectionsSum = 0n;

        // Ищем все коллекции пользователя по всем языкам ---
        let authId = _GLOBAL_COOKIES.AUTH_ID.getValue();
        let json = JSONResponseLangs.json;
        for (let i = 0; i < json.length; i++) {
            if (_accessToFillStatistic === true) {
                let lang = new LangResponseDTO(json[i]);
                let JSONResponse =
                    await _CUSTOMER_COLLECTIONS_API.GET.getCountByCustomerIdAndLangCode(BigInt(authId), lang.code);
                if (JSONResponse.status === _HTTP_STATUSES.OK) {
                    let longResponse = new LongResponse(JSONResponse.json);
                    let numberOfCollections = longResponse.value;
                    if (numberOfCollections > 0) {
                        numberOfCollectionsSum += numberOfCollections;

                        let langWithCount =
                            new LangWithCount(lang, numberOfCollections);
                        if (_accessToFillStatistic === true) {
                            langsWithCount.push(langWithCount);
                        }
                    }
                }
            }
        }
        //---

        // Генерируем статистику по коллекциям пользователя ---
        langsWithCount.sort(compareLangWithCount);

        let mostImportantCollectionsSum = 0n;
        let divStatisticForCollectionsWithLangs = document.createElement("div");
        for (let i = 0; i < langsWithCount.length; i++) {
            if (i === _MAX_NUMBER_OF_COLLECTIONS_FOR_STATISTICS) break;

            mostImportantCollectionsSum += langsWithCount[i].count;

            let divLangWithCount = langsWithCount[i].createDiv();
            divStatisticForCollectionsWithLangs.appendChild(divLangWithCount);
        }
        //---

        // Сумма всех коллекций пользователя ---
        let spanNumberOfCollectionsText = document.createElement("span");
        spanNumberOfCollectionsText.style.fontWeight = "bold";
        spanNumberOfCollectionsText.textContent = "Общее количество ваших коллекций";

        let spanNumberOfCollectionsSum = document.createElement("span");
        spanNumberOfCollectionsSum.textContent = `: ${numberOfCollectionsSum}`;

        let divNumberOfCollectionsSumContainer = document.createElement("div");
        divNumberOfCollectionsSumContainer.appendChild(spanNumberOfCollectionsText);
        divNumberOfCollectionsSumContainer.appendChild(spanNumberOfCollectionsSum);
        //---

        // Если коллекций на различных языках больше, чем заявленный максимум, отображаем специальное сообщение ---
        let divOtherCollectionsSumContainer;
        let otherCollectionsSum = numberOfCollectionsSum - mostImportantCollectionsSum;
        if (otherCollectionsSum > 0) {
            divOtherCollectionsSumContainer = document.createElement("div");

            let collectionsWord = changeEndOfTheWordByNumberOfItems("коллекция", otherCollectionsSum,
                new EndOfTheWord("й", 1),
                new EndOfTheWord("и", 1),
                null,
                new EndOfTheWord("й", 1));

            let otherLangs = langsWithCount.length - _MAX_NUMBER_OF_COLLECTIONS_FOR_STATISTICS;
            let langsWord = changeEndOfTheWordByNumberOfItems("язык", otherCollectionsSum,
                new EndOfTheWord("ах", 0),
                new EndOfTheWord("ах", 0),
                new EndOfTheWord("е", 0),
                new EndOfTheWord("ах", 0));

            let spanOtherCollectionsSum = document.createElement("span");
            spanOtherCollectionsSum.style.fontWeight = "bold";
            spanOtherCollectionsSum.textContent = `...и ещё ${otherCollectionsSum} ${collectionsWord} на 
                    ${otherLangs} ${langsWord}.`;
            divOtherCollectionsSumContainer.appendChild(spanOtherCollectionsSum);
        }
        //---

        // Добавляем элементы в основной контейнер ---
        let divStatistic = document.createElement("div");
        divStatistic.appendChild(divNumberOfCollectionsSumContainer);
        divStatistic.appendChild(divStatisticForCollectionsWithLangs);
        if (divOtherCollectionsSumContainer) {
            divStatistic.appendChild(divOtherCollectionsSumContainer);
        }
        divStatistic.appendChild(document.createElement("br"));

        statisticItems.push(divStatistic);
        //---
    }
    //---

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

async function sendPreparedRequest() {
    let collectionKey = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBoxId(_CB_CUSTOMER_COLLECTIONS_ID);
    let title = document.getElementById(_TB_FINDER_ID).value;

    return await _WORDS_IN_COLLECTION_API.GET.getAllInCollectionFilteredPagination(collectionKey,
        _NUMBER_OF_WORDS, title, _lastWordInCollectionIdOnPreviousPage);
}

async function tryToFillTable() {
    // Проверяем соответствие коллекции с авторизированным пользователем ---
    let readyToFill = true;
    let authId = _GLOBAL_COOKIES.AUTH_ID.getValue();
    let collectionKey = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBoxId(_CB_CUSTOMER_COLLECTIONS_ID);
    let JSONResponse = await
        _CUSTOMER_COLLECTIONS_API.GET.findByCustomerIdAndKey(authId, collectionKey);
    if (JSONResponse.status !== _HTTP_STATUSES.OK) {
        readyToFill = false;
        setMessageInsideTable(new CustomResponseMessage(JSONResponse.json).text);
    }

    if (readyToFill === true) {
        _lastWordNumberInList = 0;
        _lastWordInCollectionIdOnPreviousPage = 0n;

        JSONResponse = await sendPreparedRequest();
        if (JSONResponse.status === _HTTP_STATUSES.OK) {
            let tableRows = await createTableRows(JSONResponse.json);
            if (_accessToFillTable === true) {
                let tableBody = document.getElementById(_COLLECTION_WORD_TABLE_BODY_ID);
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

async function createTableRows(allWordsInCollectionFilteredPaginationJson){
    let tableRows = [];

    for (let i = 0; i < allWordsInCollectionFilteredPaginationJson.length; i++) {
        if (_accessToFillTable === true) {
            let wordInCollection =
                new WordInCollectionResponseDTO(allWordsInCollectionFilteredPaginationJson[i]);

            let row = await createTableRow(wordInCollection);
            if (row) {
                tableRows.push(row);
            }

            // Получаем id последнего элемента JSON-коллекции
            if (i === allWordsInCollectionFilteredPaginationJson.length - 1) {
                _lastWordInCollectionIdOnPreviousPage = wordInCollection.id;
            }
        }
    }

    // Создаем кнопку "Показать больше", если запрос вернул максимальное количество на страницу
    if (_accessToFillTable === true && allWordsInCollectionFilteredPaginationJson.length === _NUMBER_OF_WORDS) {
        let tableHead = document.getElementById(_COLLECTION_WORD_TABLE_HEAD_ID);
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);

        let trShowMore = _TABLE_UTILS.createTrShowMore(numberOfColumns,
            _NUMBER_OF_WORDS, async function (){
                let JSONResponse = await sendPreparedRequest();
                if (JSONResponse.status === _HTTP_STATUSES.OK) {
                    let tableBody = document.getElementById(_COLLECTION_WORD_TABLE_BODY_ID);
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

async function createTableRow(wordInCollectionResponseDTO) {
    let row = document.createElement("tr");

    // Порядковый номер ---
    let numberColumn = document.createElement("td");
    numberColumn.style.textAlign = "center";
    numberColumn.textContent = `${++_lastWordNumberInList}.`;
    row.appendChild(numberColumn);
    //---

    // Название слова ---
    let titleColumn = document.createElement("td");
    titleColumn.textContent = wordInCollectionResponseDTO.word.title;
    row.appendChild(titleColumn);
    //---

    // Язык ---
    let langColumn = document.createElement("td");
    langColumn.appendChild(wordInCollectionResponseDTO.word.lang.createSpan());
    row.appendChild(langColumn);
    //---

    // Действия ---
    let actionColumn = document.createElement("td");
    let wordInCollectionRequestDTO = new WordInCollectionRequestDTO();
    wordInCollectionRequestDTO.id = wordInCollectionResponseDTO.id;
    wordInCollectionRequestDTO.wordId = wordInCollectionResponseDTO.word.id;
    wordInCollectionRequestDTO.collectionKey = wordInCollectionResponseDTO.customerCollection.key;

    actionColumn.appendChild(await createBtnAction(wordInCollectionRequestDTO));
    row.appendChild(actionColumn);
    //---

    return row;
}

function setMessageInsideTable(message) {
    let tableHead = document.getElementById(_COLLECTION_WORD_TABLE_HEAD_ID);
    let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);
    let trMessage =
        _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrCommon(numberOfColumns, message);

    let tableBody = document.getElementById(_COLLECTION_WORD_TABLE_BODY_ID);
    if (_accessToFillTable === true) {
        tableBody.replaceChildren();
        if (_accessToFillTable === true) {
            tableBody.appendChild(trMessage);
        }
    }
}

// Создание кнопки события
async function createBtnAction(wordInCollectionRequestDTO) {
    let aBtnAction = _A_BUTTONS.A_BUTTON_DENY.createA();
    await _WORD_TABLE_UTILS.changeToRemoveAction(aBtnAction, wordInCollectionRequestDTO);

    aBtnAction.addEventListener("click", function () {
        _CUSTOM_TIMER_UTILS.findAfterWait(_CUSTOM_TIMER_COLLECTION_INFO_WAITER, _CUSTOM_TIMER_COLLECTION_INFO_FINDER);
    })

    let divContainer = document.createElement("div");
    divContainer.style.display = "flex";
    divContainer.style.justifyContent = "center";
    divContainer.style.alignItems = "center";
    divContainer.appendChild(aBtnAction);

    return divContainer;
}



