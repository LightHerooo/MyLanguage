import {
    WorkoutTypesAPI
} from "../../classes/api/entity/workout_types_api.js";

import {
    HttpStatuses
} from "../../classes/api/classes/http/http_statuses.js";

import {
    ResponseMessageResponseDTO
} from "../../classes/dto/other/response/response_message_response_dto.js";

import {
    SelectElementBoolean
} from "../../classes/html/select/elements/boolean/select_element_boolean.js";

import {
    ButtonWithImgElement
} from "../../classes/html/button/with_img/button_with_img_element.js";

import {
    ButtonWithImgAndSpanElement
} from "../../classes/html/button/with_img_and_span/button_with_img_and_span_element.js";

import {
    ButtonWithImgAndSpanElementDoubleClick
} from "../../classes/html/button/with_img_and_span/button_with_img_and_span_element_double_click.js";

import {
    ButtonWithImgAndSpanElementTypes
} from "../../classes/html/button/with_img_and_span/button_with_img_and_span_element_types.js";

import {
    InputTextElement
} from "../../classes/html/input/text/input_text_element.js";

import {
    InputTextElementFinder
} from "../../classes/html/input/text/elements/input_text_element_finder.js";

import {
    EntityValueRequestDTO
} from "../../classes/dto/other/request/entity/value/entity_value_request_dto.js";

import {
    TableWithTimerElementWorkoutTypes
} from "../../classes/html/table/entity/workout_type/table_with_timer_element_workout_types.js";

import {
    ButtonElementRefresh
} from "../../classes/html/button/elements/button_element_refresh.js";

const _WORKOUT_TYPES_API = new WorkoutTypesAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _BUTTON_WITH_IMG_AND_SPAN_ELEMENT_TYPES = new ButtonWithImgAndSpanElementTypes();

const _GENERAL_TIMEOUT = 1000;

// Действия ---
let _buttonWithImgAndTextElementDoubleClickTurnOnAll;
let _buttonWithImgAndTextElementDoubleClickTurnOffAll;
//---

// Элементы для поиска в таблице + таблица "Режимы тренировок" ---
let _inputTextElementFinder;
let _selectElementBooleanIsActive;
let _buttonWithImgElementRefresh;

let _tableWithTimerElementWorkoutTypes;
//---

window.onload = async function() {
    // Действия ---
    prepareButtonWithImgAndTextElementDoubleClickTurnOnAll();
    prepareButtonWithImgAndTextElementDoubleClickTurnOffAll();
    //---

    // Элементы для поиска в таблице + таблица "Режимы тренировок" ---
    prepareInputTextElementFinder();
    await prepareSelectElementBooleanIsActive();
    prepareButtonWithImgElementRefresh();

    await prepareTableWithTimerElementWorkoutTypes();
    //---

    changeDisabledStatusToActions(false);

    // Запускаем таймеры ---
    if (_tableWithTimerElementWorkoutTypes) {
        _tableWithTimerElementWorkoutTypes.startToFill();
        _tableWithTimerElementWorkoutTypes.changeDisabledStatusToTableInstruments(false);
    }
    //---
}

// Действия ---
function prepareButtonWithImgAndTextElementDoubleClickTurnOnAll() {
    let button = document.getElementById("button_turn_on_all");
    let span = document.getElementById("span_turn_on_all");
    let img = document.getElementById("img_turn_on_all");
    if (button && span && img) {
        let buttonWithImgAndTextElement = new ButtonWithImgAndSpanElement(button, img, span);
        let buttonWithImgAndSpanElementDoubleClick =
            new ButtonWithImgAndSpanElementDoubleClick(buttonWithImgAndTextElement);
        buttonWithImgAndSpanElementDoubleClick.setAfterDoubleClickFunction(async function() {
            let entityValueRequestDTO = new EntityValueRequestDTO();
            entityValueRequestDTO.setValue(true);

            let jsonResponse = await _WORKOUT_TYPES_API.PATCH.switchAll(entityValueRequestDTO);
            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                if (_tableWithTimerElementWorkoutTypes) {
                    _tableWithTimerElementWorkoutTypes.startToFill();
                }

                buttonWithImgAndSpanElementDoubleClick.refresh();
            } else {
                buttonWithImgAndSpanElementDoubleClick.turnOff(true);
                buttonWithImgAndSpanElementDoubleClick.changeTo(
                    _BUTTON_WITH_IMG_AND_SPAN_ELEMENT_TYPES.DENY);

                buttonWithImgAndSpanElementDoubleClick.changeSpanText(
                    new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage());
            }
        });
        buttonWithImgAndSpanElementDoubleClick.prepare();

        _buttonWithImgAndTextElementDoubleClickTurnOnAll = buttonWithImgAndSpanElementDoubleClick;
    }
}

