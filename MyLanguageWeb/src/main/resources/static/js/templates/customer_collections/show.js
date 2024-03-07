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
    changeEndOfTheWordByNumberOfItems,
    EndOfTheWord
} from "../../classes/end_of_the_word.js";

import {
    WordInCollectionRequestDTO,
    WordInCollectionResponseDTO
} from "../../classes/dto/entity/word_in_collection.js";

import {
    CustomResponseMessage
} from "../../classes/dto/other/custom_response_message.js";

import {
    CustomerCollectionUtils
} from "../../classes/utils/entity/customer_collection_utils.js";

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
} from "../../classes/a_buttons/a_buttons.js";

import {
    ComboBoxUtils
} from "../../classes/utils/combo_box_utils.js";

import {
    WordTableUtils
} from "../../classes/utils/for_templates/word_table_utils.js";

import {
    TextBoxUtils
} from "../../classes/utils/text_box_utils.js";

import {
    CustomerCollectionsWithLangStatisticResponseDTO
} from "../../classes/dto/types/customer_collections_with_lang_statistic.js";

import {
    AButtonImgSizes
} from "../../classes/a_buttons/a_button_img_sizes.js";

import {
    ComboBoxWithFlag
} from "../../classes/element_with_flag/combo_box_with_flag.js";

const _CUSTOMER_COLLECTIONS_API = new CustomerCollectionsAPI();
const _WORDS_IN_COLLECTION_API = new WordsInCollectionAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _GLOBAL_COOKIES = new GlobalCookies();
const _CUSTOMER_COLLECTION_UTILS = new CustomerCollectionUtils();
const _TABLE_UTILS = new TableUtils();
const _A_BUTTONS = new AButtons();
const _COMBO_BOX_UTILS = new ComboBoxUtils();
const _WORD_TABLE_UTILS = new WordTableUtils();
const _TEXT_BOX_UTILS = new TextBoxUtils();
const _A_BUTTON_IMG_SIZES = new AButtonImgSizes();

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

const _CUSTOM_TIMER_STATISTIC_FINDER = new CustomTimer();
const _CUSTOM_TIMER_COLLECTION_INFO_FINDER = new CustomTimer();
const _CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER = new CustomTimer();
const _CUSTOM_TIMER_TB_FINDER = new CustomTimer();
const _TIMEOUT_FOR_FINDERS = 1000;

