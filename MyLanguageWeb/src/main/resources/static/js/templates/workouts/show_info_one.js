import {
    WorkoutsAPI
} from "../../classes/api/entity/workouts_api.js";

import {
    HttpStatuses
} from "../../classes/api/classes/http/http_statuses.js";

import {
    DivWithTimerElementWorkoutInfo
} from "../../classes/html/div/entity/workout/info/div_with_timer_element_workout_info.js";

import {
    DivWithTimerElementWorkoutActions
} from "../../classes/html/div/entity/workout/div_with_timer_element_workout_actions.js";

import {
    DivWithTimerElementWorkoutStatistic
} from "../../classes/html/div/entity/workout/statistic/div_with_timer_element_workout_statistic.js";

import {
    WorkoutResponseDTO
} from "../../classes/dto/entity/workout/response/workout_response_dto.js";

import {
    UrlUtils
} from "../../classes/url/url_utils.js";

import {
    TableWithTimerElementWorkoutAnswersHistoryOver
} from "../../classes/html/table/entity/workout_item/table_with_timer_element_workout_answers_history_over.js";

const _WORKOUTS_API = new WorkoutsAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _URL_UTILS = new UrlUtils();

const _GENERAL_TIMEOUT = 250;

// Контейнер "Информация о тренировке" ---
let _divWithTimerElementWorkoutInfo;
//---

// Контейнер "Действия по тренировке" ---
let _divWithTimerElementWorkoutActions;
//---

// Контейнер "Статистика по тренировке" ---
let _divWithTimerElementWorkoutStatistic;
//---

// Таблица "История ответов" ---
let _tableWithTimerElementWorkoutAnswersHistoryOver;
//---

// Просматриваемая тренировка ---
let _currentWorkout;
//---

window.onload = async function() {
    // Контейнер "Информация о тренировке" ---
    await prepareDivWithTimerElementWorkoutInfo();
    //---

    // Контейнер "Действия по тренировке" ---
    await prepareDivWithTimerElementWorkoutActions();
    //---

    // Контейнер "Статистика по тренировке" ---
    await prepareDivWithTimerElementWorkoutStatistic();
    //---

    // Таблица "История ответов" ---
    await prepareTableWithTimerElementWorkoutAnswersHistory();
    //---

    // Отображаем загрузки во всех контейнерах перед поиском просматриваемой тренировки ---
    showLoadingToAllObjects();
    //---

    // Пытаемся найти просматриваемую тренировку ---
    await tryToFindCurrentWorkout();
    //---

    // Пытаемся занести найденную тренировку в объекты ---
    tryToSetFoundWorkoutToObjects();
    //---

    // Запускаем все таймеры ---
    startToFillToAllObjects();
    //---
}

function showLoadingToAllObjects() {
    // Контейнер "Информация о тренировке" ---
    if (_divWithTimerElementWorkoutInfo) {
        _divWithTimerElementWorkoutInfo.showLoading();
    }
    //---

    // Контейнер "Действия по тренировке" ---
    if (_divWithTimerElementWorkoutActions) {
        _divWithTimerElementWorkoutActions.showLoading();
    }
    //---

    // Контейнер "Статистика по тренировке" ---
    if (_divWithTimerElementWorkoutStatistic) {
        _divWithTimerElementWorkoutStatistic.showLoading();
    }
    //---
}

async function tryToFindCurrentWorkout() {
    let pathVariable = _URL_UTILS.getPathVariable();
    if (pathVariable) {
        let jsonResponse = await _WORKOUTS_API.GET.findById(pathVariable);
        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
            _currentWorkout = new WorkoutResponseDTO(jsonResponse.getJson());
        }
    }
}

