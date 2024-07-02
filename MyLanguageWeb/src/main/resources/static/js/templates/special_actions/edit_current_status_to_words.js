import {
    HttpStatuses
} from "../../classes/api/classes/http/http_statuses.js";

import {
    WordStatuses
} from "../../classes/dto/entity/word_status/word_statuses.js";

import {
    ResponseMessageResponseDTO
} from "../../classes/dto/other/response/response_message_response_dto.js";

import {
    WordsAPI
} from "../../classes/api/entity/words_api.js";

import {
    WordsInCollectionAPI
} from "../../classes/api/entity/words_in_collection_api.js";

import {
    WordStatusHistoriesAPI
} from "../../classes/api/entity/word_status_histories_api.js";

import {
    ButtonWithImgElement
} from "../../classes/html/button/with_img/button_with_img_element.js";

import {
    ButtonWithImgAndSpanElement
} from "../../classes/html/button/with_img_and_span/button_with_img_and_span_element.js";

import {
    ButtonWithImgAndSpanElementDoubleClick
} from "../../classes/html/button/with_img_and_span/button_with_img_and_span_element_double_click.js";

import {
    ButtonWithImgAndSpanElementTypes
} from "../../classes/html/button/with_img_and_span/button_with_img_and_span_element_types.js";

import {
    SelectElementLangsIn
} from "../../classes/html/select/entity/lang/in/select_element_langs_in.js";

import {
    SelectElementWordStatuses
} from "../../classes/html/select/entity/word_status/select_element_word_statuses.js";

import {
    InputTextElement
} from "../../classes/html/input/text/input_text_element.js";

import {
    InputTextElementFinder
} from "../../classes/html/input/text/elements/input_text_element_finder.js";

import {
    EntityValueRequestDTO
} from "../../classes/dto/other/request/entity/value/entity_value_request_dto.js";

import {
    ButtonElementRefresh
} from "../../classes/html/button/elements/button_element_refresh.js";

import {
    TableWithTimerElementWordsWithCurrentStatus
} from "../../classes/html/table/entity/word_status_history/table_with_timer_element_words_with_current_status.js";

const _WORDS_API = new WordsAPI();
const _WORDS_IN_COLLECTION_API = new WordsInCollectionAPI();
const _WORD_STATUS_HISTORIES_API = new WordStatusHistoriesAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _WORD_STATUSES = new WordStatuses();
const _BUTTON_WITH_IMG_AND_SPAN_ELEMENT_TYPES = new ButtonWithImgAndSpanElementTypes();

const _GENERAL_TIMEOUT = 1000;

// Действия ---
let _buttonWithImgAndTextElementDoubleClickDeleteInactiveWordsInCollections;
let _buttonWithImgAndTextElementDoubleClickDeleteUnclaimedWords;
let _buttonWithImgAndTextElementDoubleClickAddWordStatusToWordsWithoutStatus;
//---

// Элементы для поиска в таблице + таблица "Слова с текущим статусом" ---
let _inputTextElementFinder;
let _selectElementLangsIn;
let _selectElementWordStatuses;
let _buttonElementRefresh;

let _tableWithTimerElementWordsWithCurrentStatus;
//---

window.onload = async function() {
    // Действия ---
    prepareButtonWithImgAndTextElementDoubleClickDeleteInactiveWordsInCollections();
    prepareButtonWithImgAndTextElementDoubleClickDeleteAllUnclaimedWords();
    prepareButtonWithImgAndTextElementDoubleClickAddWordStatusToWordsWithoutStatus();
    //---

    // Элементы для поиска в таблице + таблица "Слова с текущим статусом" ---
    prepareInputTextElementFinder();
    await prepareSelectElementLangsIn();
    await prepareSelectElementWordStatuses();
    prepareButtonElementRefresh();

    await prepareTableWithTimerElementWordsWithCurrentStatus();
    //---

    changeDisabledStatusToActions(false);

    // Запускаем все таймеры ---
    if (_tableWithTimerElementWordsWithCurrentStatus) {
        _tableWithTimerElementWordsWithCurrentStatus.startToFill();
        _tableWithTimerElementWordsWithCurrentStatus.changeDisabledStatusToTableInstruments(false);
    }
    //---
}

