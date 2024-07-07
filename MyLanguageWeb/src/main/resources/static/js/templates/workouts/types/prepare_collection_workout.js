import {
    WorkoutTypes
} from "../../../classes/dto/entity/workout_type/workout_types.js";

import {
    SelectWithRuleElementCustomerCollections
} from "../../../classes/html/select/entity/customer_collection/select_with_rule_element_customer_collections.js";

import {
    ButtonWithImgElement
} from "../../../classes/html/button/with_img/button_with_img_element.js";

import {
    SelectWithRuleElementLangsIn
} from "../../../classes/html/select/entity/lang/in/select_with_rule_element_langs_in.js";

import {
    SelectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout
} from "../../../classes/html/select/entity/lang/workout/collection_workout/select_with_rule_element_langs_out_prepare_workout_collection_workout.js";

import {
    FormElementWorkoutPrepareCollectionWorkout
} from "../../../classes/html/form/entity/workout/form_element_workout_prepare_collection_workout.js";

import {
    InputTextElement
} from "../../../classes/html/input/text/input_text_element.js";

import {
    InputTextElementFinder
} from "../../../classes/html/input/text/elements/input_text_element_finder.js";

import {
    DivWithTimerElementCustomerCollectionInfo
} from "../../../classes/html/div/entity/customer_collection/info/div_with_timer_element_customer_collection_info.js";

import {
    SelectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout
} from "../../../classes/html/select/entity/customer_collection/workout/collection_workout/select_with_rule_element_customer_collections_workout_collection_workout.js";

import {
    ButtonElementRefresh
} from "../../../classes/html/button/elements/button_element_refresh.js";

import {
    TableWithTimerElementWorkoutsNotOver
} from "../../../classes/html/table/entity/workout/table_with_timer_element_workouts_not_over.js";

import {
    TableWithTimerElementWordsInCollection
} from "../../../classes/html/table/entity/word_in_collection/table_with_timer_element_words_in_collection.js";

const _CURRENT_WORKOUT_TYPE = new WorkoutTypes().COLLECTION_WORKOUT;
const _GENERAL_TIMEOUT = 1000;

// Элементы формы + форма "Тренировка режима 'Тренировка коллекции'" ---
let _selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout;
let _selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout;

let _formElementWorkoutPrepareCollectionWorkout;
//---

// Элементы таблицы + таблица "Незавершённые тренировки" ---
let _buttonElementRefreshWorkoutsNotOver;

let _tableWithTimerElementWorkoutsNotOver;
//---

// Контейнер "Информация о коллекции" ---
let _divWithTimerElementCustomerCollectionInfo;
//---

// Элементы таблицы + таблица "Слова в коллекции" ---
let _inputTextElementFinderWordsInCollection;
let _buttonElementRefreshWordsInCollection;

let _tableWithTimerElementWordsInCollection;
//---

window.onload = async function() {
    // Элементы формы + форма "Тренировка режима 'Тренировка коллекции'" ---
    await prepareCoupleSelectElementsForWorkoutCollectionWorkout();

    await prepareFormElementWorkoutPrepareCollectionWorkout();
    //---

    // Элементы таблицы + таблица "Незавершённые тренировки" ---
    prepareButtonElementRefreshWorkoutsNotOver();

    await prepareTableWithTimerElementWorkoutsNotOver();
    //---

    // Контейнер "Информация о коллекции" ---
    await prepareDivWithTimerElementCustomerCollectionInfo();
    //---

    // Элементы таблицы + таблица "Слова в коллекции" ---
    prepareButtonElementRefreshWordsInCollection();
    prepareInputTextElementFinderWordsInCollection();

    await prepareTableWithTimerElementWordsInCollection();
    //---

    if (_formElementWorkoutPrepareCollectionWorkout) {
        _formElementWorkoutPrepareCollectionWorkout.setTableWithTimerElementWorkoutsNotOver(_tableWithTimerElementWorkoutsNotOver);
        _formElementWorkoutPrepareCollectionWorkout.changeDisabledStatusToFormElements(false);
    }

    if (_tableWithTimerElementWorkoutsNotOver) {
        _tableWithTimerElementWorkoutsNotOver.setFormElementCreateNewWorkout(_formElementWorkoutPrepareCollectionWorkout);

        _tableWithTimerElementWorkoutsNotOver.startToFill();
        _tableWithTimerElementWorkoutsNotOver.changeDisabledStatusToTableInstruments(false);
    }

    if (_divWithTimerElementCustomerCollectionInfo) {
        _divWithTimerElementCustomerCollectionInfo.startToFill();
    }

    if (_tableWithTimerElementWordsInCollection) {
        _tableWithTimerElementWordsInCollection.startToFill();
        _tableWithTimerElementWordsInCollection.changeDisabledStatusToTableInstruments(false);
    }
}

