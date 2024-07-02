import {
    WorkoutTypes
} from "../../../classes/dto/entity/workout_type/workout_types.js";

import {
    SelectWithRuleElementNumbers
} from "../../../classes/html/select/elements/select_with_rule_element_numbers.js";

import {
    SelectWithRuleElementLangsIn
} from "../../../classes/html/select/entity/lang/in/select_with_rule_element_langs_in.js";

import {
    SelectWithRuleElementLangsOut
} from "../../../classes/html/select/entity/lang/out/select_with_rule_element_langs_out.js";

import {
    ButtonWithImgElement
} from "../../../classes/html/button/with_img/button_with_img_element.js";

import {
    SelectWithRuleElementLangsInWorkoutRandomWords
} from "../../../classes/html/select/entity/lang/workout/random_words/select_with_rule_element_langs_in_workout_random_words.js";

import {
    SelectWithRuleElementLangsOutWorkoutRandomWords
} from "../../../classes/html/select/entity/lang/workout/random_words/select_with_rule_element_langs_out_workout_random_words.js";

import {
    FormElementWorkoutRandomWords
} from "../../../classes/html/form/entity/workout/form_element_workout_random_words.js";

import {
    ButtonElementRefresh
} from "../../../classes/html/button/elements/button_element_refresh.js";

import {
    TableWithTimerElementWorkoutsNotOver
} from "../../../classes/html/table/entity/workout/table_with_timer_element_workouts_not_over.js";

const _CURRENT_WORKOUT_TYPE = new WorkoutTypes().RANDOM_WORDS;
const _GENERAL_TIMEOUT = 1000;
const _NUMBERS_OF_WORDS_ARR = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

// Элементы формы + форма "Тренировка режима 'Случайные слова'" ---
let _selectWithRuleElementLangsInWorkoutRandomWords;
let _selectWithRuleElementLangsOutWorkoutRandomWords;
let _selectWithRuleElementNumbersOfWords;

let _formElementWorkoutRandomWords;
//---

// Элементы таблицы + Таблица "Незавершенные тренировки" ---
let _buttonElementRefresh;

let _tableWithTimerElementWorkoutsNotOver;
//---

window.onload = async function() {
    // Элементы формы + форма "Тренировка режима 'Случайные слова'" ---
    await prepareCoupleSelectElementsForWorkoutRandomWords();
    await prepareSelectWithRuleElementNumbersOfWords();

    await prepareFormElementWorkoutRandomWords();
    //---

    // Элементы таблицы + Таблица "Незавершенные тренировки" ---
    prepareButtonElementRefresh();

    await prepareTableWithTimerElementWorkoutsNotOver();
    //---

    if (_formElementWorkoutRandomWords) {
        _formElementWorkoutRandomWords.setTableWithTimerElementWorkoutsNotOver(_tableWithTimerElementWorkoutsNotOver);
        _formElementWorkoutRandomWords.changeDisabledStatusToFormElements(false);
    }

    if (_tableWithTimerElementWorkoutsNotOver) {
        _tableWithTimerElementWorkoutsNotOver.setFormElementCreateNewWorkout(_formElementWorkoutRandomWords);

        _tableWithTimerElementWorkoutsNotOver.startToFill();
        _tableWithTimerElementWorkoutsNotOver.changeDisabledStatusToTableInstruments(false);
    }
}

