import {
    LangsAPI
} from "../../../classes/api/entity/langs_api.js";

import {
    HttpStatuses
} from "../../../classes/api/classes/http/http_statuses.js";

import {
    ResponseMessageResponseDTO
} from "../../../classes/dto/other/response/response_message_response_dto.js";

import {
    SelectElementBoolean
} from "../../../classes/html/select/elements/boolean/select_element_boolean.js";

import {
    ButtonWithImgElement
} from "../../../classes/html/button/with_img/button_with_img_element.js";

import {
    ButtonWithImgAndSpanElement
} from "../../../classes/html/button/with_img_and_span/button_with_img_and_span_element.js";

import {
    ButtonWithImgAndSpanElementDoubleClick
} from "../../../classes/html/button/with_img_and_span/button_with_img_and_span_element_double_click.js";

import {
    ButtonWithImgAndSpanElementTypes
} from "../../../classes/html/button/with_img_and_span/button_with_img_and_span_element_types.js";

import {
    InputTextElement
} from "../../../classes/html/input/text/input_text_element.js";

import {
    InputTextElementFinder
} from "../../../classes/html/input/text/elements/input_text_element_finder.js";

import {
    ButtonElementRefresh
} from "../../../classes/html/button/elements/button_element_refresh.js";

import {
    TableWithTimerElementLangs
} from "../../../classes/html/table/entity/lang/table_with_timer_element_langs.js";

const _LANGS_API = new LangsAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _BUTTON_WITH_IMG_AND_SPAN_ELEMENT_TYPES = new ButtonWithImgAndSpanElementTypes();

const _GENERAL_TIMEOUT = 1000;

// Действия ---
let _buttonWithImgAndTextElementDoubleClickTurnOnSupportedLangsIn;
let _buttonWithImgAndTextElementDoubleClickTurnOffUnsupportedLangsIn;
let _buttonWithImgAndTextElementDoubleClickTurnOffLangsIn;
let _buttonWithImgAndTextElementDoubleClickTurnOnSupportedLangsOut;
let _buttonWithImgAndTextElementDoubleClickTurnOffUnsupportedLangsOut;
let _buttonWithImgAndTextElementDoubleClickTurnOffLangsOut;
//---

// Элементы для поиска в таблице + таблица "Языки" ---
let _inputTextElementFinder;
let _selectElementBooleanIsActiveForIn;
let _selectElementBooleanIsActiveForOut;
let _buttonElementRefresh;

let _tableWithTimerElementLangs;
//---

window.onload = async function() {
    // Действия ---
    prepareButtonWithImgAndTextElementDoubleClickTurnOnSupportedLangsIn();
    prepareButtonWithImgAndTextElementDoubleClickTurnOffUnsupportedLangsIn();
    prepareButtonWithImgAndTextElementDoubleClickTurnOffLangsIn();
    prepareButtonWithImgAndTextElementDoubleClickTurnOnSupportedLangsOut();
    prepareButtonWithImgAndTextElementDoubleClickTurnOffUnsupportedLangsOut();
    prepareButtonWithImgAndTextElementDoubleClickTurnOffLangsOut();
    //---

    // Элементы для поиска в таблице + таблица "Языки" ---
    prepareInputTextElementFinder();
    await prepareSelectElementBooleanIsActiveForIn();
    await prepareSelectElementBooleanIsActiveForOut();
    prepareButtonElementRefresh();

    await prepareTableWithTimerElementLangs();
    //---

    changeDisabledStatusToActions(false);

    // Запускаем все таймеры ---
    if (_tableWithTimerElementLangs) {
        _tableWithTimerElementLangs.startToFill();
        _tableWithTimerElementLangs.changeDisabledStatusToTableInstruments(false);
    }
    //---
}