// Элементы формы + форма "Тренировка режима 'Тренировка коллекции'" ---
async function prepareCoupleSelectElementsForWorkoutCollectionWorkout() {
    // Коллекции пользователя ---
    let divContainer = document.getElementById("div_select_customer_collections");
    let select = document.getElementById("select_customer_collections");
    let spanFlag = document.getElementById("span_flag_select_customer_collections");
    if (divContainer && select && spanFlag) {
        let selectWithRuleElementCustomerCollections =
            new SelectWithRuleElementCustomerCollections(divContainer, select, spanFlag, true, true);
        _selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout =
            new SelectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout(selectWithRuleElementCustomerCollections);

        _selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout.prepare();
    }
    //---

    // Выходящий язык ---
    divContainer = document.getElementById("div_select_langs_out");
    select = document.getElementById("select_langs_out");
    spanFlag = document.getElementById("span_flag_select_langs_out");
    if (divContainer && select && spanFlag) {
        let selectWithRuleElementLangsIn =
            new SelectWithRuleElementLangsIn(divContainer, select, spanFlag, true, true);
        _selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout =
            new SelectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout(selectWithRuleElementLangsIn);

        _selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout.prepare();
    }
    //---

    // Связывваем два списка между собой ---
    _selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout
        .setSelectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout(_selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout);
    _selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout
        .setSelectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout(_selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout)
    //---

    // Заполняем списки ---
    await _selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout.fill();
    await _selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout.fill();
    //---
}

async function prepareFormElementWorkoutPrepareCollectionWorkout() {
    let form = document.getElementById("form_workout_prepare_collection_workout");
    let buttonSubmit = document.getElementById("button_submit_workout_prepare_collection_workout");
    let buttonReset = document.getElementById("button_reset_workout_prepare_collection_workout");
    let divMessageContainer = document.getElementById("div_message_container_workout_prepare_collection_workout");
    if (form && buttonSubmit && buttonReset && divMessageContainer) {
        _formElementWorkoutPrepareCollectionWorkout = new FormElementWorkoutPrepareCollectionWorkout(
            form, buttonSubmit, divMessageContainer);
        _formElementWorkoutPrepareCollectionWorkout.setButtonReset(buttonReset);
        _formElementWorkoutPrepareCollectionWorkout.setSelectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout(
            _selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout);
        _formElementWorkoutPrepareCollectionWorkout.setSelectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout(
            _selectWithRuleElementLangsOutPrepareWorkoutCollectionWorkout);

        await _formElementWorkoutPrepareCollectionWorkout.prepare();
    }
}
//---

// Элементы таблицы + таблица "Незавершённые тренировки" ---
function prepareButtonElementRefreshWorkoutsNotOver() {
    let button = document.getElementById("button_refresh_workouts_not_over");
    let img = document.getElementById("img_refresh_workouts_not_over");
    if (button && img) {
        let buttonWithImgElement = new ButtonWithImgElement(button, img);
        _buttonElementRefreshWorkoutsNotOver = new ButtonElementRefresh(buttonWithImgElement);
        _buttonElementRefreshWorkoutsNotOver.prepare();
    }
}

