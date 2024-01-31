import {
    CustomTimer
} from "../../classes/custom_timer.js";

import {
    HttpStatuses
} from "../../classes/http_statuses.js";

import {
    CssMain
} from "../../classes/css/css_main.js";

import {
    WordStatuses
} from "../../classes/api/word_statuses/word_statuses.js";

import {
    WordStatusHistoryRequestDTO,
    WordStatusHistoryResponseDTO
} from "../../classes/dto/word_status_history.js";

import {
    WordRequestDTO,
    WordResponseDTO
} from "../../classes/dto/word.js";

import {
    CustomResponseMessage
} from "../../classes/dto/other/custom_response_message.js";

import {
    LangUtils
} from "../../classes/utils/entity/lang_utils.js";

import {
    PartOfSpeechUtils
} from "../../classes/utils/entity/part_of_speech_utils.js";

import {
    WordStatusUtils
} from "../../classes/utils/entity/word_status_utils.js";

import {
    WordsAPI
} from "../../classes/api/words_api.js";

import {
    WordsInCollectionAPI
} from "../../classes/api/words_in_collection_api.js";

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
    CustomTimerUtils
} from "../../classes/utils/custom_timer_utils.js";

const _WORDS_API = new WordsAPI();
const _WORDS_IN_COLLECTION_API = new WordsInCollectionAPI();
const _WORD_STATUS_HISTORIES_API = new WordStatusHistoriesAPI();

const _CSS_MAIN = new CssMain();
const _HTTP_STATUSES = new HttpStatuses();
const _WORD_STATUSES = new WordStatuses();
const _LANG_UTILS = new LangUtils();
const _PART_OF_SPEECH_UTILS = new PartOfSpeechUtils();
const _WORD_STATUS_UTILS = new WordStatusUtils();
const _TABLE_UTILS = new TableUtils();
const _A_BUTTONS = new AButtons();
const _COMBO_BOX_UTILS = new ComboBoxUtils();
const _CUSTOM_TIMER_UTILS = new CustomTimerUtils();

const _TB_FINDER_ID = "tb_finder";
const _CB_LANGS_ID = "cb_langs";
const _CB_PARTS_OF_SPEECH_ID = "cb_parts_of_speech";
const _CB_WORD_STATUSES = "cb_word_statuses";
const _CHANGE_WORD_TABLE_HEAD_ID = "change_word_table_head";
const _CHANGE_WORD_TABLE_BODY_ID = "change_word_table_body";
const _BTN_DELETE_INACTIVE_WORDS_IN_COLLECTIONS_ID = "btn_delete_inactive_words_in_collections";
const _BTN_DELETE_ALL_UNCLAIMED_WORDS_ID = "btn_delete_all_unclaimed_words";
const _BTN_ADD_WORD_STATUS_TO_WORDS_WITHOUT_STATUS = "btn_add_word_status_to_words_without_status";
const _BTN_REFRESH_ID = "btn_refresh";
const _DIV_LANG_FLAG_ID = "lang_flag";

const _NUMBER_OF_WORDS = 10;
let _lastWordNumberInList = 0;
let _lastWordIdOnPreviousPage = 0n;

const _CUSTOM_TIMER_TABLE_WAITER = new CustomTimer();
const _CUSTOM_TIMER_TABLE_FINDER = new CustomTimer();
let _accessToFillTable = true;

window.onload = async function() {
    prepareTableTimers();

    await prepareCbPartsOfSpeech();
    await prepareCbLangs();
    await prepareCbWordStatuses();
    prepareTbFinder();
    prepareBtnDeleteInactiveWordsInCollections();
    prepareBtnDeleteAllUnclaimedWords();
    prepareBtnAddWordStatusToWordsWithoutStatus();
    prepareBtnRefresh();

    startTimers();
}

function prepareTableTimers() {
    _CUSTOM_TIMER_TABLE_WAITER.handler = function () {
        _accessToFillTable = false;

        let tableHead = document.getElementById(_CHANGE_WORD_TABLE_HEAD_ID);
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);
        let trMessage = _TABLE_UTILS.MESSAGES_INSIDE_TABLE.createTrLoading(numberOfColumns);

        let tableBody = document.getElementById(_CHANGE_WORD_TABLE_BODY_ID);
        tableBody.replaceChildren();
        tableBody.appendChild(trMessage);
    }

    _CUSTOM_TIMER_TABLE_FINDER.handler = async function() {
        _accessToFillTable = true;
        await tryToFillTable();
    }
}

