import {
    SelectElementLangsIn
} from "../../classes/html/select/entity/lang/in/select_element_langs_in.js";

import {
    SelectElementWordStatuses
} from "../../classes/html/select/entity/word_status/select_element_word_statuses.js";

import {
    InputTextElementFinder
} from "../../classes/html/input/text/elements/input_text_element_finder.js";

import {
    DivWithTimerElementWordsStatistic
} from "../../classes/html/div/entity/word/div_with_timer_element_words_statistic.js";

import {
    InputTextElement
} from "../../classes/html/input/text/input_text_element.js";

import {
    ButtonWithImgElement
} from "../../classes/html/button/with_img/button_with_img_element.js";

import {
    ButtonElementRefresh
} from "../../classes/html/button/elements/button_element_refresh.js";

import {
    TableWithTimerElementMyWordsHistory
} from "../../classes/html/table/entity/word_status_history/table_with_timer_element_my_words_history.js";

const _GENERAL_TIMEOUT = 1000;

// Контейнер "Статистика слов" ---
let _divWithTimerElementWordsStatistic;
//---

// Элементы для поиска в таблице + таблица "История моих слов" ---
let _inputTextElementFinder;
let _selectElementLangsIn;
let _selectElementWordStatuses;
let _buttonElementRefresh;

let _tableWithTimerElementMyWordsHistory;
//---

window.onload = async function() {
    // Контейнер "Статистика слов" ---
    await prepareDivWithTimerElementWordsStatistic();
    //---

    // Элементы для поиска в таблице + таблица ---
    prepareInputTextElementFinder();
    await prepareSelectElementLangsIn();
    await prepareSelectElementWordStatuses();
    prepareButtonElementRefresh();
    await prepareTableWithTimerElementMyWordsHistory();
    //---

    // Запускаем таймеры ---
    if (_divWithTimerElementWordsStatistic) {
        _divWithTimerElementWordsStatistic.startToFill();
    }

    if (_tableWithTimerElementMyWordsHistory) {
        _tableWithTimerElementMyWordsHistory.startToFill();
        _tableWithTimerElementMyWordsHistory.changeDisabledStatusToTableInstruments(false);
    }
    //---
}

// Контейнер "Статистика слов" ---
async function prepareDivWithTimerElementWordsStatistic() {
    let div = document.getElementById("div_words_statistic");
    if (div) {
        _divWithTimerElementWordsStatistic = new DivWithTimerElementWordsStatistic(div, true);
        _divWithTimerElementWordsStatistic.setTimeout(_GENERAL_TIMEOUT);
        await _divWithTimerElementWordsStatistic.prepare();
    }
}
//---

// Элементы для поиска в таблице + таблица ---
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
    }
}

function prepareButtonElementRefresh() {
    let button = document.getElementById("btn_refresh");
    let img = document.getElementById("img_button_refresh");
    if (button && img) {
        let buttonWithImgElement = new ButtonWithImgElement(button, img);
        _buttonElementRefresh = new ButtonElementRefresh(buttonWithImgElement);
        _buttonElementRefresh.prepare();
    }
}

async function prepareTableWithTimerElementMyWordsHistory() {
    let table = document.getElementById("table_my_words_history");
    let colgroup = document.getElementById("colgroup_my_words_history");
    let thead = document.getElementById("thead_my_words_history");
    let tbody = document.getElementById("tbody_my_words_history");
    if (table && colgroup && thead && tbody) {
        _tableWithTimerElementMyWordsHistory = new TableWithTimerElementMyWordsHistory(table, colgroup, thead, tbody);
        _tableWithTimerElementMyWordsHistory.setDivWithTimerElementWordsStatistic(_divWithTimerElementWordsStatistic);
        _tableWithTimerElementMyWordsHistory.setInputTextElementFinder(_inputTextElementFinder);
        _tableWithTimerElementMyWordsHistory.setSelectElementLangsIn(_selectElementLangsIn);
        _tableWithTimerElementMyWordsHistory.setSelectElementWordStatuses(_selectElementWordStatuses);
        _tableWithTimerElementMyWordsHistory.setButtonElementRefresh(_buttonElementRefresh);
        await _tableWithTimerElementMyWordsHistory.prepare();
    }
}