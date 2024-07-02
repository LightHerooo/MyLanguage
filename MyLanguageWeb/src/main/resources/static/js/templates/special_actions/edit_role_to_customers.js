import {
    ButtonWithImgElement
} from "../../classes/html/button/with_img/button_with_img_element.js";

import {
    SelectElementCustomerRoles
} from "../../classes/html/select/entity/customer_role/select_element_customer_roles.js";

import {
    InputTextElement
} from "../../classes/html/input/text/input_text_element.js";

import {
    InputTextElementFinder
} from "../../classes/html/input/text/elements/input_text_element_finder.js";

import {
    ButtonElementRefresh
} from "../../classes/html/button/elements/button_element_refresh.js";

import {
    TableWithTimerElementCustomers
} from "../../classes/html/table/entity/customer/table_with_timer_element_customers.js";

const _GENERAL_TIMEOUT = 1000;

// Элементы для поиска в таблице + таблица "Пользователи" ---
let _inputTextElementFinder;
let _selectElementCustomerRoles;
let _buttonElementRefresh;

let _tableWithTimerElementCustomers;
//---

window.onload = async function() {
    // Элементы для поиска в таблице + таблица "Пользователи" ---
    prepareInputTextElementFinder();
    await prepareSelectElementCustomerRoles();
    prepareButtonElementRefresh();

    await prepareTableWithTimerElementCustomers();
    //---

    // Запускаем таймеры ---
    if (_tableWithTimerElementCustomers) {
        _tableWithTimerElementCustomers.startToFill();
        _tableWithTimerElementCustomers.changeDisabledStatusToTableInstruments(false);
    }
    //---
}

// Элементы для поиска в таблице + таблица "Пользователи" ---
function prepareInputTextElementFinder() {
    let inputText = document.getElementById("input_text_finder");
    if (inputText) {
        let inputTextElement = new InputTextElement(inputText);
        _inputTextElementFinder = new InputTextElementFinder(inputTextElement);
        _inputTextElementFinder.prepare();
    }
}

async function prepareSelectElementCustomerRoles() {
    let divContainer = document.getElementById("div_select_customer_roles");
    let select = document.getElementById("select_customer_roles");
    let img = document.getElementById("img_select_customer_roles");
    if (divContainer && select && img) {
        _selectElementCustomerRoles = new SelectElementCustomerRoles(
            divContainer, select, img, true);
        _selectElementCustomerRoles.prepare();
        await _selectElementCustomerRoles.fill();
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

async function prepareTableWithTimerElementCustomers() {
    let table = document.getElementById("table_customers");
    let colgroup = document.getElementById("colgroup_customers");
    let thead = document.getElementById("thead_customers");
    let tbody = document.getElementById("tbody_customers");
    if (table && colgroup && thead && tbody) {
        _tableWithTimerElementCustomers = new TableWithTimerElementCustomers(table, colgroup, thead, tbody);
        _tableWithTimerElementCustomers.setInputTextElementFinder(_inputTextElementFinder);
        _tableWithTimerElementCustomers.setSelectElementCustomerRoles(_selectElementCustomerRoles);
        _tableWithTimerElementCustomers.setButtonElementRefresh(_buttonElementRefresh);
        _tableWithTimerElementCustomers.setTimeout(_GENERAL_TIMEOUT);

        await _tableWithTimerElementCustomers.prepare();
    }
}
//---