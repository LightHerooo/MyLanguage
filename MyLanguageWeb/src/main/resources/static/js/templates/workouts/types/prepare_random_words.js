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
    SelectWithRuleElementLangsInPrepareWorkoutRandomWords
} from "../../../classes/html/select/entity/lang/workout/random_words/select_with_rule_element_langs_in_prepare_workout_random_words.js";

import {
    SelectWithRuleElementLangsOutPrepareWorkoutRandomWords
} from "../../../classes/html/select/entity/lang/workout/random_words/select_with_rule_element_langs_out_prepare_workout_random_words.js";

import {
    FormElementWorkoutPrepareRandomWords
} from "../../../classes/html/form/entity/workout/form_element_workout_prepare_random_words.js";

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
let _selectWithRuleElementLangsInPrepareWorkoutRandomWords;
let _selectWithRuleElementLangsOutPrepareWorkoutRandomWords;
let _selectWithRuleElementNumbersOfWords;

let _formElementWorkoutPrepareRandomWords;
//---

// Элементы таблицы + Таблица "Незавершенные тренировки" ---
let _buttonElementRefresh;

let _tableWithTimerElementWorkoutsNotOver;
//---

window.onload = async function() {
    // Элементы формы + форма "Тренировка режима 'Случайные слова'" ---
    await prepareCoupleSelectElementsForWorkoutRandomWords();
    await prepareSelectWithRuleElementNumbersOfWords();

    await prepareFormElementWorkoutPrepareRandomWords();
    //---

    // Элементы таблицы + Таблица "Незавершенные тренировки" ---
    prepareButtonElementRefresh();

    await prepareTableWithTimerElementWorkoutsNotOver();
    //---

    if (_formElementWorkoutPrepareRandomWords) {
        _formElementWorkoutPrepareRandomWords.setTableWithTimerElementWorkoutsNotOver(_tableWithTimerElementWorkoutsNotOver);
        _formElementWorkoutPrepareRandomWords.changeDisabledStatusToFormElements(false);
    }

    if (_tableWithTimerElementWorkoutsNotOver) {
        _tableWithTimerElementWorkoutsNotOver.setFormElementCreateNewWorkout(_formElementWorkoutPrepareRandomWords);

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
            new SelectWithRuleElementLangsIn(divContainer, select, spanFlag, true, true);
        _selectWithRuleElementLangsInPrepareWorkoutRandomWords =
            new SelectWithRuleElementLangsInPrepareWorkoutRandomWords(selectWithRuleElementLangsIn);

        _selectWithRuleElementLangsInPrepareWorkoutRandomWords.prepare();
    }
    //---

    // Выходящий язык ---
    divContainer = document.getElementById("div_select_langs_out");
    select = document.getElementById("select_langs_out");
    spanFlag = document.getElementById("span_flag_select_langs_out");
    if (divContainer && select && spanFlag) {
        let selectWithRuleElementLangsOut =
            new SelectWithRuleElementLangsOut(divContainer, select, spanFlag, true, true);
        _selectWithRuleElementLangsOutPrepareWorkoutRandomWords =
            new SelectWithRuleElementLangsOutPrepareWorkoutRandomWords(selectWithRuleElementLangsOut);

        _selectWithRuleElementLangsOutPrepareWorkoutRandomWords.prepare();
    }
    //---

    // Связывваем два списка между собой ---
    _selectWithRuleElementLangsInPrepareWorkoutRandomWords.setSelectWithRuleElementLangsOutPrepareWorkoutRandomWords(
        _selectWithRuleElementLangsOutPrepareWorkoutRandomWords);
    _selectWithRuleElementLangsOutPrepareWorkoutRandomWords.setSelectWithRuleElementLangsInPrepareWorkoutRandomWords(
        _selectWithRuleElementLangsInPrepareWorkoutRandomWords);
    //---

    // Заполняем списки ---
    await _selectWithRuleElementLangsInPrepareWorkoutRandomWords.fill();
    await _selectWithRuleElementLangsOutPrepareWorkoutRandomWords.fill();
    //---
}

async function prepareSelectWithRuleElementNumbersOfWords() {
    let select = document.getElementById("select_numbers_of_words");
    if (select) {
        _selectWithRuleElementNumbersOfWords = new SelectWithRuleElementNumbers(
            select, _NUMBERS_OF_WORDS_ARR, true, true);
        _selectWithRuleElementNumbersOfWords.prepare();

        await _selectWithRuleElementNumbersOfWords.fill();
    }
}

async function prepareFormElementWorkoutPrepareRandomWords() {
    let form = document.getElementById("form_workout_prepare_random_words");
    let buttonSubmit = document.getElementById("button_submit_workout_prepare_random_words");
    let buttonReset = document.getElementById("button_reset_workout_prepare_random_words");
    let divMessageContainer = document.getElementById("div_message_container_workout_prepare_random_words");
    if (form && buttonSubmit && buttonReset && divMessageContainer) {
        _formElementWorkoutPrepareRandomWords = new FormElementWorkoutPrepareRandomWords(form, buttonSubmit, divMessageContainer);
        _formElementWorkoutPrepareRandomWords.setButtonReset(buttonReset);
        _formElementWorkoutPrepareRandomWords.setSelectWithRuleElementLangsInPrepareWorkoutRandomWords(
            _selectWithRuleElementLangsInPrepareWorkoutRandomWords);
        _formElementWorkoutPrepareRandomWords.setSelectWithRuleElementLangsOutPrepareWorkoutRandomWords(
            _selectWithRuleElementLangsOutPrepareWorkoutRandomWords);
        _formElementWorkoutPrepareRandomWords.setSelectWithRuleElementNumbersOfWords(_selectWithRuleElementNumbersOfWords);

        await _formElementWorkoutPrepareRandomWords.prepare();
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