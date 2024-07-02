import {
    SelectElementBoolean
} from "../../classes/html/select/elements/select_element_boolean.js";

import {
    SelectElementLangsIn
} from "../../classes/html/select/entity/lang/in/select_element_langs_in.js";

import {
    DivWithTimerElementCustomerCollectionsStatistic
} from "../../classes/html/div/entity/customer_collection/statistic/div_with_timer_element_customer_collections_statistic.js";

import {
    InputTextElementFinder
} from "../../classes/html/input/text/elements/input_text_element_finder.js";

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
    TableWithTimerElementMyCustomerCollections
} from "../../classes/html/table/entity/customer_collection/table_with_timer_element_my_customer_collections.js";

const _GENERAL_TIMEOUT = 1000;

// Контейнер "Статистика коллекций" ---
let _divWithTimerElementCustomerCollectionsStatistic;
//---

// Элементы для поиска в таблице + таблица "Мои коллекции" ---
let _inputTextElementFinder;
let _selectElementLangsIn;
let _selectElementBooleanIsActive;
let _buttonElementRefresh;

let _tableWithTimerElementMyCustomerCollections;
//---

window.onload = async function() {
    // Контейнер "Статистика коллекций" ---
    await prepareDivWithTimerElementCustomerCollectionsStatistic();
    //---

    // Элементы для поиска в таблице + таблица ---
    prepareInputTextElementFinder();
    await prepareSelectElementLangsIn();
    await prepareSelectElementBooleanIsActive();
    prepareButtonElementRefresh();

    await prepareTableWithTimerElementMyCustomerCollections();
    //---

    // Запускаем таймеры ---
    if (_divWithTimerElementCustomerCollectionsStatistic) {
        _divWithTimerElementCustomerCollectionsStatistic.startToFill();
    }

    if (_tableWithTimerElementMyCustomerCollections) {
        _tableWithTimerElementMyCustomerCollections.startToFill();
        _tableWithTimerElementMyCustomerCollections.changeDisabledStatusToTableInstruments(false);
    }
    //---
}

// Статистика ---
async function prepareDivWithTimerElementCustomerCollectionsStatistic() {
    let div = document.getElementById("div_customer_collections_statistic");
    if (div) {
        _divWithTimerElementCustomerCollectionsStatistic = new DivWithTimerElementCustomerCollectionsStatistic(div, true);
        _divWithTimerElementCustomerCollectionsStatistic.setTimeout(_GENERAL_TIMEOUT);
        await _divWithTimerElementCustomerCollectionsStatistic.prepare();
    }
}
//---

// Элементы для поиска в таблице + таблица "Мои коллекции" ---
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

async function prepareSelectElementBooleanIsActive() {
    let select = document.getElementById("select_is_active");
    if (select) {
        _selectElementBooleanIsActive = new SelectElementBoolean(select, true);
        _selectElementBooleanIsActive.prepare();
        await _selectElementBooleanIsActive.fill();
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

async function prepareTableWithTimerElementMyCustomerCollections() {
    let table = document.getElementById("table_my_customer_collections");
    let colgroup = document.getElementById("colgroup_my_customer_collections");
    let thead = document.getElementById("thead_my_customer_collections");
    let tbody = document.getElementById("tbody_my_customer_collections");
    if (table && colgroup && thead && tbody) {
        _tableWithTimerElementMyCustomerCollections =
            new TableWithTimerElementMyCustomerCollections(table, colgroup, thead, tbody);
        _tableWithTimerElementMyCustomerCollections.setTimeout(_GENERAL_TIMEOUT);
        _tableWithTimerElementMyCustomerCollections.setDivWithTimerElementCustomerCollectionsStatistic(
            _divWithTimerElementCustomerCollectionsStatistic);
        _tableWithTimerElementMyCustomerCollections.setInputTextElementFinder(_inputTextElementFinder);
        _tableWithTimerElementMyCustomerCollections.setSelectElementLangsIn(_selectElementLangsIn);
        _tableWithTimerElementMyCustomerCollections.setSelectElementBooleanIsActive(_selectElementBooleanIsActive);
        _tableWithTimerElementMyCustomerCollections.setButtonElementRefresh(_buttonElementRefresh);
        await _tableWithTimerElementMyCustomerCollections.prepare();
    }
}
//---