async function prepareTableWithTimerElementWorkoutsNotOver() {
    let table = document.getElementById("table_workouts_not_over");
    let colgroup = document.getElementById("colgroup_workouts_not_over");
    let thead = document.getElementById("thead_workouts_not_over");
    let tbody = document.getElementById("tbody_workouts_not_over");
    if (table && colgroup && thead && tbody) {
        _tableWithTimerElementWorkoutsNotOver = new TableWithTimerElementWorkoutsNotOver(table, colgroup, thead, tbody);
        _tableWithTimerElementWorkoutsNotOver.setButtonElementRefresh(_buttonElementRefreshWorkoutsNotOver);
        _tableWithTimerElementWorkoutsNotOver.setWorkoutTypeCode(_CURRENT_WORKOUT_TYPE.CODE);
        _tableWithTimerElementWorkoutsNotOver.setTimeout(_GENERAL_TIMEOUT);

        await _tableWithTimerElementWorkoutsNotOver.prepare();
    }
}
//---

// Контейнер "Информация о коллекции" ---
async function prepareDivWithTimerElementCustomerCollectionInfo() {
    let div = document.getElementById("div_customer_collection_info");
    if (div) {
        _divWithTimerElementCustomerCollectionInfo = new DivWithTimerElementCustomerCollectionInfo(div);
        _divWithTimerElementCustomerCollectionInfo.setSelectElementCustomerCollections(
            _selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout);
        _divWithTimerElementCustomerCollectionInfo.setTimeout(_GENERAL_TIMEOUT);

        await _divWithTimerElementCustomerCollectionInfo.prepare();
    }
}
//---

// Элементы таблицы + таблица "Слова в коллекции" ---
function prepareInputTextElementFinderWordsInCollection() {
    let inputText = document.getElementById("input_text_finder_words_in_collection");
    if (inputText) {
        let inputTextElement = new InputTextElement(inputText);
        _inputTextElementFinderWordsInCollection = new InputTextElementFinder(inputTextElement);

        _inputTextElementFinderWordsInCollection.prepare();
    }
}

function prepareButtonElementRefreshWordsInCollection() {
    let button = document.getElementById("button_refresh_words_in_collection");
    let img = document.getElementById("img_refresh_words_in_collection");
    if (button && img) {
        let buttonWithImgElement = new ButtonWithImgElement(button, img);
        _buttonElementRefreshWordsInCollection = new ButtonElementRefresh(buttonWithImgElement);
        _buttonElementRefreshWordsInCollection.prepare();
    }
}

async function prepareTableWithTimerElementWordsInCollection() {
    let table = document.getElementById("table_words_in_collection");
    let colgroup = document.getElementById("colgroup_words_in_collection");
    let thead = document.getElementById("thead_words_in_collection");
    let tbody = document.getElementById("tbody_words_in_collection");
    if (table && colgroup && thead && tbody) {
        _tableWithTimerElementWordsInCollection = new TableWithTimerElementWordsInCollection(
            table, colgroup, thead, tbody, false);
        _tableWithTimerElementWordsInCollection.setTimeout(_GENERAL_TIMEOUT);
        _tableWithTimerElementWordsInCollection.setInputTextElementFinder(_inputTextElementFinderWordsInCollection);
        _tableWithTimerElementWordsInCollection.setSelectElementCustomerCollections(
            _selectWithRuleElementCustomerCollectionsPrepareWorkoutCollectionWorkout);
        _tableWithTimerElementWordsInCollection.setButtonElementRefresh(
            _buttonElementRefreshWordsInCollection);
        _tableWithTimerElementWordsInCollection.setDivWithTimerElementCustomerCollectionInfo(
            _divWithTimerElementCustomerCollectionInfo);

        await _tableWithTimerElementWordsInCollection.prepare();
    }
}
//---