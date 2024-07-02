import {
    SelectElementPeriods
} from "../../classes/html/select/elements/select_element_periods.js";

import {
    ButtonWithImgElement
} from "../../classes/html/button/with_img/button_with_img_element.js";

import {
    SelectElementWorkoutTypes
} from "../../classes/html/select/entity/workout_type/select_element_workout_types.js";

import {
    DivWithTimerElementWorkoutsCustomerStatistic
} from "../../classes/html/div/entity/workout/statistic/div_with_timer_element_workouts_customer_statistic.js";

import {
    BigIntUtils
} from "../../classes/utils/bigint_utils.js";

import {
    UrlUtils
} from "../../classes/url/url_utils.js";

import {
    ButtonElementRefresh
} from "../../classes/html/button/elements/button_element_refresh.js";

import {
    TableWithTimerElementWorkoutsHistory
} from "../../classes/html/table/entity/workout/table_with_timer_element_workouts_history.js";

const _URL_UTILS = new UrlUtils();
const _BIGINT_UTILS = new BigIntUtils();

const _GENERAL_TIMEOUT = 1000;

// Элементы для поиска в контейнере + контейнер "Статистика тренировок" ---
let _selectElementWorkoutTypesWorkoutsCustomerStatistic;
let _selectElementPeriodsWorkoutsCustomerStatistic;
let _buttonElementRefreshWorkoutsCustomerStatistic;

let _divWithTimerElementWorkoutsCustomerStatistic;
//---

// Элементы для поиска в таблице + таблица "История тренировок" ---
let _selectElementWorkoutTypesWorkoutsHistory;
let _buttonElementRefreshWorkoutsHistory;

let _tableWithTimerElementWorkoutsHistory;
//---

// Id владельца страницы ---
let _currentCustomerId;
//---

window.onload = async function() {
    // Пытаемся получить id владельца профиля ---
    await tryToGetCurrentCustomerId();
    //---

    // Элементы для поиска в контейнере + контейнер "Статистика тренировок" ---
    await prepareSelectElementWorkoutTypesWorkoutsCustomerStatistic();
    await prepareSelectElementPeriodsWorkoutsCustomerStatistic();
    prepareButtonElementRefreshWorkoutsCustomerStatistic();

    await prepareDivWithTimerElementWorkoutsCustomerStatistic();
    //---

    // Элементы для поиска в таблице + таблица "История тренировок" ---
    await prepareSelectElementWorkoutTypesWorkoutsHistory();
    prepareButtonElementRefreshWorkoutsHistory();

    await prepareTableWithTimerElementWorkoutsHistory();
    //---

    // Запускаем таймеры ---
    if (_divWithTimerElementWorkoutsCustomerStatistic) {
        _divWithTimerElementWorkoutsCustomerStatistic.startToFill();
        _divWithTimerElementWorkoutsCustomerStatistic.changeDisabledStatusToDivInstruments(false);
    }

    if (_tableWithTimerElementWorkoutsHistory) {
        _tableWithTimerElementWorkoutsHistory.startToFill();
        _tableWithTimerElementWorkoutsHistory.changeDisabledStatusToTableInstruments(false);
    }
    //---
}

async function tryToGetCurrentCustomerId() {
    let pathVariable = _URL_UTILS.getPathVariable();
    if (pathVariable) {
        _currentCustomerId = _BIGINT_UTILS.parse(pathVariable);
    }
}

// Элементы для поиска в контейнере + контейнер "Статистика тренировок" ---
async function prepareSelectElementWorkoutTypesWorkoutsCustomerStatistic() {
    let divContainer = document.getElementById("div_select_workout_types_workouts_customer_statistic");
    let select = document.getElementById("select_workout_types_workouts_customer_statistic");
    let img = document.getElementById("img_select_workout_types_workouts_customer_statistic");
    if (divContainer && select && img) {
        _selectElementWorkoutTypesWorkoutsCustomerStatistic =
            new SelectElementWorkoutTypes(divContainer, select, img, true);
        await _selectElementWorkoutTypesWorkoutsCustomerStatistic.prepare();
        await _selectElementWorkoutTypesWorkoutsCustomerStatistic.fill();
    }
}

