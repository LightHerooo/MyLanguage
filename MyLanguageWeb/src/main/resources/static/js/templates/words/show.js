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
    CustomerCollectionResponseDTO
} from "../../classes/dto/entity/customer_collection.js";

import {
    FlagElements
} from "../../classes/flag_elements.js";

import {
    TextBoxUtils
} from "../../classes/utils/text_box_utils.js";

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
const _FLAG_ELEMENTS = new FlagElements();
const _TEXT_BOX_UTILS = new TextBoxUtils();

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

const _CUSTOM_TIMER_STATISTIC_FINDER = new CustomTimer();
const _CUSTOM_TIMER_COLLECTION_INFO_FINDER = new CustomTimer();
const _CUSTOM_TIMER_WORDS_FINDER = new CustomTimer();
const _CUSTOM_TIMER_TB_FINDER = new CustomTimer();
const _TIMEOUT_FOR_FINDERS = 1000;

window.onload = async function () {
    // Подготавливаем таймеры ---
    prepareStatisticFinder();
    prepareCollectionInfoFinder();
    prepareWordsFinder();
    //---

    await prepareCbCustomerCollections();
    await prepareCbLangs();
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
        _FLAG_ELEMENTS.DIV.setStyles(divLangFlag, null, true);
        await _LANG_UTILS.prepareComboBox(cbLangs, firstOption, divLangFlag);

        // Вешаем событие обновления списка при изменении элемента выпадающего списка
        cbLangs.addEventListener("change", startAllFinders);
    }
}

async function prepareCbCustomerCollections() {
    let cbCustomerCollections = document.getElementById(_CB_CUSTOMER_COLLECTIONS_ID);
    if (cbCustomerCollections) {
        let divCollectionFlag = document.getElementById(_DIV_COLLECTION_FLAG_ID);
        await _CUSTOMER_COLLECTION_UTILS.prepareComboBox(cbCustomerCollections, null, divCollectionFlag);

        cbCustomerCollections.addEventListener("change", async function () {
            startAllFinders();

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
            cbLangs.removeEventListener("change", startAllFinders);
            _LANG_UTILS.changeCbLangsItemByLangCode(cbLangs, langCode, true);
            cbLangs.addEventListener("change", startAllFinders);
            //---
        });

        _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemIndex(
            cbCustomerCollections, 0, true);
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

    let authId = _GLOBAL_COOKIES.AUTH_ID.getValue();
    if (authId) {
        startToFindCollectionInfo();
    }

    startToFindWords();
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

    let wordsStatisticContainer = document.getElementById(_DIV_WORDS_STATISTICS_CONTAINER_ID);
    if (wordsStatisticContainer) {
        wordsStatisticContainer.replaceChildren();
        wordsStatisticContainer.appendChild(new LoadingElement().createDiv());
    }

    if (_CUSTOM_TIMER_STATISTIC_FINDER) {
        _CUSTOM_TIMER_STATISTIC_FINDER.start();
    }
}

async function tryToFillStatistic() {
    let currentFinder = _CUSTOM_TIMER_STATISTIC_FINDER;

    let statisticItems = await createStatisticItems();
    let wordsStatisticContainer = document.getElementById(_DIV_WORDS_STATISTICS_CONTAINER_ID);
    if (wordsStatisticContainer && currentFinder.getActive() === true) {
        wordsStatisticContainer.replaceChildren();
        for (let i = 0; i < statisticItems.length; i++) {
            if (currentFinder.getActive() !== true) break;
            wordsStatisticContainer.appendChild(statisticItems[i]);
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

// Поиск слов ---
function prepareWordsFinder() {
    _CUSTOM_TIMER_WORDS_FINDER.setTimeout(_TIMEOUT_FOR_FINDERS);
    _CUSTOM_TIMER_WORDS_FINDER.setHandler(async function () {
        let readyToFill = true;

        // Коллекция должна принадлежать пользователю (проверка только при авторизации) ---
        let authId = _GLOBAL_COOKIES.AUTH_ID.getValue();
        if (authId) {
            let collectionKey = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBoxId(_CB_CUSTOMER_COLLECTIONS_ID);
            let JSONResponse = await _CUSTOMER_COLLECTIONS_API.GET.findByCustomerIdAndKey(authId, collectionKey);
            if (JSONResponse.status !== _HTTP_STATUSES.OK) {
                readyToFill = false;
                setMessageInsideTable(new CustomResponseMessage(JSONResponse.json).text);
            }
        }
        //---

        if (readyToFill === true) {
            _lastWordNumberInList = 0;
            _lastWordIdOnPreviousPage = 0n;

            await tryToFillTable(true, true);
        }
    });
}

function startToFindWords() {
    if (_CUSTOM_TIMER_WORDS_FINDER) {
        _CUSTOM_TIMER_WORDS_FINDER.stop();
    }

    // Отображаем загрузку в таблице ---
    let tableHead = document.getElementById(_WORDS_TABLE_HEAD_ID);
    let tableBody = document.getElementById(_WORDS_TABLE_BODY_ID);
    if (tableHead && tableBody) {
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);
        let trMessage = _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrLoading(numberOfColumns);

        tableBody.replaceChildren();
        tableBody.appendChild(trMessage);
    }
    //---

    if (_CUSTOM_TIMER_WORDS_FINDER) {
        _CUSTOM_TIMER_WORDS_FINDER.start();
    }
}

async function tryToFillTable(doNeedToClearTable, doNeedToShowTableMessage) {
    let currentFinder = _CUSTOM_TIMER_WORDS_FINDER;

    let title = document.getElementById(_TB_FINDER_ID).value;
    let langCode =  _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBoxId(_CB_LANGS_ID);

    let JSONResponse = await _WORDS_API.GET.getAllFilteredPagination(_NUMBER_OF_WORDS, title,
        _WORD_STATUSES.ACTIVE.CODE, langCode, _lastWordIdOnPreviousPage);
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        let tableRows = await createTableRows(JSONResponse.json);
        let tableBody = document.getElementById(_WORDS_TABLE_BODY_ID);
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

async function createTableRows(wordsFilteredPaginationJson) {
    let currentFinder = _CUSTOM_TIMER_WORDS_FINDER;
    let tableRows = [];

    for (let i = 0; i < wordsFilteredPaginationJson.length; i++) {
        if (currentFinder.getActive() !== true) break;
        let word = new WordResponseDTO(wordsFilteredPaginationJson[i]);

        let row = await createTableRow(word);
        if (row) {
            tableRows.push(row);
        }

        if (i === wordsFilteredPaginationJson.length - 1) {
            _lastWordIdOnPreviousPage = word.id;
        }
    }

    if (currentFinder.getActive() === true &&
        wordsFilteredPaginationJson.length === _NUMBER_OF_WORDS) {
        let tableHead = document.getElementById(_WORDS_TABLE_HEAD_ID);
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);

        let trShowMore = _TABLE_UTILS.createTrShowMore(numberOfColumns,
            _NUMBER_OF_WORDS, async function() {
                await tryToFillTable(false, false);
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
    let currentFinder = _CUSTOM_TIMER_WORDS_FINDER;

    let tableHead = document.getElementById(_WORDS_TABLE_HEAD_ID);
    let tableBody = document.getElementById(_WORDS_TABLE_BODY_ID);
    if (tableHead && tableBody) {
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);
        let trMessage = _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrCommon(numberOfColumns, message);

        if (currentFinder.getActive() === true) {
            tableBody.replaceChildren();
            if (currentFinder.getActive() === true) {
                tableBody.appendChild(trMessage);
            }
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
            startToFindCollectionInfo();
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
//---