import {
    SelectElementCustomerCollections
} from "../../classes/html/select/entity/customer_collection/select_element_customer_collections.js";

import {
    InputTextElementFinder
} from "../../classes/html/input/text/elements/input_text_element_finder.js";

import {
    DivWithTimerElementCustomerCollectionInfo
} from "../../classes/html/div/entity/customer_collection/info/div_with_timer_element_customer_collection_info.js";

import {
    DivWithTimerElementCustomerCollectionsStatistic
} from "../../classes/html/div/entity/customer_collection/statistic/div_with_timer_element_customer_collections_statistic.js";

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
    TableWithTimerElementWordsInCollection
} from "../../classes/html/table/entity/word_in_collection/table_with_timer_element_words_in_collection.js";

const _GENERAL_TIMEOUT = 1000;

// Контейнер "Статистика коллекций" ---
let _divWithTimerElementCustomerCollectionsStatistic;
//---

// Контейнер "Информация о коллекции" ---
let _divWithTimerElementCustomerCollectionInfo;
//---

// Элементы для поиска в таблице + таблица "Слова в коллекции" ---
let _inputTextElementFinder;
let _selectElementCustomerCollections;
let _buttonElementRefresh;

let _tableWithTimerElementWordsInCollection;
//---

window.onload = async function () {
    // Контейнер "Статистика коллекций" ---
    await prepareDivWithTimerElementCustomerCollectionsStatistic();
    //---

    // Контейнер "Информация о коллекции" ---
    await prepareSelectElementCustomerCollections();
    await prepareDivWithTimerElementCustomerCollectionInfo();
    //---

    // Элементы для поиска в таблице + таблица ---
    prepareInputTextElementFinder();
    prepareButtonElementRefresh();

    await prepareTableWithTimerWordsInCollection();
    //---

    // Запускаем таймеры ---
    if (_divWithTimerElementCustomerCollectionsStatistic) {
        _divWithTimerElementCustomerCollectionsStatistic.startToFill();
    }

    if (_divWithTimerElementCustomerCollectionInfo) {
        _divWithTimerElementCustomerCollectionInfo.startToFill();
    }

    if (_tableWithTimerElementWordsInCollection) {
        _tableWithTimerElementWordsInCollection.startToFill();
        _tableWithTimerElementWordsInCollection.changeDisabledStatusToTableInstruments(false);
    }
    //---
}

// Контейнер "Статистика коллекций" ---
async function prepareDivWithTimerElementCustomerCollectionsStatistic() {
    let div = document.getElementById("div_customer_collections_statistic");
    if (div) {
        _divWithTimerElementCustomerCollectionsStatistic = new DivWithTimerElementCustomerCollectionsStatistic(div);
        _divWithTimerElementCustomerCollectionsStatistic.setTimeout(_GENERAL_TIMEOUT);
        await _divWithTimerElementCustomerCollectionsStatistic.prepare();
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

// Слова в коллекции ---
function prepareInputTextElementFinder() {
    let inputText = document.getElementById("input_text_finder");
    if (inputText) {
        let inputTextElement = new InputTextElement(inputText);
        _inputTextElementFinder = new InputTextElementFinder(inputTextElement);
        _inputTextElementFinder.prepare();
    }
}

function prepareButtonElementRefresh() {
    let button = document.getElementById("button_refresh");
    let img = document.getElementById("img_button_refresh");
    if (button && img) {
        let buttonWithImgElement = new ButtonWithImgElement(button, img)
        _buttonElementRefresh = new ButtonElementRefresh(buttonWithImgElement);
        _buttonElementRefresh.prepare();
    }
}

async function prepareTableWithTimerWordsInCollection() {
    let table = document.getElementById("table_words_in_collection");
    let colgroup = document.getElementById("colgroup_words_in_collection");
    let thead = document.getElementById("thead_words_in_collection");
    let tbody = document.getElementById("tbody_words_in_collection");
    if (table && colgroup && thead && tbody) {
        _tableWithTimerElementWordsInCollection = new TableWithTimerElementWordsInCollection(
            table, colgroup, thead, tbody, true);
        _tableWithTimerElementWordsInCollection.setTimeout(_GENERAL_TIMEOUT);
        _tableWithTimerElementWordsInCollection.setDivWithTimerElementCustomerCollectionsStatistic(_divWithTimerElementCustomerCollectionsStatistic);
        _tableWithTimerElementWordsInCollection.setInputTextElementFinder(_inputTextElementFinder);
        _tableWithTimerElementWordsInCollection.setSelectElementCustomerCollections(_selectElementCustomerCollections);
        _tableWithTimerElementWordsInCollection.setButtonElementRefresh(_buttonElementRefresh);
        _tableWithTimerElementWordsInCollection.setDivWithTimerElementCustomerCollectionInfo(_divWithTimerElementCustomerCollectionInfo);
        await _tableWithTimerElementWordsInCollection.prepare();
    }
}
//---