// Действия ---
function prepareButtonWithImgAndTextElementDoubleClickDeleteInactiveWordsInCollections() {
    let button = document.getElementById("button_delete_inactive_words_in_collections");
    let span = document.getElementById("span_delete_inactive_words_in_collections");
    let img = document.getElementById("img_delete_inactive_words_in_collections");
    if (button && span && img) {
        let buttonWithImgAndTextElement = new ButtonWithImgAndSpanElement(button, img, span);
        let buttonWithImgAndSpanElementDoubleClick =
            new ButtonWithImgAndSpanElementDoubleClick(buttonWithImgAndTextElement);
        buttonWithImgAndSpanElementDoubleClick.setAfterDoubleClickFunction(async function() {
            let jsonResponse = await _WORDS_IN_COLLECTION_API.DELETE.deleteAllWithoutActiveStatus();
            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                if (_tableWithTimerElementWordsWithCurrentStatus) {
                    _tableWithTimerElementWordsWithCurrentStatus.startToFill();
                }

                buttonWithImgAndSpanElementDoubleClick.refresh();
            } else {
                buttonWithImgAndSpanElementDoubleClick.turnOff();
                buttonWithImgAndSpanElementDoubleClick.changeTo(_BUTTON_WITH_IMG_AND_SPAN_ELEMENT_TYPES.DENY);

                buttonWithImgAndSpanElementDoubleClick.changeSpanText(
                    new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage());
            }
        });
        buttonWithImgAndSpanElementDoubleClick.prepare();

        _buttonWithImgAndTextElementDoubleClickDeleteInactiveWordsInCollections =
            buttonWithImgAndSpanElementDoubleClick;
    }
}

function prepareButtonWithImgAndTextElementDoubleClickDeleteAllUnclaimedWords() {
    let button = document.getElementById("button_delete_all_unclaimed_words");
    let span = document.getElementById("span_delete_all_unclaimed_words");
    let img = document.getElementById("img_delete_all_unclaimed_words");
    if (button && span && img) {
        let buttonWithImgAndTextElement = new ButtonWithImgAndSpanElement(button, img, span);
        let buttonWithImgAndSpanElementDoubleClick =
            new ButtonWithImgAndSpanElementDoubleClick(buttonWithImgAndTextElement);
        buttonWithImgAndSpanElementDoubleClick.setAfterDoubleClickFunction(async function() {
            let jsonResponse = await _WORDS_API.DELETE.deleteAllUnclaimed();
            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                if (_tableWithTimerElementWordsWithCurrentStatus) {
                    _tableWithTimerElementWordsWithCurrentStatus.startToFill();
                }

                buttonWithImgAndSpanElementDoubleClick.refresh();
            } else {
                buttonWithImgAndSpanElementDoubleClick.turnOff();
                buttonWithImgAndSpanElementDoubleClick.changeTo(_BUTTON_WITH_IMG_AND_SPAN_ELEMENT_TYPES.DENY);

                buttonWithImgAndSpanElementDoubleClick.changeSpanText(
                    new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage());
            }
        });
        buttonWithImgAndSpanElementDoubleClick.prepare();

        _buttonWithImgAndTextElementDoubleClickDeleteUnclaimedWords = buttonWithImgAndSpanElementDoubleClick;
    }
}

function prepareButtonWithImgAndTextElementDoubleClickAddWordStatusToWordsWithoutStatus() {
    let button = document.getElementById("button_add_word_status_to_words_without_status");
    let span = document.getElementById("span_add_word_status_to_words_without_status");
    let img = document.getElementById("img_add_word_status_to_words_without_status");
    if (button && span && img) {
        let buttonWithImgAndTextElement = new ButtonWithImgAndSpanElement(button, img, span);
        let buttonWithImgAndSpanElementDoubleClick =
            new ButtonWithImgAndSpanElementDoubleClick(buttonWithImgAndTextElement);
        buttonWithImgAndSpanElementDoubleClick.setAfterDoubleClickFunction(async function() {
            let dto = new EntityValueRequestDTO();
            dto.setValue(_WORD_STATUSES.NEW.CODE);

            let jsonResponse = await _WORD_STATUS_HISTORIES_API.POST.addWordStatusToWordsWithoutStatus(dto);
            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                if (_tableWithTimerElementWordsWithCurrentStatus) {
                    _tableWithTimerElementWordsWithCurrentStatus.startToFill();
                }

                buttonWithImgAndSpanElementDoubleClick.refresh();
            } else {
                buttonWithImgAndSpanElementDoubleClick.turnOff();
                buttonWithImgAndSpanElementDoubleClick.changeTo(
                    _BUTTON_WITH_IMG_AND_SPAN_ELEMENT_TYPES.DENY);

                buttonWithImgAndSpanElementDoubleClick.changeSpanText(
                    new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage());
            }
        });
        buttonWithImgAndSpanElementDoubleClick.prepare();

        _buttonWithImgAndTextElementDoubleClickAddWordStatusToWordsWithoutStatus =
            buttonWithImgAndSpanElementDoubleClick;
    }
}