function startTimers() {
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

async function prepareCbPartsOfSpeech() {
    let cbPartsOfSpeech = document.getElementById(_CB_PARTS_OF_SPEECH_ID);
    if (cbPartsOfSpeech) {
        let firstOption = document.createElement("option");
        firstOption.textContent = "Все";

        await _PART_OF_SPEECH_UTILS.fillComboBox(cbPartsOfSpeech, firstOption);

        // Вешаем событие обновления списка при изменении элемента выпадающего списка
        cbPartsOfSpeech.addEventListener("change", function () {
            startTimers();
        });
    }
}

async function prepareCbWordStatuses() {
    let cbWordStatuses = document.getElementById(_CB_WORD_STATUSES);
    if (cbWordStatuses) {
        let firstOption = document.createElement("option");
        firstOption.textContent = "Все";
        await _WORD_STATUS_UTILS.fillComboBox(cbWordStatuses, firstOption);

        _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemId(
            cbWordStatuses, _WORD_STATUSES.NEW.CODE, true);

        // Вешаем событие обновления списка при изменении элемента выпадающего списка
        cbWordStatuses.addEventListener("change", function () {
            startTimers();
        });
    }
}

function prepareBtnDeleteInactiveWordsInCollections() {
    let btnDeleteInactiveWordsInCollections =
        document.getElementById(_BTN_DELETE_INACTIVE_WORDS_IN_COLLECTIONS_ID);
    if (btnDeleteInactiveWordsInCollections) {
        btnDeleteInactiveWordsInCollections.addEventListener("click", async function() {
            _A_BUTTONS.A_BUTTON_DISABLED.setStyles(this);
            let JSONResponse = await _WORDS_IN_COLLECTION_API.DELETE.deleteInactiveWordsInCollections();
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                _A_BUTTONS.A_BUTTON_DENY.setStyles(this, false);
                startTimers();
            }
        })
    }
}

function prepareBtnDeleteAllUnclaimedWords() {
    let btnDeleteAllUnclaimedWords =
        document.getElementById(_BTN_DELETE_ALL_UNCLAIMED_WORDS_ID);
    if (btnDeleteAllUnclaimedWords) {
        btnDeleteAllUnclaimedWords.addEventListener("click", async function() {
            _A_BUTTONS.A_BUTTON_DISABLED.setStyles(this);
            let JSONResponse = await _WORDS_API.DELETE.deleteAllUnclaimedWords();
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                _A_BUTTONS.A_BUTTON_DENY.setStyles(this, false);
                startTimers();
            }
        })
    }
}

function prepareBtnAddWordStatusToWordsWithoutStatus() {
    let btnAddWordStatusToWordsWithoutStatus =
        document.getElementById(_BTN_ADD_WORD_STATUS_TO_WORDS_WITHOUT_STATUS);
    if (btnAddWordStatusToWordsWithoutStatus) {
        btnAddWordStatusToWordsWithoutStatus.addEventListener("click", async function() {
            _A_BUTTONS.A_BUTTON_DISABLED.setStyles(this);

            let requestDTO = new WordStatusHistoryRequestDTO();
            requestDTO.wordStatusCode = _WORD_STATUSES.NEW.CODE;
            let JSONResponse = await _WORD_STATUS_HISTORIES_API.POST.addWordStatusToWordsWithoutStatus(requestDTO);
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                _A_BUTTONS.A_BUTTON_ACCEPT.setStyles(this, false);
                startTimers();
            }
        })
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
    let partOfSpeechCode =  _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBoxId(_CB_PARTS_OF_SPEECH_ID);
    let langCode =  _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBoxId(_CB_LANGS_ID);
    let wordStatusCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBoxId(_CB_WORD_STATUSES);

    return await _WORDS_API.GET.getAllFilteredPagination(_NUMBER_OF_WORDS, title,
        wordStatusCode, partOfSpeechCode, langCode, _lastWordIdOnPreviousPage);
}

async function tryToFillTable() {
    _lastWordNumberInList = 0;
    _lastWordIdOnPreviousPage = 0n;

    let tableBody = document.getElementById(_CHANGE_WORD_TABLE_BODY_ID);
    let JSONResponse = await sendPreparedRequest();
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        let tableRows = await createTableRows(JSONResponse.json);
        if (_accessToFillTable === true) {
            tableBody.replaceChildren();
            for (let i = 0; i < tableRows.length; i++) {
                if (_accessToFillTable === true) {
                    tableBody.appendChild(tableRows[i]);
                }
            }
        }
    } else {
        let tableHead = document.getElementById(_CHANGE_WORD_TABLE_HEAD_ID);
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);
        let trMessage = _TABLE_UTILS.MESSAGES_INSIDE_TABLE
            .createTrCommon(numberOfColumns, new CustomResponseMessage(JSONResponse.json).text);

        if (_accessToFillTable === true) {
            tableBody.replaceChildren();
            if (_accessToFillTable === true) {
                tableBody.appendChild(trMessage);
            }
        }
    }
}