// Действия ---
function prepareButtonWithImgAndTextElementDoubleClickTurnOnSupportedLangsIn() {
    let button = document.getElementById("button_turn_on_supported_langs_in");
    let span = document.getElementById("span_turn_on_supported_langs_in");
    let img = document.getElementById("img_turn_on_supported_langs_in");
    if (button && span && img) {
        let buttonWithImgAndTextElement = new ButtonWithImgAndSpanElement(button, img, span);
        let buttonWithImgAndSpanElementDoubleClick =
            new ButtonWithImgAndSpanElementDoubleClick(buttonWithImgAndTextElement);
        buttonWithImgAndSpanElementDoubleClick.setAfterDoubleClickFunction(async function() {
            let jsonResponse = await _LANGS_API.PATCH.turnOnSupportedLangsIn();
            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                if (_tableWithTimerElementLangs) {
                    _tableWithTimerElementLangs.startToFill();
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

        _buttonWithImgAndTextElementDoubleClickTurnOnSupportedLangsIn = buttonWithImgAndSpanElementDoubleClick;
    }
}

function prepareButtonWithImgAndTextElementDoubleClickTurnOffUnsupportedLangsIn() {
    let button = document.getElementById("button_turn_off_unsupported_langs_in");
    let span = document.getElementById("span_turn_off_unsupported_langs_in");
    let img = document.getElementById("img_turn_off_unsupported_langs_in");
    if (button && span && img) {
        let buttonWithImgAndTextElement = new ButtonWithImgAndSpanElement(button, img, span);
        let buttonWithImgAndSpanElementDoubleClick =
            new ButtonWithImgAndSpanElementDoubleClick(buttonWithImgAndTextElement);
        buttonWithImgAndSpanElementDoubleClick.setAfterDoubleClickFunction(async function() {
            let jsonResponse = await _LANGS_API.PATCH.turnOffUnsupportedLangsIn();
            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                if (_tableWithTimerElementLangs) {
                    _tableWithTimerElementLangs.startToFill();
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

        _buttonWithImgAndTextElementDoubleClickTurnOffUnsupportedLangsIn = buttonWithImgAndSpanElementDoubleClick;
    }
}

function prepareButtonWithImgAndTextElementDoubleClickTurnOffLangsIn() {
    let button = document.getElementById("button_turn_off_langs_in");
    let span = document.getElementById("span_turn_off_langs_in");
    let img = document.getElementById("img_turn_off_langs_in");
    if (button && span && img) {
        let buttonWithImgAndTextElement = new ButtonWithImgAndSpanElement(button, img, span);
        let buttonWithImgAndSpanElementDoubleClick =
            new ButtonWithImgAndSpanElementDoubleClick(buttonWithImgAndTextElement);
        buttonWithImgAndSpanElementDoubleClick.setAfterDoubleClickFunction(async function() {
            let jsonResponse = await _LANGS_API.PATCH.turnOffLangsIn();
            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                if (_tableWithTimerElementLangs) {
                    _tableWithTimerElementLangs.startToFill();
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

        _buttonWithImgAndTextElementDoubleClickTurnOffLangsIn = buttonWithImgAndSpanElementDoubleClick;
    }
}

function prepareButtonWithImgAndTextElementDoubleClickTurnOnSupportedLangsOut() {
    let button = document.getElementById("button_turn_on_supported_langs_out");
    let span = document.getElementById("span_turn_on_supported_langs_out");
    let img = document.getElementById("img_turn_on_supported_langs_out");
    if (button && span && img) {
        let buttonWithImgAndTextElement = new ButtonWithImgAndSpanElement(button, img, span);
        let buttonWithImgAndSpanElementDoubleClick =
            new ButtonWithImgAndSpanElementDoubleClick(buttonWithImgAndTextElement);
        buttonWithImgAndSpanElementDoubleClick.setAfterDoubleClickFunction(async function() {
            let jsonResponse = await _LANGS_API.PATCH.turnOnSupportedLangsOut();
            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                if (_tableWithTimerElementLangs) {
                    _tableWithTimerElementLangs.startToFill();
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

        _buttonWithImgAndTextElementDoubleClickTurnOnSupportedLangsOut = buttonWithImgAndSpanElementDoubleClick;
    }
}

function prepareButtonWithImgAndTextElementDoubleClickTurnOffUnsupportedLangsOut() {
    let button = document.getElementById("button_turn_off_unsupported_langs_out");
    let span = document.getElementById("span_turn_off_unsupported_langs_out");
    let img = document.getElementById("img_turn_off_unsupported_langs_out");
    if (button && span && img) {
        let buttonWithImgAndTextElement = new ButtonWithImgAndSpanElement(button, img, span);
        let buttonWithImgAndSpanElementDoubleClick =
            new ButtonWithImgAndSpanElementDoubleClick(buttonWithImgAndTextElement);
        buttonWithImgAndSpanElementDoubleClick.setAfterDoubleClickFunction(async function() {
            let jsonResponse = await _LANGS_API.PATCH.turnOffUnsupportedLangsOut();
            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                if (_tableWithTimerElementLangs) {
                    _tableWithTimerElementLangs.startToFill();
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

        _buttonWithImgAndTextElementDoubleClickTurnOffUnsupportedLangsOut = buttonWithImgAndSpanElementDoubleClick;
    }
}

function prepareButtonWithImgAndTextElementDoubleClickTurnOffLangsOut() {
    let button = document.getElementById("button_turn_off_langs_out");
    let span = document.getElementById("span_turn_off_langs_out");
    let img = document.getElementById("img_turn_off_langs_out");
    if (button && span && img) {
        let buttonWithImgAndTextElement = new ButtonWithImgAndSpanElement(button, img, span);
        let buttonWithImgAndSpanElementDoubleClick =
            new ButtonWithImgAndSpanElementDoubleClick(buttonWithImgAndTextElement);
        buttonWithImgAndSpanElementDoubleClick.setAfterDoubleClickFunction(async function() {
            let jsonResponse = await _LANGS_API.PATCH.turnOffLangsOut();
            if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                if (_tableWithTimerElementLangs) {
                    _tableWithTimerElementLangs.startToFill();
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

        _buttonWithImgAndTextElementDoubleClickTurnOffLangsOut = buttonWithImgAndSpanElementDoubleClick;
    }
}

function changeDisabledStatusToActions(isDisabled) {
    if (_buttonWithImgAndTextElementDoubleClickTurnOnSupportedLangsIn) {
        _buttonWithImgAndTextElementDoubleClickTurnOnSupportedLangsIn.changeDisabledStatus(isDisabled);
    }

    if (_buttonWithImgAndTextElementDoubleClickTurnOffUnsupportedLangsIn) {
        _buttonWithImgAndTextElementDoubleClickTurnOffUnsupportedLangsIn.changeDisabledStatus(isDisabled);
    }

    if (_buttonWithImgAndTextElementDoubleClickTurnOffLangsIn) {
        _buttonWithImgAndTextElementDoubleClickTurnOffLangsIn.changeDisabledStatus(isDisabled);
    }

    if (_buttonWithImgAndTextElementDoubleClickTurnOnSupportedLangsOut) {
        _buttonWithImgAndTextElementDoubleClickTurnOnSupportedLangsOut.changeDisabledStatus(isDisabled);
    }

    if (_buttonWithImgAndTextElementDoubleClickTurnOffUnsupportedLangsOut) {
        _buttonWithImgAndTextElementDoubleClickTurnOffUnsupportedLangsOut.changeDisabledStatus(isDisabled);
    }

    if (_buttonWithImgAndTextElementDoubleClickTurnOffLangsOut) {
        _buttonWithImgAndTextElementDoubleClickTurnOffLangsOut.changeDisabledStatus(isDisabled);
    }
}
//---

// Элементы для поиска в таблице + таблица "Языки" ---
function prepareInputTextElementFinder() {
    let inputText = document.getElementById("input_text_finder");
    if (inputText) {
        let inputTextElement = new InputTextElement(inputText);
        _inputTextElementFinder = new InputTextElementFinder(inputTextElement);
        _inputTextElementFinder.prepare();
    }
}

async function prepareSelectElementBooleanIsActiveForIn() {
    let select = document.getElementById("select_is_active_for_in");
    if (select) {
        _selectElementBooleanIsActiveForIn = new SelectElementBoolean(select, true);
        _selectElementBooleanIsActiveForIn.prepare();
        await _selectElementBooleanIsActiveForIn.fill();
    }
}

async function prepareSelectElementBooleanIsActiveForOut() {
    let select = document.getElementById("select_is_active_for_out");
    if (select) {
        _selectElementBooleanIsActiveForOut = new SelectElementBoolean(select, true);
        _selectElementBooleanIsActiveForOut.prepare();
        await _selectElementBooleanIsActiveForOut.fill();
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

async function prepareTableWithTimerElementLangs() {
    let table = document.getElementById("table_langs");
    let colgroup = document.getElementById("colgroup_langs");
    let thead = document.getElementById("thead_langs");
    let tbody = document.getElementById("tbody_langs");
    if (table && colgroup && thead && tbody) {
        _tableWithTimerElementLangs = new TableWithTimerElementLangs(table, colgroup, thead, tbody);
        _tableWithTimerElementLangs.setInputTextElementFinder(_inputTextElementFinder);
        _tableWithTimerElementLangs.setSelectElementBooleanIsActiveForIn(_selectElementBooleanIsActiveForIn);
        _tableWithTimerElementLangs.setSelectElementBooleanIsActiveForOut(_selectElementBooleanIsActiveForOut);
        _tableWithTimerElementLangs.setButtonElementRefresh(_buttonElementRefresh);
        _tableWithTimerElementLangs.setTimeout(_GENERAL_TIMEOUT);

        await _tableWithTimerElementLangs.prepare();
    }
}
//---

