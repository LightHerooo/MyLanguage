import {
    WorkoutsAPI
} from "../../classes/api/entity/workouts_api.js";

import {
    HttpStatuses
} from "../../classes/api/classes/http/http_statuses.js";

import {
    CssRoot
} from "../../classes/css/css_root.js";

import {
    CustomTimerTickerTypes
} from "../../classes/timer/ticker/custom_timer_ticker_types.js";

import {
    WorkoutResponseDTO
} from "../../classes/dto/entity/workout/response/workout_response_dto.js";

import {
    DivWithTimerElementWorkoutInfo
} from "../../classes/html/div/entity/workout/info/div_with_timer_element_workout_info.js";

import {
    DivElementTimer
} from "../../classes/html/div/elements/div_element_timer.js";

import {
    DivElementTimerWorkout
} from "../../classes/html/div/entity/workout/div_element_timer_workout.js";

import {
    UrlUtils
} from "../../classes/url/url_utils.js";

import {
    DivWithTimerElementWorkoutInteraction
} from "../../classes/html/div/entity/workout/div_with_timer_element_workout_interaction.js";

import {
    DivWithTimerElementWorkoutRoundStatisticNotOver
} from "../../classes/html/div/entity/workout/round/div_with_timer_element_workout_round_statistic_not_over.js";

const _WORKOUTS_API = new WorkoutsAPI();

const _CSS_ROOT = new CssRoot();

const _HTTP_STATUSES = new HttpStatuses();
const _CUSTOM_TIMER_TICKER_TYPES = new CustomTimerTickerTypes();
const _URL_UTILS = new UrlUtils();

const _GENERAL_TIMEOUT = 250;

// Контейнер "Информация о тренировке" ---
let _divWithTimerElementWorkoutInfo;
//---

// Контейнер "Время тренировки" ---
let _divElementTimerWorkout;
//---

// Контейнер "Взаимодействие в тренировке" ---
let _divWithTimerElementWorkoutInteraction;
//---

// Контейнер "Статистика ответов" ---
let _divWithTimerElementWorkoutRoundStatisticNotOver;
//---

let _currentWorkout;

window.onload = async function () {
    // Контейнер "Информация о тренировке" ---
    await prepareDivWithTimerElementWorkoutInfo();
    //---

    // Контейнер "Время тренировки" ---
    await prepareDivElementTimerWorkout();
    //---

    // Контейнер "Взаимодействие в тренировке" ---
    await prepareDivWithTimerElementWorkoutInteraction();
    //---

    // Контейнер "Статистика ответов" ---
    await prepareDivWithTimerElementWorkoutRoundStatisticNotOver();
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

window.onbeforeunload = async function() {
    if (_divWithTimerElementWorkoutInteraction) {
        await _divWithTimerElementWorkoutInteraction.tryToSaveCurrentMilliseconds();
    }
}

function showLoadingToAllObjects() {
    // Контейнер "Информация о тренировке" ---
    if (_divWithTimerElementWorkoutInfo) {
        _divWithTimerElementWorkoutInfo.showLoading();
    }
    //---

    // Контейнер "Взаимодействие в тренировке" ---
    if (_divWithTimerElementWorkoutInteraction) {
        _divWithTimerElementWorkoutInteraction.showLoading();
    }
    //---

    // Контейнер "Статистика ответов" ---
    if (_divWithTimerElementWorkoutRoundStatisticNotOver) {
        _divWithTimerElementWorkoutRoundStatisticNotOver.showLoading();
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

        // Контейнер "Время тренировки" ---
        if (_divElementTimerWorkout) {
            _divElementTimerWorkout.setWorkoutResponseDTO(_currentWorkout);
        }
        //---

        // Контейнер "Взаимодействие в тренировке" ---
        if (_divWithTimerElementWorkoutInteraction) {
            _divWithTimerElementWorkoutInteraction.setWorkoutResponseDTO(_currentWorkout);
        }
        //---

        // Контейнер "Статистика ответов" ---
        if (_divWithTimerElementWorkoutRoundStatisticNotOver) {
            _divWithTimerElementWorkoutRoundStatisticNotOver.setWorkoutId(_currentWorkout.getId());
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

    // Контейнер "Время тренировки" ---
    if (_divElementTimerWorkout) {
        _divElementTimerWorkout.changeStartMillisecondsByWorkout();
    }
    //---

    // Контейнер "Взаимодействие в тренировке" ---
    if (_divWithTimerElementWorkoutInteraction) {
        _divWithTimerElementWorkoutInteraction.setDivElementTimerWorkout(_divElementTimerWorkout);
        _divWithTimerElementWorkoutInteraction.setDivWithTimerElementWorkoutRoundStatisticNotOver(
            _divWithTimerElementWorkoutRoundStatisticNotOver);
        _divWithTimerElementWorkoutInteraction.startToFill();
    }
    //---
}

// Контейнер "Информация о тренировке" ---
async function prepareDivWithTimerElementWorkoutInfo() {
    let div = document.getElementById("div_workout_info");
    if (div) {
        _divWithTimerElementWorkoutInfo = new DivWithTimerElementWorkoutInfo(div);
        _divWithTimerElementWorkoutInfo.setDoNeedToShowSpanElementCustomer(false);
        _divWithTimerElementWorkoutInfo.setTimeout(_GENERAL_TIMEOUT);

        await _divWithTimerElementWorkoutInfo.prepare();
    }
}
//---

// Контейнер "Время тренировки" ---
async function prepareDivElementTimerWorkout() {
    let div = document.getElementById("div_timer_workout");
    if (div) {
        let divElementTimer = new DivElementTimer(div, _CSS_ROOT.BIG_FONT_SIZE_STYLE_ID);
        _divElementTimerWorkout = new DivElementTimerWorkout(divElementTimer);
        _divElementTimerWorkout.setCustomTimerTickerType(_CUSTOM_TIMER_TICKER_TYPES.FORWARD);

        await _divElementTimerWorkout.prepare();
        await _divElementTimerWorkout.fill();
    }
}
//---

// Контейнер "Взаимодействие в тренировке" ---
async function prepareDivWithTimerElementWorkoutInteraction() {
    let div = document.getElementById("div_workout_interaction");
    if (div) {
        _divWithTimerElementWorkoutInteraction = new DivWithTimerElementWorkoutInteraction(div);
        _divWithTimerElementWorkoutInteraction.setTimeout(_GENERAL_TIMEOUT);

        await _divWithTimerElementWorkoutInteraction.prepare();
    }
}
//---

// Контейнер "История ответов" ---
async function prepareDivWithTimerElementWorkoutRoundStatisticNotOver() {
    let div = document.getElementById("div_workout_round_statistic_not_over");
    if (div) {
        _divWithTimerElementWorkoutRoundStatisticNotOver = new DivWithTimerElementWorkoutRoundStatisticNotOver(div);
        _divWithTimerElementWorkoutRoundStatisticNotOver.setTimeout(_GENERAL_TIMEOUT);

        await _divWithTimerElementWorkoutRoundStatisticNotOver.prepare();
    }
}
//---