// Элементы формы + форма "Тренировка режима 'Случайные слова'" ---
async function prepareCoupleSelectElementsForWorkoutRandomWords() {
    // Входящий язык ---
    let divContainer = document.getElementById("div_select_langs_in");
    let select = document.getElementById("select_langs_in");
    let spanFlag = document.getElementById("span_flag_select_langs_in");
    if (divContainer && select && spanFlag) {
        let selectWithRuleElementLangsIn =
            new SelectWithRuleElementLangsIn(divContainer, select, spanFlag, true);
        _selectWithRuleElementLangsInWorkoutRandomWords =
            new SelectWithRuleElementLangsInWorkoutRandomWords(selectWithRuleElementLangsIn);

        _selectWithRuleElementLangsInWorkoutRandomWords.prepare();
    }
    //---

    // Выходящий язык ---
    divContainer = document.getElementById("div_select_langs_out");
    select = document.getElementById("select_langs_out");
    spanFlag = document.getElementById("span_flag_select_langs_out");
    if (divContainer && select && spanFlag) {
        let selectWithRuleElementLangsOut =
            new SelectWithRuleElementLangsOut(divContainer, select, spanFlag, true);
        _selectWithRuleElementLangsOutWorkoutRandomWords =
            new SelectWithRuleElementLangsOutWorkoutRandomWords(selectWithRuleElementLangsOut);

        _selectWithRuleElementLangsOutWorkoutRandomWords.prepare();
    }
    //---

    // Связывваем два списка между собой ---
    _selectWithRuleElementLangsInWorkoutRandomWords.setSelectWithRuleElementLangsOutWorkoutRandomWords(
        _selectWithRuleElementLangsOutWorkoutRandomWords);
    _selectWithRuleElementLangsOutWorkoutRandomWords.setSelectWithRuleElementLangsInWorkoutRandomWords(
        _selectWithRuleElementLangsInWorkoutRandomWords);
    //---

    // Заполняем списки ---
    await _selectWithRuleElementLangsInWorkoutRandomWords.fill();
    await _selectWithRuleElementLangsOutWorkoutRandomWords.fill();
    //---
}

async function prepareSelectWithRuleElementNumbersOfWords() {
    let select = document.getElementById("select_numbers_of_words");
    if (select) {
        _selectWithRuleElementNumbersOfWords = new SelectWithRuleElementNumbers(
            select, _NUMBERS_OF_WORDS_ARR, true);
        _selectWithRuleElementNumbersOfWords.prepare();

        await _selectWithRuleElementNumbersOfWords.fill();
    }
}

async function prepareFormElementWorkoutRandomWords() {
    let form = document.getElementById("form_workout_random_words");
    let buttonSubmit = document.getElementById("button_submit_workout_random_words");
    let buttonReset = document.getElementById("button_reset_workout_random_words");
    let divMessageContainer = document.getElementById("div_message_container_workout_random_words");
    if (form && buttonSubmit && buttonReset && divMessageContainer) {
        _formElementWorkoutRandomWords = new FormElementWorkoutRandomWords(form, buttonSubmit, divMessageContainer);
        _formElementWorkoutRandomWords.setButtonReset(buttonReset);
        _formElementWorkoutRandomWords.setSelectWithRuleElementLangsInWorkoutRandomWords(
            _selectWithRuleElementLangsInWorkoutRandomWords);
        _formElementWorkoutRandomWords.setSelectWithRuleElementLangsOutWorkoutRandomWords(
            _selectWithRuleElementLangsOutWorkoutRandomWords);
        _formElementWorkoutRandomWords.setSelectWithRuleElementNumbersOfWords(_selectWithRuleElementNumbersOfWords);

        await _formElementWorkoutRandomWords.prepare();
    }
}
//---

// Элементы таблицы + Таблица "Незавершенные тренировки" ---
function prepareButtonElementRefresh() {
    let button = document.getElementById("button_refresh");
    let img = document.getElementById("img_button_refresh");
    if (button && img) {
        let buttonWithImgElement = new ButtonWithImgElement(button, img);
        _buttonElementRefresh = new ButtonElementRefresh(buttonWithImgElement);
        _buttonElementRefresh.prepare();
    }
}

async function prepareTableWithTimerElementWorkoutsNotOver() {
    let table = document.getElementById("table_workouts_not_over");
    let colgroup = document.getElementById("colgroup_workouts_not_over");
    let thead = document.getElementById("thead_workouts_not_over");
    let tbody = document.getElementById("tbody_workouts_not_over");
    if (table && colgroup && thead && tbody) {
        _tableWithTimerElementWorkoutsNotOver = new TableWithTimerElementWorkoutsNotOver(table, colgroup, thead, tbody);
        _tableWithTimerElementWorkoutsNotOver.setButtonElementRefresh(_buttonElementRefresh);
        _tableWithTimerElementWorkoutsNotOver.setWorkoutTypeCode(_CURRENT_WORKOUT_TYPE.CODE);
        _tableWithTimerElementWorkoutsNotOver.setTimeout(_GENERAL_TIMEOUT);

        await _tableWithTimerElementWorkoutsNotOver.prepare();
    }
}
//---