function changeDisabledStatusToActions(isDisabled) {
    if (_buttonWithImgAndTextElementDoubleClickDeleteInactiveWordsInCollections) {
        _buttonWithImgAndTextElementDoubleClickDeleteInactiveWordsInCollections.changeDisabledStatus(isDisabled);
    }

    if (_buttonWithImgAndTextElementDoubleClickDeleteUnclaimedWords) {
        _buttonWithImgAndTextElementDoubleClickDeleteUnclaimedWords.changeDisabledStatus(isDisabled);
    }

    if (_buttonWithImgAndTextElementDoubleClickAddWordStatusToWordsWithoutStatus) {
        _buttonWithImgAndTextElementDoubleClickAddWordStatusToWordsWithoutStatus.changeDisabledStatus(isDisabled);
    }
}
//---

// Элементы для поиска в таблице + таблица "Слова с текущим статусом" ---
function prepareInputTextElementFinder() {
    let inputText = document.getElementById("input_text_finder");
    if (inputText) {
        let inputTextElement = new InputTextElement(inputText);
        _inputTextElementFinder = new InputTextElementFinder(inputTextElement);
        _inputTextElementFinder.prepare();
    }
}

async function prepareSelectElementLangsIn() {
    let divContainer = document.getElementById("div_select_langs");
    let select = document.getElementById("select_langs");
    let spanFlag = document.getElementById("span_flag_select_langs");
    if (divContainer && select && spanFlag) {
        _selectElementLangsIn = new SelectElementLangsIn(
            divContainer, select, spanFlag, true);
        _selectElementLangsIn.prepare();
        await _selectElementLangsIn.fill();
    }
}

async function prepareSelectElementWordStatuses() {
    let select = document.getElementById("select_word_statuses");
    if (select) {
        _selectElementWordStatuses = new SelectElementWordStatuses(select, true);
        _selectElementWordStatuses.prepare();
        await _selectElementWordStatuses.fill();

        _selectElementWordStatuses.changeSelectedOptionByValue(_WORD_STATUSES.NEW.CODE, true);
    }
}

function prepareButtonElementRefresh() {
    let button = document.getElementById("button_refresh");
    let img = document.getElementById("img_button_refresh");
    if (button && img) {
        let buttonWithImgElement = new ButtonWithImgElement(button, img);
        _buttonElementRefresh = new ButtonElementRefresh(buttonWithImgElement);
        _buttonElementRefresh.prepare();
    }
}

async function prepareTableWithTimerElementWordsWithCurrentStatus() {
    let table = document.getElementById("table_words_with_current_status");
    let colgroup = document.getElementById("colgroup_words_with_current_status");
    let thead = document.getElementById("thead_words_with_current_status");
    let tbody = document.getElementById("tbody_words_with_current_status");
    if (table && colgroup && thead && tbody) {
        _tableWithTimerElementWordsWithCurrentStatus = new TableWithTimerElementWordsWithCurrentStatus(
            table, colgroup, thead, tbody);
        _tableWithTimerElementWordsWithCurrentStatus.setInputTextFinder(_inputTextElementFinder);
        _tableWithTimerElementWordsWithCurrentStatus.setSelectElementLangsIn(_selectElementLangsIn);
        _tableWithTimerElementWordsWithCurrentStatus.setSelectElementWordStatuses(_selectElementWordStatuses);
        _tableWithTimerElementWordsWithCurrentStatus.setButtonElementRefresh(_buttonElementRefresh);
        _tableWithTimerElementWordsWithCurrentStatus.setTimeout(_GENERAL_TIMEOUT);

        await _tableWithTimerElementWordsWithCurrentStatus.prepare();
    }
}
//---