window.onload = async function () {
    // Подготавливаем таймеры ---
    prepareStatisticFinder();
    prepareCollectionInfoFinder();
    prepareWordsInCollectionFinder();
    //---

    await prepareCbCustomerCollections();
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

async function prepareCbCustomerCollections() {
    let cbCustomerCollections = document.getElementById(_CB_CUSTOMER_COLLECTIONS_ID);
    let divCollectionFlag = document.getElementById(_DIV_COLLECTION_FLAG_ID);
    if (cbCustomerCollections && divCollectionFlag) {
        let comboBoxWithFlag =
            new ComboBoxWithFlag(cbCustomerCollections.parentElement, cbCustomerCollections, divCollectionFlag);
        await _CUSTOMER_COLLECTION_UTILS.CB_CUSTOMER_COLLECTIONS.prepare(
            comboBoxWithFlag, null, false);

        cbCustomerCollections.addEventListener("change", startAllFinders);
    }
}

function prepareBtnRefresh() {
    let btnRefresh = document.getElementById(_BTN_REFRESH_ID);
    if (btnRefresh) {
        btnRefresh.addEventListener("click", async function() {
            startAllFinders();
        });
    }
}

function startAllFinders() {
    startToFindStatistic();
    startToFindCollectionInfo();
    startToFindWordsInCollection();
}

// Статистика ---
function prepareStatisticFinder() {
    _CUSTOM_TIMER_STATISTIC_FINDER.setTimeout(_TIMEOUT_FOR_FINDERS);
    _CUSTOM_TIMER_STATISTIC_FINDER.setHandler(async function () {
        await tryToFillStatistic();
    });
}

function startToFindStatistic() {
    if (_CUSTOM_TIMER_STATISTIC_FINDER) {
        _CUSTOM_TIMER_STATISTIC_FINDER.stop();
    }

    let divStatistics = document.getElementById(_DIV_COLLECTIONS_STATISTICS_CONTAINER_ID);
    if (divStatistics) {
        divStatistics.replaceChildren();

        divStatistics.style.display = "grid";
        divStatistics.style.alignItems = "center";
        divStatistics.appendChild(new LoadingElement().createDiv());
    }

    if (_CUSTOM_TIMER_STATISTIC_FINDER) {
        _CUSTOM_TIMER_STATISTIC_FINDER.start();
    }
}

async function tryToFillStatistic() {
    let currentFinder = _CUSTOM_TIMER_COLLECTION_INFO_FINDER;
    let statisticItems = await createStatisticItems();

    let divStatistics = document.getElementById(_DIV_COLLECTIONS_STATISTICS_CONTAINER_ID);
    if (divStatistics && currentFinder.getActive() === true) {
        divStatistics.replaceChildren();
        divStatistics.style.cssText = "";
        for (let i = 0; i < statisticItems.length; i++) {
            if (currentFinder.getActive() !== true) break;
            divStatistics.appendChild(statisticItems[i]);
        }
    }
}

async function createStatisticItems() {
    let statisticItems = [];

    // Генерируем статистику по всем коллекциям слов с языком ---
    let authId = _GLOBAL_COOKIES.AUTH_ID.getValue();
    let JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET.getCustomerCollectionsWithLangStatisticsByCustomerId(authId);
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        let divStatistics = [];
        let sumOfCollections = 0n;
        let extraSumOfCollections = 0n;
        let extraSumOfLangs = 0n;

        let json = JSONResponse.json;
        for (let i = 0; i < json.length; i++) {
            let customerCollectionsWithLangStatistic =
                new CustomerCollectionsWithLangStatisticResponseDTO(json[i]);

            sumOfCollections += customerCollectionsWithLangStatistic.numberOfCollections;
            if (divStatistics.length >= _MAX_NUMBER_OF_COLLECTIONS_FOR_STATISTICS) {
                extraSumOfCollections += customerCollectionsWithLangStatistic.numberOfCollections;
                extraSumOfLangs++;
            } else {
                let divStatistic = await customerCollectionsWithLangStatistic.createDiv();
                if (divStatistic) {
                    divStatistics.push(divStatistic);
                }
            }
        }

        // Сумма всех коллекций пользователя ---
        let spanSumOfCollectionsText = document.createElement("span");
        spanSumOfCollectionsText.style.fontWeight = "bold";
        spanSumOfCollectionsText.textContent = "Общее количество ваших коллекций";

        let spanSumOfCollections = document.createElement("span");
        spanSumOfCollections.textContent = `: ${sumOfCollections}`;

        let divSumOfCollectionsContainer = document.createElement("div");
        divSumOfCollectionsContainer.appendChild(spanSumOfCollectionsText);
        divSumOfCollectionsContainer.appendChild(spanSumOfCollections);

        divStatistics.unshift(divSumOfCollectionsContainer);
        //---

        // Дополнительное сообщение, если языков больше, чем максимум (при необходимости) ---
        if (extraSumOfCollections > 0n
            && extraSumOfLangs > 0n) {
            let collectionsWord = changeEndOfTheWordByNumberOfItems("коллекция", extraSumOfCollections,
                new EndOfTheWord("й", 1),
                new EndOfTheWord("и", 1),
                null,
                new EndOfTheWord("й", 1));

            let langsWord = changeEndOfTheWordByNumberOfItems("язык", extraSumOfLangs,
                new EndOfTheWord("ах", 0),
                new EndOfTheWord("ах", 0),
                new EndOfTheWord("е", 0),
                new EndOfTheWord("ах", 0));

            let divExtraStatistic = document.createElement("span");
            divExtraStatistic.style.fontWeight = "bold";
            divExtraStatistic.textContent = `...и ещё ${extraSumOfCollections} ${collectionsWord} на 
                    ${extraSumOfLangs} ${langsWord}.`;

            divStatistics.push(divExtraStatistic);
        }
        //---

        let div = document.createElement("div");
        for (let i = 0; i < divStatistics.length; i++) {
            div.appendChild(divStatistics[i]);
        }

        statisticItems.push(div);
        statisticItems.push(document.createElement("br"));
    }
    //---

    return statisticItems;
}
//---

// Информация о коллекции ---
function prepareCollectionInfoFinder() {
    _CUSTOM_TIMER_COLLECTION_INFO_FINDER.setTimeout(_TIMEOUT_FOR_FINDERS);
    _CUSTOM_TIMER_COLLECTION_INFO_FINDER.setHandler(async function() {
        await tryToFillCollectionInfo();
    });
}

function startToFindCollectionInfo() {
    if (_CUSTOM_TIMER_COLLECTION_INFO_FINDER) {
        _CUSTOM_TIMER_COLLECTION_INFO_FINDER.stop();
    }

    let divCollectionInfo = document.getElementById(_DIV_COLLECTION_INFO_ID);
    if (divCollectionInfo) {
        divCollectionInfo.replaceChildren();
        divCollectionInfo.appendChild(new LoadingElement().createDiv());
    }

    if (_CUSTOM_TIMER_COLLECTION_INFO_FINDER) {
        _CUSTOM_TIMER_COLLECTION_INFO_FINDER.start();
    }
}

async function tryToFillCollectionInfo() {
    let currentFinder = _CUSTOM_TIMER_COLLECTION_INFO_FINDER;

    let collectionKey = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBoxId(_CB_CUSTOMER_COLLECTIONS_ID);
    let divCollectionInfo =
        await _CUSTOMER_COLLECTION_UTILS.createDivCollectionInfoAfterValidate(collectionKey);

    let divCollectionInfoContainer = document.getElementById(_DIV_COLLECTION_INFO_ID);
    if (divCollectionInfoContainer && currentFinder.getActive() === true) {
        divCollectionInfoContainer.replaceChildren();
        if (currentFinder.getActive() === true) {
            divCollectionInfoContainer.appendChild(divCollectionInfo);
        }
    }
}
//---

