import {
    buildABtnAccept,
    buildABtnDeny,
    buildABtnDisabled,
    createBtnShowMore,
    removeBtnShowMore
} from "../utils/btn_utils.js";

import {
    findInTableWithTimers,
    setMessageInsideTable
} from "../utils/table_utils.js";

import {
    changeSelectedOptionById,
    fillCbLangs,
    fillCbPartsOfSpeech,
    fillCbWordStatuses, getSelectedOptionId
} from "../utils/combo_box_utils.js";

import {
    Timer
} from "../classes/timer.js";

import {
    deleteJSONResponseDeleteAllUnclaimedWords,
    getJSONResponseWordsFilteredPagination,
    patchJSONResponseEditWord
} from "../api/words.js";

import {
    HttpStatuses
} from "../classes/http_statuses.js";

import {
    getJSONResponseWordStatusHistoryFindCurrentByWordId,
    postJSONResponseAddWordStatusToWordsWithoutStatus
} from "../api/word_status_histories.js";

import {
    CssMain
} from "../classes/css/css_main.js";

import {
    WordStatuses
} from "../classes/api/word_statuses.js";

import {
    deleteJSONResponseDeleteInactiveWordsInCollections
} from "../api/words_in_collection.js";

import {
    createSpanLangWithFlag
} from "../utils/flag_icons_utils.js";

const _CSS_MAIN = new CssMain();
const _HTTP_STATUSES = new HttpStatuses();
const _WORD_STATUSES = new WordStatuses();

const _TB_FINDER_ID = "tb_finder";
const _CB_LANGS_ID = "cb_langs";
const _CB_PARTS_OF_SPEECH_ID = "cb_parts_of_speech";
const _CB_WORD_STATUSES = "cb_word_statuses";
const _CHANGE_WORD_LIST_CONTAINER = "change_word_list_container";
const _CHANGE_WORD_TABLE_HEAD_ID = "change_word_table_head";
const _CHANGE_WORD_TABLE_BODY_ID = "change_word_table_body";
const _BTN_SHOW_MORE_ID = "btn_show_more";
const _BTN_DELETE_INACTIVE_WORDS_IN_COLLECTIONS_ID = "btn_delete_inactive_words_in_collections";
const _BTN_DELETE_ALL_UNCLAIMED_WORDS_ID = "btn_delete_all_unclaimed_words";
const _BTN_ADD_WORD_STATUS_TO_WORDS_WITHOUT_STATUS = "btn_add_word_status_to_words_without_status";
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
    prepareBtnDeleteInactiveWordsInCollections();
    prepareBtnDeleteAllUnclaimedWords();
    prepareBtnAddWordStatusToWordsWithoutStatus();
    prepareBtnRefresh();

    await tryToFillChangeWordsTable();
}

function waiter() {
    removeBtnShowMore(_BTN_SHOW_MORE_ID);
    let tableHead = document.getElementById(_CHANGE_WORD_TABLE_HEAD_ID);
    let tableBody = document.getElementById(_CHANGE_WORD_TABLE_BODY_ID);
    setMessageInsideTable(tableHead, tableBody, "Идёт поиск...", true);
}

function prepareTbFinder() {
    let tbFinder = document.getElementById(_TB_FINDER_ID);

    // Вешаем событие обновления списка при изменении текста
    tbFinder.addEventListener("input", async function () {
        findInTableWithTimers(_tWaiter, _tFinder, waiter, tryToFillChangeWordsTable);
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
            findInTableWithTimers(_tWaiter, _tFinder, waiter, tryToFillChangeWordsTable);
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
            findInTableWithTimers(_tWaiter, _tFinder, waiter, tryToFillChangeWordsTable);
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
        changeSelectedOptionById(cbWordStatuses.id, _WORD_STATUSES.NEW.CODE);
        let event = new Event('change');
        cbWordStatuses.dispatchEvent(event);

        // Вешаем событие обновления списка при изменении элемента выпадающего списка
        cbWordStatuses.addEventListener("change", function () {
            findInTableWithTimers(_tWaiter, _tFinder, waiter, tryToFillChangeWordsTable);
        });
    }
}

function prepareBtnDeleteInactiveWordsInCollections() {
    let btnDeleteInactiveWordsInCollections =
        document.getElementById(_BTN_DELETE_INACTIVE_WORDS_IN_COLLECTIONS_ID);
    if (btnDeleteInactiveWordsInCollections != null) {
        btnDeleteInactiveWordsInCollections.addEventListener("click", async function() {
            buildABtnDisabled(this);
            let JSONResponse = await deleteJSONResponseDeleteInactiveWordsInCollections();
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                buildABtnDeny(this, false);
                findInTableWithTimers(_tWaiter, _tFinder, waiter, tryToFillChangeWordsTable);
            }
        })
    }
}