function tryToSetFoundWorkoutToObjects() {
    if (_currentWorkout) {
        // Контейнер "Информация о тренировке" ---
        if (_divWithTimerElementWorkoutInfo) {
            _divWithTimerElementWorkoutInfo.setWorkoutResponseDTO(_currentWorkout);
        }
        //---

        // Контейнер "Действия по тренировке" ---
        if (_divWithTimerElementWorkoutActions) {
            _divWithTimerElementWorkoutActions.setWorkoutResponseDTO(_currentWorkout);
        }
        //---

        // Контейнер "Статистика по тренировке" ---
        if (_divWithTimerElementWorkoutStatistic) {
            _divWithTimerElementWorkoutStatistic.setWorkoutResponseDTO(_currentWorkout);
        }
        //---

        // Таблица "История ответов" ---
        if (_tableWithTimerElementWorkoutAnswersHistoryOver) {
            _tableWithTimerElementWorkoutAnswersHistoryOver.setWorkoutResponseDTO(_currentWorkout);
        }
        //---
    }
}

function startToFillToAllObjects() {
    // Контейнер "Информация о тренировке" ---
    if (_divWithTimerElementWorkoutInfo) {
        _divWithTimerElementWorkoutInfo.startToFill();
    }
    //---

    // Контейнер "Действия по тренировке" ---
    if (_divWithTimerElementWorkoutActions) {
        _divWithTimerElementWorkoutActions.startToFill();
    }
    //---

    // Контейнер "Статистика по тренировке" ---
    if (_divWithTimerElementWorkoutStatistic) {
        _divWithTimerElementWorkoutStatistic.startToFill();
    }
    //---

    // Таблица "История ответов" ---
    if (_tableWithTimerElementWorkoutAnswersHistoryOver) {
        _tableWithTimerElementWorkoutAnswersHistoryOver.startToFill();
    }
    //---
}

// Контейнер "Информация о тренировке" ---
async function prepareDivWithTimerElementWorkoutInfo() {
    let div = document.getElementById("div_workout_info");
    if (div) {
        _divWithTimerElementWorkoutInfo = new DivWithTimerElementWorkoutInfo(div);
        _divWithTimerElementWorkoutInfo.setTimeout(_GENERAL_TIMEOUT);
        _divWithTimerElementWorkoutInfo.setDoNeedToShowSpanElementCustomer(true);

        await _divWithTimerElementWorkoutInfo.prepare();
    }
}
//---

// Контейнер "Действия по тренировке" ---
async function prepareDivWithTimerElementWorkoutActions() {
    let div = document.getElementById("div_workout_actions");
    if (div) {
        _divWithTimerElementWorkoutActions = new DivWithTimerElementWorkoutActions(div);
        _divWithTimerElementWorkoutActions.setTimeout(_GENERAL_TIMEOUT);
        await _divWithTimerElementWorkoutActions.prepare();
    }
}
//---

// Контейнер "Статистика по тренировке" ---
async function prepareDivWithTimerElementWorkoutStatistic() {
    let div = document.getElementById("div_workout_statistic");
    if (div) {
        _divWithTimerElementWorkoutStatistic = new DivWithTimerElementWorkoutStatistic(div);
        _divWithTimerElementWorkoutStatistic.setTimeout(_GENERAL_TIMEOUT);
        await _divWithTimerElementWorkoutStatistic.prepare();
    }
}
//---

// Таблица "История ответов" ---
async function prepareTableWithTimerElementWorkoutAnswersHistory() {
    let table = document.getElementById("table_workout_answers_history_over");
    let colgroup = document.getElementById("colgroup_workout_answers_history_over");
    let thead = document.getElementById("thead_workout_answers_history_over");
    let tbody = document.getElementById("tbody_workout_answers_history_over");
    if (table && colgroup && thead && tbody) {
        _tableWithTimerElementWorkoutAnswersHistoryOver = new TableWithTimerElementWorkoutAnswersHistoryOver(
            table, colgroup, thead, tbody);
        _tableWithTimerElementWorkoutAnswersHistoryOver.setTimeout(_GENERAL_TIMEOUT);

        await _tableWithTimerElementWorkoutAnswersHistoryOver.prepare();
    }
}
//---