function prepareButtonWithImgAndTextElementDoubleClickTurnOffAll() {
    let button = document.getElementById("button_turn_off_all");
    let span = document.getElementById("span_turn_off_all");
    let img = document.getElementById("img_turn_off_all");
    if (button && span && img) {
        let buttonWithImgAndTextElement = new ButtonWithImgAndSpanElement(button, img, span);
        let buttonWithImgAndSpanElementDoubleClick =
            new ButtonWithImgAndSpanElementDoubleClick(buttonWithImgAndTextElement);
        buttonWithImgAndSpanElementDoubleClick.setAfterDoubleClickFunction(async function() {
            let entityValueRequestDTO = new EntityValueRequestDTO();
            entityValueRequestDTO.setValue(true);

            let jsonResponse = await _WORKOUT_TYPES_API.PATCH.switchAll(entityValueRequestDTO);
            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                if (_tableWithTimerElementWorkoutTypes) {
                    _tableWithTimerElementWorkoutTypes.startToFill();
                }

                buttonWithImgAndSpanElementDoubleClick.refresh();
            } else {
                buttonWithImgAndSpanElementDoubleClick.turnOff(true);

                buttonWithImgAndSpanElementDoubleClick.changeTo(
                    _BUTTON_WITH_IMG_AND_SPAN_ELEMENT_TYPES.DENY);
                buttonWithImgAndSpanElementDoubleClick.changeSpanText(
                    new ResponseMessageResponseDTO(jsonResponse.getJson()).getMessage());
            }
        })
        buttonWithImgAndSpanElementDoubleClick.prepare();

        _buttonWithImgAndTextElementDoubleClickTurnOffAll = buttonWithImgAndSpanElementDoubleClick;
    }
}

function changeDisabledStatusToActions(isDisabled) {
    if (_buttonWithImgAndTextElementDoubleClickTurnOnAll) {
        _buttonWithImgAndTextElementDoubleClickTurnOnAll.changeDisabledStatus(isDisabled);
    }

    if (_buttonWithImgAndTextElementDoubleClickTurnOffAll) {
        _buttonWithImgAndTextElementDoubleClickTurnOffAll.changeDisabledStatus(isDisabled);
    }
}
//---

// Элементы для поиска в таблице + таблица "Режимы тренировок" ---
function prepareInputTextElementFinder() {
    let inputText = document.getElementById("input_text_finder");
    if (inputText) {
        let inputTextElement = new InputTextElement(inputText);
        _inputTextElementFinder = new InputTextElementFinder(inputTextElement);
        _inputTextElementFinder.prepare();
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

function prepareButtonWithImgElementRefresh() {
    let button = document.getElementById("button_refresh");
    let img = document.getElementById("img_button_refresh");
    if (button && img) {
        let buttonWithImgElement = new ButtonWithImgElement(button, img);
        _buttonWithImgElementRefresh = new ButtonElementRefresh(buttonWithImgElement);
        _buttonWithImgElementRefresh.prepare();
    }
}

async function prepareTableWithTimerElementWorkoutTypes() {
    let table = document.getElementById("table_workout_types");
    let colgroup = document.getElementById("colgroup_workout_types");
    let thead = document.getElementById("thead_workout_types");
    let tbody = document.getElementById("tbody_workout_types");
    if (table && colgroup && thead && tbody) {
        _tableWithTimerElementWorkoutTypes = new TableWithTimerElementWorkoutTypes(table, colgroup, thead, tbody);
        _tableWithTimerElementWorkoutTypes.setInputTextElementFinder(_inputTextElementFinder);
        _tableWithTimerElementWorkoutTypes.setSelectElementBooleanIsActive(_selectElementBooleanIsActive);
        _tableWithTimerElementWorkoutTypes.setButtonElementRefresh(_buttonWithImgElementRefresh);
        _tableWithTimerElementWorkoutTypes.setTimeout(_GENERAL_TIMEOUT);

        await _tableWithTimerElementWorkoutTypes.prepare();
    }
}
//---