function prepareBtnDeleteAllUnclaimedWords() {
    let btnDeleteAllUnclaimedWords =
        document.getElementById(_BTN_DELETE_ALL_UNCLAIMED_WORDS_ID);
    if (btnDeleteAllUnclaimedWords != null) {
        btnDeleteAllUnclaimedWords.addEventListener("click", async function() {
            buildABtnDisabled(this);
            let JSONResponse = await deleteJSONResponseDeleteAllUnclaimedWords();
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                buildABtnDeny(this, false);
                findInTableWithTimers(_tWaiter, _tFinder, waiter, tryToFillChangeWordsTable);
            }
        })
    }
}

function prepareBtnAddWordStatusToWordsWithoutStatus() {
    let btnAddWordStatusToWordsWithoutStatus =
        document.getElementById(_BTN_ADD_WORD_STATUS_TO_WORDS_WITHOUT_STATUS);
    if (btnAddWordStatusToWordsWithoutStatus != null) {
        btnAddWordStatusToWordsWithoutStatus.addEventListener("click", async function() {
            buildABtnDisabled(this);
            let JSONResponse = await postJSONResponseAddWordStatusToWordsWithoutStatus(_WORD_STATUSES.NEW.CODE);
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                buildABtnAccept(this, false);
                findInTableWithTimers(_tWaiter, _tFinder, waiter, tryToFillChangeWordsTable);
            }
        })
    }
}

function prepareBtnRefresh() {
    let btnRefresh = document.getElementById(_BTN_REFRESH_ID);
    if (btnRefresh != null) {
        btnRefresh.addEventListener("click", async function() {
            btnRefresh.disabled = true;
            findInTableWithTimers(_tWaiter, _tFinder, waiter, tryToFillChangeWordsTable);
            btnRefresh.disabled = false;
        })
    }
}

async function getPreparedJSONResponseWordsFilteredPagination() {
    let title = document.getElementById(_TB_FINDER_ID).value;
    let partOfSpeechCode =  getSelectedOptionId(_CB_PARTS_OF_SPEECH_ID);
    let langCode =  getSelectedOptionId(_CB_LANGS_ID);
    let wordStatusCode = getSelectedOptionId(_CB_WORD_STATUSES);

    return  await getJSONResponseWordsFilteredPagination(_NUMBER_OF_WORDS, title,
        wordStatusCode, partOfSpeechCode, langCode, _lastWordIdOnPreviousPage);
}

async function tryToFillChangeWordsTable() {
    _lastWordNumberInList = 0;
    _lastWordIdOnPreviousPage = 0n;

    let readyToFill = true;
    let badRequestText = null;

    // Получаем JSON для заполнения таблицы ---
    let wordsFilteredPaginationJson = null;
    let JSONResponse = await getPreparedJSONResponseWordsFilteredPagination();
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        wordsFilteredPaginationJson = JSONResponse.json;
    } else {
        readyToFill = false;
        badRequestText = JSONResponse.json["text"];
    }
    //---

    // Чистим таблицу ---
    removeBtnShowMore(_BTN_SHOW_MORE_ID);
    let tableBody = document.getElementById(_CHANGE_WORD_TABLE_BODY_ID);
    tableBody.replaceChildren();
    //---

    if (readyToFill) {
        // Заполняем таблицу
        await fillChangeWordsTable(wordsFilteredPaginationJson);
    } else {
        // Выводим сообщение об ошибке
        let tableHead = document.getElementById(_CHANGE_WORD_TABLE_HEAD_ID);
        let tableBody = document.getElementById(_CHANGE_WORD_TABLE_BODY_ID);
        setMessageInsideTable(tableHead, tableBody, badRequestText, true);
    }
}

