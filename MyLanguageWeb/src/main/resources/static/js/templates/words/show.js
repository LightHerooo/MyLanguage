import {
    DivWithTimerElementWordsStatistic
} from "../../classes/html/div/entity/word/div_with_timer_element_words_statistic.js";

import {
    SelectElementCustomerCollections
} from "../../classes/html/select/entity/customer_collection/select_element_customer_collections.js";

import {
    DivWithTimerElementCustomerCollectionInfo
} from "../../classes/html/div/entity/customer_collection/info/div_with_timer_element_customer_collection_info.js";

import {
    InputTextElement
} from "../../classes/html/input/text/input_text_element.js";

import {
    InputTextElementFinder
} from "../../classes/html/input/text/elements/input_text_element_finder.js";

import {
    SelectElementLangsIn
} from "../../classes/html/select/entity/lang/in/select_element_langs_in.js";

import {
    ButtonWithImgElement
} from "../../classes/html/button/with_img/button_with_img_element.js";

import {
    ButtonElementRefresh
} from "../../classes/html/button/elements/button_element_refresh.js";

import {
    TableWithTimerElementWords
} from "../../classes/html/table/entity/word/table_with_timer_element_words.js";

const _GENERAL_TIMEOUT = 1000;

// Контейнер "Статистика по словам" ---
let _divWithTimerElementWordsStatistic;
//---

// Контейнер "Информация о коллекции" ---
let _divWithTimerElementCustomerCollectionInfo;
//---

// Элементы для поиска в таблице + таблица "Слова" ---
let _inputTextElementFinder;
let _selectElementLangsIn;
let _selectElementCustomerCollections;
let _buttonElementRefresh;

let _tableWithTimerElementWords;
//---

window.onload = async function () {
    // Контейнер "Статистика по словам" ---
    await prepareDivWithTimerElementWordsStatistic();
    //---

    // Контейнер "Информация о коллекции" ---
    await prepareSelectElementCustomerCollections();
    await prepareDivWithTimerElementCustomerCollectionInfo();
    //---

    // Элементы для поиска в таблице + таблица ---
    prepareInputTextElementFinder();
    await prepareSelectElementLangsIn();
    prepareButtonElementRefresh();
    await prepareTableWithTimerElementWords();
    //---

    // Запускаем таймеры ---
    if (_divWithTimerElementWordsStatistic) {
        _divWithTimerElementWordsStatistic.startToFill();
    }

    if (_divWithTimerElementCustomerCollectionInfo) {
        _divWithTimerElementCustomerCollectionInfo.startToFill();
    }

    if (_tableWithTimerElementWords) {
        _tableWithTimerElementWords.startToFill();
        _tableWithTimerElementWords.changeDisabledStatusToTableInstruments(false);
    }
    //---
}

// Контейнер "Статистика по словам" ---
async function prepareDivWithTimerElementWordsStatistic() {
    let div = document.getElementById("div_words_statistic");
    if (div) {
        _divWithTimerElementWordsStatistic = new DivWithTimerElementWordsStatistic(div, false);
        _divWithTimerElementWordsStatistic.setTimeout(_GENERAL_TIMEOUT);
        await _divWithTimerElementWordsStatistic.prepare();
    }
}
//---

// Контейнер "Информация о коллекции" ---
async function prepareSelectElementCustomerCollections() {
    let divContainer = document.getElementById("div_select_customer_collections");
    let select = document.getElementById("select_customer_collections");
    let spanFlag = document.getElementById("span_flag_select_customer_collections");
    if (divContainer && select && spanFlag) {
        _selectElementCustomerCollections =
            new SelectElementCustomerCollections(divContainer, select, spanFlag, true);
        _selectElementCustomerCollections.prepare();
        await _selectElementCustomerCollections.fill();
    }
}

async function prepareDivWithTimerElementCustomerCollectionInfo() {
    let div = document.getElementById("div_customer_collection_info");
    if (div) {
        _divWithTimerElementCustomerCollectionInfo = new DivWithTimerElementCustomerCollectionInfo(div);
        _divWithTimerElementCustomerCollectionInfo.setSelectElementCustomerCollections(_selectElementCustomerCollections);
        _divWithTimerElementCustomerCollectionInfo.setTimeout(_GENERAL_TIMEOUT);

        await _divWithTimerElementCustomerCollectionInfo.prepare();
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
//---

function prepareButtonElementRefresh() {
    let button = document.getElementById("button_refresh");
    let img = document.getElementById("img_button_refresh");
    if (button && img) {
        let buttonWithImgElement = new ButtonWithImgElement(button, img);
        _buttonElementRefresh = new ButtonElementRefresh(buttonWithImgElement);
        _buttonElementRefresh.prepare();
    }
}

async function prepareTableWithTimerElementWords() {
    let table = document.getElementById("table_words");
    let colgroup = document.getElementById("colgroup_words");
    let thead = document.getElementById("thead_words");
    let tbody = document.getElementById("tbody_words");
    if (table && colgroup && thead && tbody) {
        _tableWithTimerElementWords = new TableWithTimerElementWords(table, colgroup, thead, tbody);
        _tableWithTimerElementWords.setTimeout(_GENERAL_TIMEOUT);
        _tableWithTimerElementWords.setDivWithTimerElementWordsStatistic(_divWithTimerElementWordsStatistic);
        _tableWithTimerElementWords.setInputTextElementFinder(_inputTextElementFinder);
        _tableWithTimerElementWords.setSelectElementLangsIn(_selectElementLangsIn);
        _tableWithTimerElementWords.setSelectElementCustomerCollections(_selectElementCustomerCollections);
        _tableWithTimerElementWords.setButtonElementRefresh(_buttonElementRefresh);
        _tableWithTimerElementWords.setDivWithTimerElementCustomerCollectionInfo(_divWithTimerElementCustomerCollectionInfo);

        await _tableWithTimerElementWords.prepare();
    }
}