async function createTableRows(wordsFilteredPaginationJson){
    let tableRows = [];

    for (let i = 0; i < wordsFilteredPaginationJson.length; i++) {
        if (_accessToFillTable === true) {
            let word = new WordResponseDTO(wordsFilteredPaginationJson[i]);

            let row = await createTableRow(word);
            if (row) {
                tableRows.push(row);
            }

            // Получаем id последнего элемента JSON-коллекции
            if (i === wordsFilteredPaginationJson.length - 1) {
                _lastWordIdOnPreviousPage = word.id;
            }
        }
    }

    // Создаем кнопку, только если запрос вернул максимальное количество на страницу
    if (_accessToFillTable === true && wordsFilteredPaginationJson.length === _NUMBER_OF_WORDS) {
        let tableHead = document.getElementById(_CHANGE_WORD_TABLE_HEAD_ID);
        let numberOfColumns = _TABLE_UTILS.getNumberOfColumnsByTableHead(tableHead);

        let trShowMore = _TABLE_UTILS.createTrShowMore(numberOfColumns,
            _NUMBER_OF_WORDS, async function () {
                let JSONResponse = await sendPreparedRequest();
                if (JSONResponse.status === _HTTP_STATUSES.OK) {
                    let tableRows = await createTableRows(JSONResponse.json);
                    if (_accessToFillTable === true) {
                        let tableBody = document.getElementById(_CHANGE_WORD_TABLE_BODY_ID);
                        for (let i = 0; i < tableRows.length; i++) {
                            if (_accessToFillTable === true) {
                                tableBody.appendChild(tableRows[i]);
                            }
                        }
                    }
                }
            });

        tableRows.push(trShowMore);
    }

    return tableRows;
}

async function createTableRow(wordResponseDTO) {
    const CHANGE_ROW_TABLE_ROW_ITEM_ID_PATTERN = "change_word_table_row_item";
    const ROW_HEIGHT = "50px";

    // Ищем актуальный статус слова ---
    let JSONResponse = await _WORD_STATUS_HISTORIES_API.GET.findCurrentByWordId(wordResponseDTO.id);
    if (JSONResponse.status === _HTTP_STATUSES.OK) {
        let wordStatusHistory =
            new WordStatusHistoryResponseDTO(JSONResponse.json);

        // Создаём строку ---
        let row = document.createElement("tr");
        row.style.height = ROW_HEIGHT;
        //---

        // Порядковый номер ---
        let numberColumn = document.createElement("td");
        numberColumn.style.textAlign = "center";
        numberColumn.textContent = `${++_lastWordNumberInList}.`;
        row.appendChild(numberColumn);
        //---

        // Слово ---
        let titleColumn = document.createElement("td");
        titleColumn.textContent = wordStatusHistory.word.title;
        row.appendChild(titleColumn);
        //---

        // Язык ---
        let langColumn = document.createElement("td");
        langColumn.appendChild(wordStatusHistory.word.lang.createSpan());
        row.appendChild(langColumn);
        //---

        // Часть речи ---
        let partOfSpeechColumn = document.createElement("td");
        partOfSpeechColumn.appendChild(wordStatusHistory.word.partOfSpeech.createDiv());
        row.appendChild(partOfSpeechColumn);
        //---

        // Статус ---
        let cbWordStatuses = document.createElement("select");
        cbWordStatuses.id = CHANGE_ROW_TABLE_ROW_ITEM_ID_PATTERN + "_cb_word_statuses_" + _lastWordNumberInList;
        cbWordStatuses.classList.add(_CSS_MAIN.SELECT_STANDARD_STYLE_ID);
        cbWordStatuses.style.height = ROW_HEIGHT;
        cbWordStatuses.style.width = "100%";

        await _WORD_STATUS_UTILS.fillComboBox(cbWordStatuses, null);

        _COMBO_BOX_UTILS.CHANGE_SELECTED_ITEM.byComboBoxAndItemId(
            cbWordStatuses, wordStatusHistory.wordStatus.code, true);

        let wordStatusColumn = document.createElement("td");
        wordStatusColumn.style.padding = "1px";
        wordStatusColumn.appendChild(cbWordStatuses);
        row.appendChild(wordStatusColumn);
        //---

        // При изменении значения выпадающего списка, будет меняться статус слова ---
        cbWordStatuses.addEventListener("change", async function() {
            cbWordStatuses.disabled = true;

            let wordRequestDTO = new WordRequestDTO();
            wordRequestDTO.id = wordStatusHistory.word.id;
            wordRequestDTO.title = wordStatusHistory.word.title;
            wordRequestDTO.langCode = wordStatusHistory.word.lang.code;
            wordRequestDTO.partOfSpeechCode = wordStatusHistory.word.partOfSpeech.code;
            wordRequestDTO.wordStatusCode = _COMBO_BOX_UTILS.GET_SELECTED_ITEM_ID.byComboBox(cbWordStatuses);

            let JSONResponse = await _WORDS_API.PATCH.edit(wordRequestDTO);
            if (JSONResponse.status === _HTTP_STATUSES.OK) {
                cbWordStatuses.disabled = false;
            }
        })

        return row;
        //---
    }
}