async function prepareSelectElementPeriodsWorkoutsCustomerStatistic() {
    let select = document.getElementById("select_periods_workouts_customer_statistic");
    if (select) {
        _selectElementPeriodsWorkoutsCustomerStatistic = new SelectElementPeriods(select, false);
        await _selectElementPeriodsWorkoutsCustomerStatistic.prepare();
        await _selectElementPeriodsWorkoutsCustomerStatistic.fill();
    }
}

function prepareButtonElementRefreshWorkoutsCustomerStatistic() {
    let button = document.getElementById("button_refresh_workouts_customer_statistic");
    let img = document.getElementById("img_button_refresh_workouts_customer_statistic");
    if (button && img) {
        let buttonWithImgElement = new ButtonWithImgElement(button, img);
        _buttonElementRefreshWorkoutsCustomerStatistic = new ButtonElementRefresh(buttonWithImgElement);
        _buttonElementRefreshWorkoutsCustomerStatistic.prepare();
    }
}

async function prepareDivWithTimerElementWorkoutsCustomerStatistic() {
    let div = document.getElementById("div_workouts_customer_statistic");
    if (div) {
        _divWithTimerElementWorkoutsCustomerStatistic = new DivWithTimerElementWorkoutsCustomerStatistic(div);
        _divWithTimerElementWorkoutsCustomerStatistic.setTimeout(_GENERAL_TIMEOUT);
        _divWithTimerElementWorkoutsCustomerStatistic.setCustomerId(_currentCustomerId);
        _divWithTimerElementWorkoutsCustomerStatistic.setSelectElementWorkoutTypes(_selectElementWorkoutTypesWorkoutsCustomerStatistic);
        _divWithTimerElementWorkoutsCustomerStatistic.setSelectElementPeriods(_selectElementPeriodsWorkoutsCustomerStatistic);
        _divWithTimerElementWorkoutsCustomerStatistic.setButtonElementRefresh(_buttonElementRefreshWorkoutsCustomerStatistic);

        await _divWithTimerElementWorkoutsCustomerStatistic.prepare();
    }
}
//---

// Элементы для поиска в таблице + таблица "История тренировок" ---
async function prepareSelectElementWorkoutTypesWorkoutsHistory() {
    let divContainer = document.getElementById("div_select_workout_types_workouts_history");
    let select = document.getElementById("select_workout_types_workouts_history");
    let img = document.getElementById("img_select_workout_types_workouts_history");
    if (divContainer && select && img) {
        _selectElementWorkoutTypesWorkoutsHistory =
            new SelectElementWorkoutTypes(divContainer, select, img, true);
        await _selectElementWorkoutTypesWorkoutsHistory.prepare();
        await _selectElementWorkoutTypesWorkoutsHistory.fill();
    }
}

function prepareButtonElementRefreshWorkoutsHistory() {
    let button = document.getElementById("button_refresh_workouts_history");
    let img = document.getElementById("img_button_refresh_workouts_history");
    if (button && img) {
        let buttonWithImgElement = new ButtonWithImgElement(button, img);
        _buttonElementRefreshWorkoutsHistory = new ButtonElementRefresh(buttonWithImgElement);
        _buttonElementRefreshWorkoutsHistory.prepare();
    }
}

async function prepareTableWithTimerElementWorkoutsHistory() {
    let table = document.getElementById("table_workouts_history");
    let colgroup = document.getElementById("colgroup_workouts_history");
    let thead = document.getElementById("thead_workouts_history");
    let tbody = document.getElementById("tbody_workouts_history");
    if (table && colgroup && thead && tbody) {
        _tableWithTimerElementWorkoutsHistory = new TableWithTimerElementWorkoutsHistory(table, colgroup, thead, tbody);
        _tableWithTimerElementWorkoutsHistory.setTimeout(_GENERAL_TIMEOUT);
        _tableWithTimerElementWorkoutsHistory.setSelectElementWorkoutTypes(
            _selectElementWorkoutTypesWorkoutsHistory);
        _tableWithTimerElementWorkoutsHistory.setButtonElementRefresh(_buttonElementRefreshWorkoutsHistory);
        _tableWithTimerElementWorkoutsHistory.setCustomerId(_currentCustomerId);

        await _tableWithTimerElementWorkoutsHistory.prepare();
    }
}
//---