// Слова в коллекции ---
function prepareWordsInCollectionFinder() {
    _CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER.setTimeout(_TIMEOUT_FOR_FINDERS);
    _CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER.setHandler(async function() {
        let readyToFill = true;

        // Коллекция должна принадлежать пользователю ---
        let authId = _GLOBAL_COOKIES.AUTH_ID.getValue();
        let collectionKey = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBoxId(_CB_CUSTOMER_COLLECTIONS_ID);
        let JSONResponse = await
            _CUSTOMER_COLLECTIONS_API.GET.findByCustomerIdAndKey(authId, collectionKey);
        if (JSONResponse.status !== _HTTP_STATUSES.OK) {
            readyToFill = false;
            setMessageInsideTable(new CustomResponseMessage(JSONResponse.json).text);
        }
        //---

        if (readyToFill === true) {
            _lastWordNumberInList = 0;
            _lastWordInCollectionIdOnPreviousPage = 0n;

            await tryToFillTableRows(true, true);
        }
    });
}

function startToFindWordsInCollection() {
    if (_CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER) {
        _CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER.stop();
    }

    // Отображаем загрузку в таблице ---
    let tableHead = document.getElementById(_COLLECTION_WORD_TABLE_HEAD_ID);
    let tableBody = document.getElementById(_COLLECTION_WORD_TABLE_BODY_ID);
    if (tableHead && tableBody) {
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);
        let trMessage =
            _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrLoading(numberOfColumns);

        tableBody.replaceChildren();
        tableBody.appendChild(trMessage);
    }
    //---

    if (_CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER) {
        _CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER.start();
    }
}

async function tryToFillTableRows(doNeedToClearTable, doNeedToShowTableMessage) {
    let currentFinder = _CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER;

    let collectionKey = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBoxId(_CB_CUSTOMER_COLLECTIONS_ID);
    let title = document.getElementById(_TB_FINDER_ID).value;
    let JSONResponse = await _WORDS_IN_COLLECTION_API.GET.getAllInCollectionFilteredPagination(collectionKey,
        _NUMBER_OF_WORDS, title, _lastWordInCollectionIdOnPreviousPage);
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        let tableRows = await createTableRows(JSONResponse.json);
        let tableBody = document.getElementById(_COLLECTION_WORD_TABLE_BODY_ID);
        if (tableRows && tableBody && currentFinder.getActive() === true) {
            if (doNeedToClearTable === true) {
                tableBody.replaceChildren();
            }

            for (let i = 0; i < tableRows.length; i++) {
                if (currentFinder.getActive() !== true) break;
                tableBody.appendChild(tableRows[i]);
            }
        }
    } else if (doNeedToShowTableMessage === true) {
        setMessageInsideTable(new CustomResponseMessage(JSONResponse.json).text);
    }
}

async function createTableRows(allWordsInCollectionFilteredPaginationJson){
    let currentFinder = _CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER;
    let tableRows = [];

    for (let i = 0; i < allWordsInCollectionFilteredPaginationJson.length; i++) {
        if (currentFinder.getActive() !== true) break;
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

    // Создаем кнопку "Показать больше", если запрос вернул максимальное количество на страницу
    if (currentFinder.getActive() === true
        && allWordsInCollectionFilteredPaginationJson.length === _NUMBER_OF_WORDS) {
        let tableHead = document.getElementById(_COLLECTION_WORD_TABLE_HEAD_ID);
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);

        let message =  `Показать ещё ${_NUMBER_OF_WORDS} элементов...`;
        let trShowMore = _TABLE_UTILS.createTrShowMore(numberOfColumns,
            message, async function (){
                await tryToFillTableRows(false, false);
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

async function createBtnAction(wordInCollectionRequestDTO) {
    let aBtnAction = _A_BUTTONS.A_BUTTON_DENY.createA(_A_BUTTON_IMG_SIZES.SIZE_16);
    await _WORD_TABLE_UTILS.changeToRemoveAction(aBtnAction, wordInCollectionRequestDTO);

    aBtnAction.addEventListener("click", function () {
        startToFindCollectionInfo();
    })

    let divContainer = document.createElement("div");
    divContainer.style.display = "flex";
    divContainer.style.justifyContent = "center";
    divContainer.style.alignItems = "center";
    divContainer.appendChild(aBtnAction);

    return divContainer;
}

function setMessageInsideTable(message) {
    let currentFinder = _CUSTOM_TIMER_WORDS_IN_COLLECTION_FINDER;

    let tableHead = document.getElementById(_COLLECTION_WORD_TABLE_HEAD_ID);
    let tableBody = document.getElementById(_COLLECTION_WORD_TABLE_BODY_ID);
    if (tableHead && tableBody) {
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);
        let trMessage =
            _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrCommon(numberOfColumns, message);

        if (currentFinder.getActive() === true) {
            tableBody.replaceChildren();
            if (currentFinder.getActive() === true) {
                tableBody.appendChild(trMessage);
            }
        }
    }
}
//---