async function fillChangeWordsTable(wordsFilteredPaginationJson) {
    for (let i = 0; i < wordsFilteredPaginationJson.length; i++) {
        await createChangeWordsTableRow(wordsFilteredPaginationJson[i]);
        // Получаем id последнего элемента JSON-коллекции
        if (i === wordsFilteredPaginationJson.length - 1) {
            _lastWordIdOnPreviousPage = wordsFilteredPaginationJson[i]["id"];
        }
    }

    // Создаем кнопку, только если запрос вернул максимальное количество на страницу
    if (wordsFilteredPaginationJson.length === _NUMBER_OF_WORDS) {
        let collectionWordListContainer =
            document.getElementById(_CHANGE_WORD_LIST_CONTAINER);
        let btnShowMore = createBtnShowMore(_BTN_SHOW_MORE_ID, _NUMBER_OF_WORDS);
        if (collectionWordListContainer != null && btnShowMore != null) {
            btnShowMore.addEventListener("click", async function () {
                let JSONResponse = await getPreparedJSONResponseWordsFilteredPagination();
                if (JSONResponse.status === _HTTP_STATUSES.OK) {
                    await fillChangeWordsTable(JSONResponse.json);
                }
            });
            collectionWordListContainer.appendChild(btnShowMore);
        }
    }
}

async function createChangeWordsTableRow(JSONResponseWordItem) {
    const CHANGE_ROW_TABLE_ROW_ITEM_ID_PATTERN = "change_word_table_row_item";
    const ROW_HEIGHT = "50px";

    // Ищем актуальный статус слова
    let wordId = JSONResponseWordItem["id"];
    let JSONResponseWordStatusHistory = await getJSONResponseWordStatusHistoryFindCurrentByWordId(wordId);

    // Если статус найден, генерируем строку
    if (JSONResponseWordStatusHistory.status === _HTTP_STATUSES.OK) {
        let jsonWordStatusHistory = JSONResponseWordStatusHistory.json;

        let row = document.createElement("tr");
        row.style.height = ROW_HEIGHT;

        // Порядковый номер ---
        let numberColumn = document.createElement("td");
        numberColumn.textContent = `${++_lastWordNumberInList}.`;
        row.appendChild(numberColumn);
        //---

        // Слово ---
        let titleColumn = document.createElement("td");
        titleColumn.textContent = JSONResponseWordItem["title"];
        row.appendChild(titleColumn);
        //---

        // Язык ---
        let langJSON = JSONResponseWordItem["lang"];
        let spanLangFlagWithTitle = createSpanLangWithFlag(langJSON);

        let langColumn = document.createElement("td");
        langColumn.appendChild(spanLangFlagWithTitle);
        row.appendChild(langColumn);
        //---

        // Часть речи ---
        let partOfSpeechColumn = document.createElement("td");
        partOfSpeechColumn.textContent = JSONResponseWordItem["part_of_speech"]["title"];
        row.appendChild(partOfSpeechColumn);
        //---

        // Статус ---
        let cbWordStatuses = document.createElement("select");
        cbWordStatuses.id = CHANGE_ROW_TABLE_ROW_ITEM_ID_PATTERN + "_cb_word_statuses_" + _lastWordNumberInList;
        cbWordStatuses.classList.add(_CSS_MAIN.SELECT_STANDARD_STYLE_ID);
        cbWordStatuses.style.height = ROW_HEIGHT;
        cbWordStatuses.style.width = "100%";

        await fillCbWordStatuses(cbWordStatuses);

        let wordStatusColumn = document.createElement("td");
        wordStatusColumn.style.padding = "1px";
        wordStatusColumn.appendChild(cbWordStatuses);
        row.appendChild(wordStatusColumn);
        //---

        // Добавляем строку в таблицу ---
        let tableBody = document.getElementById(_CHANGE_WORD_TABLE_BODY_ID);
        tableBody.appendChild(row);
        //---

        // При изменении значения выпадающего списка, будет меняться статус слова ---
        changeSelectedOptionById(cbWordStatuses.id, jsonWordStatusHistory["word_status"]["code"]);
        let event = new Event('change');
        cbWordStatuses.dispatchEvent(event);

        cbWordStatuses.addEventListener("change", async function() {
            let title = JSONResponseWordItem["title"];
            let langCode = JSONResponseWordItem["lang"]["code"];
            let partOfSpeechCode = JSONResponseWordItem["part_of_speech"]["code"];
            let wordStatusCode = getSelectedOptionId(cbWordStatuses.id);

            await patchJSONResponseEditWord(wordId, title, langCode, partOfSpeechCode, wordStatusCode);
        })
        //---
    }
}